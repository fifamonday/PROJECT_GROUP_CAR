"use client";

import { useMemo, useState } from "react";

import { createBookingAction } from "@/features/bookings/actions";

import type { Car } from "@/features/cars/schema";

type BookingModalProps = {
  car: Car;
  onClose: () => void;
};

export default function BookingModal({
  car,
  onClose,
}: BookingModalProps) {
  const [startDate, setStartDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const days = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() -
      start.getTime();

    const result = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return result > 0 ? result : 0;
  }, [startDate, endDate]);

  const total =
    days * car.pricePerDay;

  function handleStartDateChange(
    value: string
  ) {
    setStartDate(value);

    // เมื่อเปลี่ยนวันรับรถ
    // ให้ล้างวันคืนรถเดิม
    setEndDate("");

    // และล้างเวลาคืนรถ
    setEndTime("");
  }

  function handleStartTimeChange(
    value: string
  ) {
    setStartTime(value);

    // เมื่อเปลี่ยนเวลารับรถ
    // ให้เลือกเวลาคืนรถใหม่อีกครั้ง
    setEndTime("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!startDate) {
      alert("กรุณาเลือกวันรับรถก่อน");
      return;
    }

    if (!startTime) {
      alert("กรุณาเลือกเวลารับรถก่อน");
      return;
    }

    if (!endDate) {
      alert("กรุณาเลือกวันคืนรถ");
      return;
    }

    if (!endTime) {
      alert("กรุณาเลือกเวลาคืนรถ");
      return;
    }

    if (endDate < startDate) {
      alert(
        "วันคืนรถต้องไม่ก่อนวันรับรถ"
      );
      return;
    }

    setLoading(true);

    try {
      const formData =
        new FormData(event.currentTarget);

      await createBookingAction(formData);

      setSubmitted(true);
    } catch (error) {
      console.error(error);

      alert(
        "ไม่สามารถทำรายการเช่าได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="booking-modal-overlay">
        <div className="booking-success-modal">
          <div className="success-icon">
            ✓
          </div>

          <span className="success-eyebrow">
            BOOKING SUBMITTED
          </span>

          <h2>
            ส่งคำขอเช่าเรียบร้อย
          </h2>

          <p>
            ระบบได้รับคำขอเช่ารถของคุณแล้ว
          </p>

          <div className="success-status">
            <span className="success-status-dot" />

            <div>
              <strong>
                รอยืนยันจากทางระบบ
              </strong>

              <small>
                กรุณารอเจ้าหน้าที่ตรวจสอบ
                และยืนยันการเช่า
              </small>
            </div>
          </div>

          <div className="success-booking-info">
            <div>
              <span>รถ</span>
              <strong>{car.name}</strong>
            </div>

            <div>
              <span>ทะเบียน</span>
              <strong>
                {car.licensePlate || "-"}
              </strong>
            </div>

            <div>
              <span>วันที่เช่า</span>
              <strong>{startDate}</strong>
            </div>

            <div>
              <span>วันที่คืน</span>
              <strong>{endDate}</strong>
            </div>

            <div>
              <span>เวลารับรถ</span>
              <strong>{startTime}</strong>
            </div>

            <div>
              <span>เวลาคืนรถ</span>
              <strong>{endTime}</strong>
            </div>

            <div>
              <span>จำนวนวัน</span>
              <strong>
                {days} วัน
              </strong>
            </div>

            <div>
              <span>ยอดรวม</span>
              <strong className="success-total">
                ฿{total.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="success-actions">
            <button
              type="button"
              className="primary-button"
              onClick={onClose}
            >
              กลับหน้ารายการรถ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="booking-modal-overlay"
      onClick={onClose}
    >
      <div
        className="booking-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="booking-modal-header">
          <div>
            <span className="eyebrow">
              CAR RENTAL
            </span>

            <h2>จองรถ</h2>

            <p>
              กรุณาเลือกข้อมูลตามลำดับ
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <div className="booking-car-info">
          <img
            src={car.image}
            alt={car.name}
          />

          <div className="booking-car-detail">
            <span className="booking-car-type">
              {car.type}
            </span>

            <h3>{car.name}</h3>

            <p>
              {car.brand} • {car.seats} ที่นั่ง •{" "}
              {car.transmission}
            </p>

            <p>
              ทะเบียน:{" "}
              <strong>
                {car.licensePlate || "-"}
              </strong>
            </p>

            <strong className="booking-price">
              ฿{car.pricePerDay.toLocaleString()}
              <small> / วัน</small>
            </strong>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="booking-modal-form"
        >
          <input
            type="hidden"
            name="carId"
            value={car.id}
          />

          {/* =========================
              01 DATE
          ========================= */}

          <div className="booking-section">
            <div className="booking-section-title">
              <span className="booking-section-number">
                01
              </span>

              <div>
                <h3>วันที่เช่ารถ</h3>

                <p>
                  ต้องเลือกวันรับรถก่อน
                </p>
              </div>
            </div>

            <div className="booking-fields">
              <div className="booking-field">
                <label htmlFor="startDate">
                  วันรับรถ
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) =>
                    handleStartDateChange(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="booking-field">
                <label htmlFor="endDate">
                  วันคืนรถ
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                  disabled={!startDate}
                  required
                />

                {!startDate && (
                  <small className="field-hint">
                    กรุณาเลือกวันรับรถก่อน
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              02 TIME
          ========================= */}

          <div className="booking-section">
            <div className="booking-section-title">
              <span className="booking-section-number">
                02
              </span>

              <div>
                <h3>เวลา</h3>

                <p>
                  ต้องเลือกเวลารับรถก่อน
                </p>
              </div>
            </div>

            <div className="booking-fields">
              <div className="booking-field">
                <label htmlFor="startTime">
                  เวลารับรถ
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    handleStartTimeChange(
                      e.target.value
                    )
                  }
                  disabled={!startDate}
                  required
                />

                {!startDate && (
                  <small className="field-hint">
                    กรุณาเลือกวันรับรถก่อน
                  </small>
                )}
              </div>

              <div className="booking-field">
                <label htmlFor="endTime">
                  เวลาคืนรถ
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(
                      e.target.value
                    )
                  }
                  disabled={
                    !startDate ||
                    !startTime
                  }
                  required
                />

                {!startTime && (
                  <small className="field-hint">
                    กรุณาเลือกเวลารับรถก่อน
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <div className="booking-summary">
            <div className="booking-summary-row">
              <span>จำนวนวัน</span>

              <strong>
                {days > 0
                  ? `${days} วัน`
                  : "-"}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>ราคา / วัน</span>

              <strong>
                ฿
                {car.pricePerDay.toLocaleString()}
              </strong>
            </div>

            <div className="booking-total">
              <span>ยอดรวม</span>

              <strong>
                ฿{total.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="booking-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                loading ||
                !startDate ||
                !startTime ||
                !endDate ||
                !endTime ||
                days < 1
              }
            >
              {loading
                ? "กำลังส่งคำขอ..."
                : "ยืนยันการเช่า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}