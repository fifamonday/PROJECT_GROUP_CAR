// หน้าต่างเลือกวันและเวลาจองจากหน้าแรก
  "use client";

  import { useMemo, useState } from "react";
  import { createBookingAction } from "@/features/bookings/actions";
  import type { Car } from "@/features/cars/schema";

  type BookingModalProps = {
    car: Car;
    onClose: () => void;
  };

  type CalendarPickerProps = {
    id: string;
    label: string;
    value: string;
    minDate: string;
    onChange: (value: string) => void;
  };

  function formatDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatThaiDate(value: string) {
    if (!value) return "เลือกวันที่";

    const date = new Date(`${value}T12:00:00`);

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ปฏิทินเลือกวันใน popup จอง
  function CalendarPicker({
    id,
    label,
    value,
    minDate,
    onChange,
  }: CalendarPickerProps) {
    const selectedDate = value
      ? new Date(`${value}T12:00:00`)
      : null;

    const [isOpen, setIsOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState(() => {
      const initialDate = selectedDate ?? new Date();
      return new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        1
      );
    });

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const mondayFirstOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarCells = [
      ...Array(mondayFirstOffset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    while (calendarCells.length % 7 !== 0) {
      calendarCells.push(null);
    }

    const todayValue = formatDateValue(new Date());

    function changeMonth(amount: number) {
      setVisibleMonth(new Date(year, month + amount, 1));
    }

    function chooseDate(day: number) {
      const date = new Date(year, month, day);
      const dateValue = formatDateValue(date);

      if (dateValue < minDate) return;

      onChange(dateValue);
      setIsOpen(false);
    }

    return (
      <div className="booking-form-group booking-date-group">
        <label id={`${id}-label`}>{label}</label>

        <button
          type="button"
          id={id}
          className={`booking-date-trigger ${isOpen ? "is-open" : ""}`}
          aria-labelledby={`${id}-label`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => {
            if (!isOpen && value) {
              const date = new Date(`${value}T12:00:00`);
              setVisibleMonth(
                new Date(date.getFullYear(), date.getMonth(), 1)
              );
            }

            setIsOpen((open) => !open);
          }}
        >
          <span className="booking-date-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
          </span>

          <span className="booking-date-text">
            <span className="booking-date-caption">{label}</span>
            <strong>{formatThaiDate(value)}</strong>
          </span>

          <span className="booking-date-chevron" aria-hidden="true">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="booking-calendar" role="dialog" aria-label={label}>
            <div className="booking-calendar-header">
              <button
                type="button"
                className="booking-calendar-nav"
                aria-label="เดือนก่อนหน้า"
                onClick={() => changeMonth(-1)}
              >
                ‹
              </button>

              <div className="booking-calendar-month">
                <strong>
                  {visibleMonth.toLocaleDateString("th-TH", {
                    month: "long",
                  })}
                </strong>
                <span>{year + 543}</span>
              </div>

              <button
                type="button"
                className="booking-calendar-nav"
                aria-label="เดือนถัดไป"
                onClick={() => changeMonth(1)}
              >
                ›
              </button>
            </div>

            <div className="booking-calendar-weekdays">
              {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map(
                (day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                )
              )}
            </div>

            <div className="booking-calendar-days">
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return (
                    <span
                      key={`empty-${index}`}
                      className="booking-calendar-empty"
                    />
                  );
                }

                const dateValue = formatDateValue(
                  new Date(year, month, day)
                );
                const isDisabled = dateValue < minDate;
                const isSelected = dateValue === value;
                const isToday = dateValue === todayValue;

                return (
                  <button
                    key={dateValue}
                    type="button"
                    className={[
                      "booking-calendar-day",
                      isSelected ? "selected" : "",
                      isToday ? "today" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    aria-label={`${day} ${visibleMonth.toLocaleDateString(
                      "th-TH",
                      { month: "long" }
                    )} ${year + 543}`}
                    onClick={() => chooseDate(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="booking-calendar-footer">
              <span>
                {value ? `วันที่เลือก: ${formatThaiDate(value)}` : "กรุณาเลือกวันที่"}
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default function BookingModal({
    car,
    onClose,
  }: BookingModalProps) {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const today = formatDateValue(new Date());

    const days = useMemo(() => {
      if (!startDate || !startTime || !endDate || !endTime) {
        return 0;
      }

      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (
        !Number.isFinite(start.getTime()) ||
        !Number.isFinite(end.getTime()) ||
        end <= start
      ) {
        return 0;
      }

      return Math.max(
        1,
        Math.ceil(
          (end.getTime() - start.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
    }, [startDate, startTime, endDate, endTime]);

    const total = days * car.pricePerDay;

    function showError(message: string) {
      setErrorMessage(message);
      setShowErrorPopup(true);
    }

    function handleStartDateChange(value: string) {
      setStartDate(value);

      if (endDate && value >= endDate) {
        setEndDate("");
        setEndTime("");
      }
    }

    function handleStartTimeChange(value: string) {
      setStartTime(value);

      if (
        startDate &&
        endDate === startDate &&
        endTime &&
        endTime <= value
      ) {
        setEndTime("");
      }
    }

    function handleEndDateChange(value: string) {
      setEndDate(value);

      if (value !== endDate) {
        setEndTime("");
      }
    }

    async function handleSubmit(
      event: React.FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();

      if (!startDate) {
        showError("กรุณาเลือกวันรับรถก่อน");
        return;
      }

      if (!startTime) {
        showError("กรุณาเลือกเวลารับรถก่อน");
        return;
      }

      if (!endDate) {
        showError("กรุณาเลือกวันคืนรถ");
        return;
      }

      if (!endTime) {
        showError("กรุณาเลือกเวลาคืนรถ");
        return;
      }

      if (startDate < today) {
        showError("วันรับรถต้องไม่เป็นวันที่ผ่านมาแล้ว");
        return;
      }

      if (
        endDate < startDate ||
        (endDate === startDate && endTime <= startTime)
      ) {
        showError("วันและเวลาคืนรถต้องอยู่หลังวันและเวลารับรถ");
        return;
      }

      if (!car.available) {
        showError("รถยังไม่เปิดเช่า");
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData(event.currentTarget);

        formData.set("carId", String(car.id));
        formData.set("startDate", startDate);
        formData.set("startTime", startTime);
        formData.set("endDate", endDate);
        formData.set("endTime", endTime);

        const result = await createBookingAction(formData);

        if (!result.success) {
          showError(result.message);
          return;
        }

        setSubmitted(true);
      } catch (error) {
        console.error("Booking error:", error);

        showError(
          error instanceof Error &&
            error.message.includes("กรุณาเข้าสู่ระบบ")
            ? error.message
            : "ไม่สามารถทำรายการเช่าได้ กรุณาลองใหม่อีกครั้ง"
        );
      } finally {
        setLoading(false);
      }
    }

    if (submitted) {
      return (
        <div className="booking-modal-overlay" onClick={onClose}>
          <div
            className="booking-modal booking-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="booking-success-icon">✓</div>

            <p className="booking-eyebrow">BOOKING REQUEST</p>

            <h2 id="booking-success-title">
              ส่งคำขอเช่ารถเรียบร้อย
            </h2>

            <p className="booking-success-description">
              ระบบได้รับคำขอเช่ารถ {car.name} แล้ว
            </p>

            <div className="booking-summary">
              <p className="booking-summary-car">
                <strong>รถที่จอง</strong>
                <span>{car.name}</span>
              </p>

              <p className="booking-summary-pickup">
                <strong>วันที่และเวลามารับรถ</strong>
                <span>
                  <span>{formatThaiDate(startDate)}</span>
                  <span>เวลา {startTime} น.</span>
                </span>
              </p>

              <p className="booking-summary-return">
                <strong>วันที่และเวลาคืนรถ</strong>
                <span>
                  <span>{formatThaiDate(endDate)}</span>
                  <span>เวลา {endTime} น.</span>
                </span>
              </p>

              <p className="booking-summary-days">
                <strong>จำนวนวัน</strong>
                <span>{days} วัน</span>
              </p>

              <p className="booking-summary-total">
                <strong>ราคารวม</strong>
                <span>{total.toLocaleString("th-TH")} บาท</span>
              </p>
            </div>

            <button
              type="button"
              className="booking-confirm-button"
              onClick={onClose}
            >
              ตกลง
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="booking-modal-overlay"
        onClick={onClose}
      >
        {showErrorPopup && (
          <div
            className="booking-popup-overlay"
            onClick={() => setShowErrorPopup(false)}
          >
            <div
              className="booking-popup"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="booking-popup-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="booking-popup-icon booking-popup-icon-error"
                aria-hidden="true"
              >
                ×
              </div>

              <p className="booking-eyebrow">NOTICE</p>

              <h2 id="booking-popup-title">
                {errorMessage === "รถยังไม่เปิดเช่า"
                  ? "รถยังไม่พร้อมให้เช่า"
                  : "ทำรายการไม่สำเร็จ"}
              </h2>

              <p className="booking-popup-message">{errorMessage}</p>

              <button
                type="button"
                className="booking-popup-button"
                onClick={() => setShowErrorPopup(false)}
              >
                ตกลง
              </button>
            </div>
          </div>
        )}

        <div
          className="booking-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="booking-close-button"
            aria-label="ปิดหน้าต่าง"
            onClick={onClose}
          >
            ×
          </button>

          <p className="booking-eyebrow">LANLODE • CAR RENTAL</p>
          <h2 id="booking-title">จองรถเช่า</h2>
          <p className="booking-subtitle">
            เลือกวันและเวลาที่ต้องการ แล้วตรวจสอบราคาได้ทันที
          </p>

          <div className="booking-car-info">
            <div className="booking-car-info-top">
              <span className="booking-car-label">YOUR SELECTED CAR</span>
              <span
                className={`booking-status ${
                  car.available ? "available" : "unavailable"
                }`}
              >
                {car.available ? "พร้อมให้เช่า" : "ยังไม่เปิดเช่า"}
              </span>
            </div>

            <h3>{car.name}</h3>

            <p>ทะเบียนรถ: {car.licensePlate}</p>

            <div className="booking-car-price">
              <strong>{car.pricePerDay.toLocaleString("th-TH")} บาท</strong>
              <span>/ วัน</span>
            </div>
          </div>

          {!car.available && (
            <div className="booking-unavailable-message">
              รถคันนี้ยังไม่เปิดให้จอง กรุณาเลือกรถคันอื่น
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="carId"
              value={car.id}
            />

            <div className="booking-section-heading">
              <span className="booking-section-number">01</span>
              <div>
                <h3>กำหนดการเช่า</h3>
                <p>เลือกวันรับรถและวันคืนรถ</p>
              </div>
            </div>

            <div className="booking-date-grid">
              <CalendarPicker
                id="startDate"
                label="วันรับรถ"
                value={startDate}
                minDate={today}
                onChange={handleStartDateChange}
              />

              <CalendarPicker
                id="endDate"
                label="วันคืนรถ"
                value={endDate}
                minDate={startDate || today}
                onChange={handleEndDateChange}
              />
            </div>

            <div className="booking-time-grid">
              <div className="booking-form-group">
                <label htmlFor="startTime">เวลารับรถ</label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    handleStartTimeChange(event.target.value)
                  }
                  required
                />
              </div>

              <div className="booking-form-group">
                <label htmlFor="endTime">เวลาคืนรถ</label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="booking-total">
              <div className="booking-total-row">
                <span>ราคาต่อวัน</span>
                <strong>
                  {car.pricePerDay.toLocaleString("th-TH")} บาท
                </strong>
              </div>

              <div className="booking-total-row">
                <span>จำนวนวันเช่า</span>
                <strong>{days} วัน</strong>
              </div>

              <div className="booking-total-divider" />

              <div className="booking-total-row booking-total-final">
                <span>ราคารวมโดยประมาณ</span>
                <strong>
                  {total.toLocaleString("th-TH")} บาท
                </strong>
              </div>

            </div>

            <button
              type="submit"
              className="booking-confirm-button"
              disabled={loading || !car.available}
            >
              {loading ? (
                <>
                  <span className="booking-spinner" />
                  กำลังส่งคำขอ...
                </>
              ) : (
                "ยืนยันการจอง"
              )}
            </button>

            <p className="booking-secure-note">
              กรุณาตรวจสอบวันและเวลาให้ถูกต้องก่อนยืนยัน
            </p>
          </form>
        </div>
      </div>
    );
  }
