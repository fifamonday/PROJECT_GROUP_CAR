
import { getCurrentUser } from "@/features/auth/service";
import { getUserBookings } from "@/features/bookings/service";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookings = await getUserBookings(user.email);
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "รอยืนยัน"
  ).length;

  function formatBookingDate(value: string) {
    return new Date(`${value}T12:00:00`).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="account-page">
      <div className="account-card">
        <header className="account-heading">
          <div>
            <span className="account-eyebrow">บัญชีของฉัน</span>
            <h1>รายการเช่าของฉัน</h1>
            <p>ประวัติการจองและสถานะการเช่ารถของคุณ</p>
          </div>
          <div className="account-user">
            <span className="account-avatar" aria-hidden="true">
              {user.name.trim().charAt(0).toLocaleUpperCase()}
            </span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </div>
        </header>

        <div className="account-booking-stats" aria-label="สรุปรายการจอง">
          <div>
            <span>การจองทั้งหมด</span>
            <strong>{bookings.length} <small>รายการ</small></strong>
          </div>
          <div>
            <span>รอการยืนยัน</span>
            <strong>{pendingBookings} <small>รายการ</small></strong>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="account-empty">
            <span aria-hidden="true">✦</span>
            <strong>ยังไม่มีประวัติการเช่ารถ</strong>
            <p>เมื่อคุณจองรถ รายการจองจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="account-booking-table">
              <thead>
                <tr>
                  <th>รถ</th>
                  <th>วันที่รับ</th>
                  <th>วันที่คืน</th>
                  <th>จำนวนวัน</th>
                  <th>รวม</th>
                  <th>สถานะ</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="account-car-name">{booking.carName}</td>

                    <td>{formatBookingDate(booking.startDate)}</td>

                    <td>{formatBookingDate(booking.endDate)}</td>

                    <td>{booking.days} วัน</td>

                    <td className="account-booking-total">
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
