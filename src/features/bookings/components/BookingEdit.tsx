import Link from "next/link";

import {
  updateBookingAction,
} from "@/features/bookings/actions";

type BookingEditProps = {
  booking: {
    id: number;

    userName: string;

    userEmail?: string;

    carName: string;

    licensePlate: string;

    startDate: string;

    endDate: string;

    days: number;

    total: number;

    status:
      | "รอยืนยัน"
      | "ยืนยันแล้ว"
      | "ยกเลิก";
  };
};

export default function BookingEdit({
  booking,
}: BookingEditProps) {
  return (
    <form
      action={updateBookingAction.bind(
        null,
        booking.id
      )}
      className="admin-form"
    >

      {/* ลูกค้า */}

      <div>
        <label htmlFor="userName">
          ลูกค้า
        </label>

        <input
          id="userName"
          type="text"
          value={booking.userName}
          readOnly
        />
      </div>


      {/* อีเมล */}

      <div>
        <label htmlFor="userEmail">
          อีเมล
        </label>

        <input
          id="userEmail"
          type="text"
          value={
            booking.userEmail || "-"
          }
          readOnly
        />
      </div>


      {/* รถ */}

      <div className="two-col">

        <div>
          <label htmlFor="carName">
            รถ
          </label>

          <input
            id="carName"
            type="text"
            value={booking.carName}
            readOnly
          />
        </div>


        <div>
          <label htmlFor="licensePlate">
            ทะเบียนรถ
          </label>

          <input
            id="licensePlate"
            type="text"
            value={
              booking.licensePlate || "-"
            }
            readOnly
          />
        </div>

      </div>


      {/* วันที่ */}

      <div className="two-col">

        <div>
          <label htmlFor="startDate">
            วันที่รับรถ
          </label>

          <input
            id="startDate"
            type="date"
            value={booking.startDate}
            readOnly
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
            defaultValue={
              booking.endDate
            }
            min={booking.startDate}
            required
          />
        </div>

      </div>


      {/* ข้อมูลการเช่า */}

      <div className="panel">

        <p>
          จำนวนวันเดิม:{" "}
          <strong>
            {booking.days} วัน
          </strong>
        </p>

        <p>
          ยอดเงินเดิม:{" "}
          <strong>
            ฿
            {booking.total.toLocaleString()}
          </strong>
        </p>

        <p>
          สถานะ:{" "}
          <strong>
            {booking.status}
          </strong>
        </p>

        <p className="muted">
          หากลูกค้าคืนรถก่อนกำหนด
          ให้เปลี่ยนวันที่คืนรถ
          เป็นวันที่คืนจริง
        </p>

      </div>


      {/* BUTTONS */}

      <div className="admin-actions">

        <button
          type="submit"
          className="primary-button"
        >
          บันทึกการแก้ไข
        </button>

        <Link
          href="/admin/bookings"
          className="secondary-button"
        >
          ยกเลิก
        </Link>

      </div>

    </form>
  );
}