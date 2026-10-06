"use client";

import { useState } from "react";
import { createBookingAction } from "../actions/bookings";
import type { Car } from "../lib/car-schema";

export default function BookingForm({ car }: { car: Car }) {
  const [error, setError] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    const form = event.currentTarget;

    const startDate = (
      form.elements.namedItem("startDate") as HTMLInputElement
    ).value;

    const endDate = (
      form.elements.namedItem("endDate") as HTMLInputElement
    ).value;

    if (!startDate || !endDate) {
      event.preventDefault();
      setError("กรุณาเลือกวันที่รับรถและวันที่คืนรถ");
      return;
    }

    if (endDate <= startDate) {
      event.preventDefault();
      setError("ต้องเลือกวันคืนรถหลังวันรับรถ");
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

      <label>
        วันที่รับรถ
        <input
          type="date"
          name="startDate"
          required
        />
      </label>

      <label>
        วันที่คืนรถ
        <input
          type="date"
          name="endDate"
          required
        />
      </label>

      {error && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px 16px",
            border: "1px solid #dc2626",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: "600",
          }}
        >
           {error}
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