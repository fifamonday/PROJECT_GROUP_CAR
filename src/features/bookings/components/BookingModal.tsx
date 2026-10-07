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
    useState("09:00");

  const [endDate, setEndDate] =
    useState("");

  const [endTime, setEndTime] =
    useState("18:00");

  const days = useMemo(() => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    const result = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return result > 0 ? result : 0;
  }, [startDate, endDate]);

  const total =
    days * car.pricePerDay;

  const today = new Date()
    .toISOString()
    .split("T")[0];

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

            <h2>
              ยืนยันการเช่ารถ
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="booking-car-info">
          <img
            src={car.image}
            alt={car.name}
          />

          <div>
            <h3>{car.name}</h3>

            <p>
              {car.brand} • {car.type}
            </p>

            <p>
              ทะเบียน:{" "}
              <strong>
                {car.licensePlate || "-"}
              </strong>
            </p>

            <strong className="booking-price">
              ฿
              {car.pricePerDay.toLocaleString()}
              <small> / วัน</small>
            </strong>
          </div>
        </div>

        <form
          action={createBookingAction}
          className="booking-modal-form"
        >
          <input
            type="hidden"
            name="carId"
            value={car.id}
          />

          <div className="two-col">
            <div>
              <label htmlFor="startDate">
                วันที่รับรถ
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                min={today}
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label htmlFor="startTime">
                เวลารับรถ
              </label>

              <input
                id="startTime"
                name="startTime"
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label htmlFor="endDate">
                วันที่คืนรถ
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
                required
              />
            </div>

            <div>
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
                required
              />
            </div>
          </div>

          <div className="booking-summary">
            <div>
              <span>
                จำนวนวัน
              </span>

              <strong>
                {days > 0
                  ? `${days} วัน`
                  : "-"}
              </strong>
            </div>

            <div>
              <span>
                ราคาต่อวัน
              </span>

              <strong>
                ฿
                {car.pricePerDay.toLocaleString()}
              </strong>
            </div>

            <div className="booking-total">
              <span>
                รวมทั้งหมด
              </span>

              <strong>
                ฿
                {total.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="booking-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                !startDate ||
                !startTime ||
                !endDate ||
                !endTime ||
                days < 1
              }
            >
              ยืนยันการเช่า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}