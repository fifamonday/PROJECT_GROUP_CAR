import Link from "next/link";
import { updateBookingAction } from "@/features/bookings/actions";

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
      <div>
        <label>
          ลูกค้า
        </label>

        <input
          type="text"
          value={booking.userName}
          disabled
        />
      </div>

      <div>
        <label>
          อีเมล
        </label>

        <input
          type="text"
          value={
            booking.userEmail || "-"
          }
          disabled
        />
      </div>

      <div className="two-col">
        <div>
          <label>
            รถ
          </label>

          <input
            type="text"
            value={booking.carName}
            disabled
          />
        </div>

        <div>
          <label>
            ทะเบียนรถ
          </label>

          <input
            type="text"
            value={booking.licensePlate || "-"}
            disabled
          />
        </div>
      </div>

      <div className="two-col">
        <div>
          <label>
            วันที่รับรถ
          </label>

          <input
            type="date"
            value={booking.startDate}
            disabled
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
            defaultValue={booking.endDate}
            min={booking.startDate}
            required
          />
        </div>
      </div>

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
            ฿{booking.total.toLocaleString()}
          </strong>
        </p>

        <p className="muted">
          หากลูกค้าคืนรถก่อนกำหนด
          ให้เปลี่ยนวันที่คืนรถเป็นวันที่คืนจริง
        </p>
      </div>

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