import { getCurrentUser } from "@/features/auth/service";

import { getBookings } from "@/features/bookings/service";

import { redirect } from "next/navigation";

import Link from "next/link";

import {
  updateBookingStatusAction,
} from "@/features/bookings/actions";

type AdminBookingsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/");
  }

  const params = await searchParams;

  const q = (
    params.q || ""
  )
    .trim()
    .toLowerCase();

  const allBookings =
    await getBookings();

  const bookings = q
    ? allBookings.filter((booking) => {
        return (
          booking.userName
            .toLowerCase()
            .includes(q) ||

          booking.userEmail
            ?.toLowerCase()
            .includes(q) ||

          booking.carName
            .toLowerCase()
            .includes(q) ||

          booking.licensePlate
            ?.toLowerCase()
            .includes(q)
        );
      })
    : allBookings;

  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>รายการจอง</h1>

          <p>
            รายการเช่ารถและประวัติลูกค้า
          </p>
        </div>
      </div>

      {/* SEARCH */}

      <form
        method="GET"
        className="search-form"
      >
        <input
          type="text"
          name="q"
          defaultValue={
            params.q || ""
          }
          placeholder="ค้นหาชื่อลูกค้า รถ หรือทะเบียน..."
        />

        <button
          type="submit"
          className="primary-button"
        >
          ค้นหา
        </button>

        {q && (
          <Link
            href="/admin/bookings"
            className="secondary-button"
          >
            ล้างการค้นหา
          </Link>
        )}
      </form>

      <br />

      <p className="muted">
        พบ {bookings.length} รายการ
      </p>

      {bookings.length === 0 ? (
        <div className="empty">
          ไม่พบประวัติการเช่า
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>ลำดับ</th>

                <th>ผู้เช่า</th>

                <th>รถ</th>

                <th>ทะเบียนรถ</th>

                <th>วันที่รับ</th>

                <th>วันที่คืน</th>

                <th>จำนวนวัน</th>

                <th>รวม</th>

                <th>สถานะ</th>

                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map(
                (booking, index) => (
                  <tr
                    key={booking.id}
                  >
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <div className="booking-user">
                        <strong>
                          {booking.userName}
                        </strong>

                        {booking.userEmail && (
                          <small>
                            {booking.userEmail}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      {booking.carName}
                    </td>

                    <td>
                      <strong>
                        {booking.licensePlate ||
                          "-"}
                      </strong>
                    </td>

                    <td>
                      {booking.startDate}
                    </td>

                    <td>
                      {booking.endDate}
                    </td>

                    <td>
                      {booking.days} วัน
                    </td>

                    <td>
                      ฿
                      {booking.total.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          booking.status ===
                          "ยืนยันแล้ว"
                            ? "status-success"
                            : booking.status ===
                              "ยกเลิก"
                            ? "status-danger"
                            : "status-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">

                        {/* แก้ไข */}
                        <Link
                          href={`/admin/bookings/edit/${booking.id}`}
                          className="secondary-button"
                        >
                          แก้ไข
                        </Link>

                        {/* ยืนยัน / ยกเลิก */}
                        {booking.status ===
                          "รอยืนยัน" && (
                          <>
                            <form
                              action={updateBookingStatusAction.bind(
                                null,
                                booking.id,
                                "ยืนยันแล้ว"
                              )}
                            >
                              <button
                                type="submit"
                                className="primary-button"
                              >
                                ยืนยัน
                              </button>
                            </form>

                            <form
                              action={updateBookingStatusAction.bind(
                                null,
                                booking.id,
                                "ยกเลิก"
                              )}
                            >
                              <button
                                type="submit"
                                className="danger-button"
                              >
                                ยกเลิก
                              </button>
                            </form>
                          </>
                        )}

                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}