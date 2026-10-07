"use client";

import { useState } from "react";
import { createBookingAction } from "@/features/bookings/actions";
import type { Car } from "@/features/cars/schema";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatThaiDate(date: Date | null) {
  if (!date) return "เลือกวันที่";

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function BookingForm({ car }: { car: Car }) {
  const today = new Date();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [calendarType, setCalendarType] = useState<
    "start" | "end" | null
  >(null);

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [error, setError] = useState("");

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthName = calendarMonth.toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  function openCalendar(type: "start" | "end") {
    setCalendarType(type);
    setError("");

    const selectedDate =
      type === "start" ? startDate : endDate;

    if (selectedDate) {
      setCalendarMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }
  }

  function selectDate(day: number) {
    const selected = new Date(year, month, day);

    if (calendarType === "start") {
      setStartDate(selected);

      if (
        endDate &&
        selected >= endDate
      ) {
        setEndDate(null);
      }

      setCalendarType(null);
      return;
    }

    if (calendarType === "end") {
      if (startDate && selected <= startDate) {
        setError("ต้องเลือกวันคืนรถหลังวันรับรถ");
        return;
      }

      setEndDate(selected);
      setCalendarType(null);
    }
  }

  function previousMonth() {
    setCalendarMonth(
      new Date(year, month - 1, 1)
    );
  }

  function nextMonth() {
    setCalendarMonth(
      new Date(year, month + 1, 1)
    );
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    if (!startDate || !endDate) {
      event.preventDefault();

      setError(
        "กรุณาเลือกวันที่รับรถและวันที่คืนรถ"
      );

      return;
    }

    if (endDate <= startDate) {
      event.preventDefault();

      setError(
        "ต้องเลือกวันคืนรถหลังวันรับรถ"
      );

      return;
    }

    setError("");
  }

  return (
    <form
      action={createBookingAction}
      onSubmit={handleSubmit}
      className="booking-form"
    >
      <input
        type="hidden"
        name="carId"
        value={car.id}
      />

      <input
        type="hidden"
        name="startDate"
        value={
          startDate
            ? formatDate(startDate)
            : ""
        }
      />

      <input
        type="hidden"
        name="endDate"
        value={
          endDate
            ? formatDate(endDate)
            : ""
        }
      />

      <div className="booking-dates">
        <div className="date-picker-box">
          <label>วันที่รับรถ</label>

          <button
            type="button"
            className={`date-picker-button ${
              calendarType === "start"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openCalendar("start")
            }
          >
            <span>
              {formatThaiDate(startDate)}
            </span>

            <span className="calendar-icon">
              📅
            </span>
          </button>
        </div>

        <div className="date-picker-box">
          <label>วันที่คืนรถ</label>

          <button
            type="button"
            className={`date-picker-button ${
              calendarType === "end"
                ? "active"
                : ""
            }`}
            onClick={() =>
              openCalendar("end")
            }
          >
            <span>
              {formatThaiDate(endDate)}
            </span>

            <span className="calendar-icon">
              📅
            </span>
          </button>
        </div>
      </div>

      {calendarType && (
        <div className="calendar-box">
          <div className="calendar-header">
            <button
              type="button"
              onClick={previousMonth}
              className="calendar-nav"
            >
              ‹
            </button>

            <strong>
              {monthName}
            </strong>

            <button
              type="button"
              onClick={nextMonth}
              className="calendar-nav"
            >
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            <span>อา</span>
            <span>จ</span>
            <span>อ</span>
            <span>พ</span>
            <span>พฤ</span>
            <span>ศ</span>
            <span>ส</span>
          </div>

          <div className="calendar-days">
            {Array.from({
              length: firstDay,
            }).map((_, index) => (
              <span
                key={`empty-${index}`}
                className="calendar-empty"
              />
            ))}

            {Array.from({
              length: daysInMonth,
            }).map((_, index) => {
              const day = index + 1;

              const date = new Date(
                year,
                month,
                day
              );

              const isStart =
                startDate &&
                formatDate(date) ===
                  formatDate(startDate);

              const isEnd =
                endDate &&
                formatDate(date) ===
                  formatDate(endDate);

              const isBeforeStart =
                calendarType === "end" &&
                startDate &&
                date <= startDate;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!!isBeforeStart}
                  className={`calendar-day ${
                    isStart
                      ? "selected-start"
                      : ""
                  } ${
                    isEnd
                      ? "selected-end"
                      : ""
                  } ${
                    isBeforeStart
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() =>
                    selectDate(day)
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="booking-error">
          <span className="booking-error-icon">
            !
          </span>

          <div>
            <strong>
              ไม่สามารถจองรถได้
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="primary-button"
      >
        ยืนยันการเช่ารถ
      </button>
    </form>
  );
}