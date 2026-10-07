import { getCurrentUser } from "@/features/auth/service";
import { getBookings } from "@/features/bookings/service";
import { redirect } from "next/navigation";
import { updateBookingStatusAction } from "@/features/bookings/actions";

export default async function AdminBookingsPage() {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/");
  }

  const bookings = await getBookings();

  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>รายการจอง</h1>
          <p>รายการเช่ารถทั้งหมดในระบบ</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty">
          ยังไม่มีรายการจอง
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>ผู้เช่า</th>
                <th>รถ</th>
                <th>วันที่รับ</th>
                <th>วันที่คืน</th>
                <th>จำนวนวัน</th>
                <th>รวม</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="booking-user">
                      <strong>{booking.userName}</strong>

                      {booking.userEmail && (
                        <small>{booking.userEmail}</small>
                      )}
                    </div>
                  </td>

                  <td>
                    {booking.carName}
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
                    ฿{booking.total.toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        booking.status === "ยืนยันแล้ว"
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
                    {booking.status === "รอยืนยัน" ? (
                      <div className="admin-actions">
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
                      </div>
                    ) : (
                      <span className="muted">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}