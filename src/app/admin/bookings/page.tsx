
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/service";
import { getBookings } from "@/features/bookings/service";
import { updateBookingStatusAction } from "@/features/bookings/actions";
import ReturnCarButton from "@/features/bookings/components/ReturnCarButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminBookingsPage({
  searchParams,
}: PageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const bookings = await getBookings();

  const params = await searchParams;
  const keyword = (params.q ?? "").trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    if (!keyword) {
      return true;
    }

    return (
      booking.userName.toLowerCase().includes(keyword) ||
      (booking.userEmail ?? "").toLowerCase().includes(keyword) ||
      booking.carName.toLowerCase().includes(keyword) ||
      booking.licensePlate.toLowerCase().includes(keyword)
    );
  });
  const pendingBookings = filteredBookings.filter(
    (booking) => booking.status === "รอยืนยัน"
  ).length;

  return (
    <main className="admin-bookings-page">
      <div className="admin-bookings-card">
        <header className="admin-bookings-header">
          <div>
            <span className="account-eyebrow">ADMIN • BOOKINGS</span>
            <h1>รายการจองรถ</h1>
            <p className="muted">
              จัดการรายการเช่ารถของลูกค้า
            </p>
          </div>

          <Link
            href="/admin/cars"
            className="admin-back-button"
          >
            จัดการรถ
          </Link>
        </header>

        <div className="account-booking-stats" aria-label="สรุปรายการจองรถ">
          <div>
            <span>รายการที่พบ</span>
            <strong>{filteredBookings.length} <small>รายการ</small></strong>
          </div>
          <div>
            <span>รอการยืนยัน</span>
            <strong>{pendingBookings} <small>รายการ</small></strong>
          </div>
        </div>

        <form method="GET" className="booking-search-form">
          <input
            type="text"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="ค้นหาชื่อลูกค้า อีเมล ชื่อรถ หรือทะเบียนรถ..."
            className="booking-search-input"
          />

          <button
            type="submit"
            className="booking-search-button"
          >
            ค้นหา
          </button>

          {keyword && (
            <Link
              href="/admin/bookings"
              className="booking-clear-button"
            >
              ล้าง
            </Link>
          )}
        </form>

        <p className="muted booking-count">ผลการค้นหารายการจอง</p>

        {filteredBookings.length === 0 ? (
          <div className="empty">
            {keyword
              ? "ไม่พบข้อมูลที่ค้นหา"
              : "ยังไม่มีรายการจองรถ"}
          </div>
        ) : (
          <div className="table-wrap admin-bookings-table-wrap">
            <table className="admin-bookings-table">
              <thead>
                <tr>
                  <th>ลูกค้า</th>
                  <th>อีเมล</th>
                  <th>รถ</th>
                  <th>ทะเบียน</th>
                  <th>วันที่รับ</th>
                  <th>วันที่คืน</th>
                  <th>จำนวนวัน</th>
                  <th>ราคา</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.userName}</td>
                    <td>{booking.userEmail || "-"}</td>
                    <td>{booking.carName}</td>
                    <td>{booking.licensePlate}</td>
                    <td>{booking.startDate}</td>
                    <td>{booking.endDate}</td>
                    <td>{booking.days} วัน</td>
                    <td>
                      ฿{booking.total.toLocaleString("th-TH")}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          booking.status === "ยืนยันแล้ว" ||
                          booking.status === "คืนรถแล้ว"
                            ? "status-success"
                            : booking.status === "ยกเลิก"
                              ? "status-danger"
                              : "status-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="booking-actions">
                        {booking.status === "รอยืนยัน" && (
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
                                className="confirm-button"
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
                                className="cancel-button"
                              >
                                ยกเลิก
                              </button>
                            </form>
                          </>
                        )}

                        {booking.status === "ยืนยันแล้ว" && (
                          <ReturnCarButton bookingId={booking.id} />
                        )}

                        {booking.status === "ยกเลิก" && (
                          <span className="muted">
                            ยกเลิกแล้ว
                          </span>
                        )}

                        {booking.status === "คืนรถแล้ว" && (
                          <span className="muted">
                            คืนรถแล้ว
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
