
"use client";

import type { FormEvent } from "react";
import { returnCarAction } from "@/features/bookings/actions";

type ReturnCarButtonProps = {
  bookingId: number;
};

export default function ReturnCarButton({
  bookingId,
}: ReturnCarButtonProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      "ยืนยันการคืนรถใช่หรือไม่? เมื่อยืนยันแล้ว ระบบจะบันทึกประวัติการคืนรถ"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={returnCarAction.bind(null, bookingId)}
      onSubmit={handleSubmit}
    >
      <button type="submit" className="confirm-button">
        คืนรถ
      </button>
    </form>
  );
}
