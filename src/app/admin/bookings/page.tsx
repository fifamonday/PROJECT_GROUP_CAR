import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/service";
import { getBookings } from "@/features/bookings/service";
import { updateBookingStatusAction } from "@/features/bookings/actions";

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
  // =========================
  // ตรวจสอบ Admin
  // =========================

  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  // =========================
  // ดึงข้อมูลการจอง
  // =========================

  const bookings = await getBookings();

  // =========================
  // รับคำค้นหา
  // =========================

  const params = await searchParams;
  const keyword = (params.q ?? "").trim().toLowerCase();

  // =========================
  // กรองข้อมูล
  // ค้นหาจาก:
  // ชื่อลูกค้า
  // อีเมล
  // ชื่อรถ
  // ทะเบียนรถ
  // =========================

  const filteredBookings = bookings.filter((booking) => {
    if (!keyword) {
      return true;
    }

    return (
      booking.userName
        .toLowerCase()
        .includes(keyword) ||

      (booking.userEmail ?? "")
        .toLowerCase()
        .includes(keyword) ||

      booking.carName
        .toLowerCase()
        .includes(keyword) ||

      booking.licensePlate
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <main className="admin-bookings-page">

      <div className="admin-bookings-card">

        {/* =========================
            Header
        ========================= */}

        <div className="admin-bookings-header">

          <div>
            <h1>
              รายการจองรถ
            </h1>

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

        </div>


        {/* =========================
            ช่องค้นหา
        ========================= */}

        <form
          method="GET"
          className="booking-search-form"
        >

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


        {/* =========================
            จำนวนรายการ
        ========================= */}

        <p className="muted booking-count">
          พบ {filteredBookings.length} รายการ
        </p>


        {/* =========================
            ไม่มีข้อมูล
        ========================= */}

        {filteredBookings.length === 0 ? (

          <div className="empty">
            {keyword
              ? "ไม่พบข้อมูลที่ค้นหา"
              : "ยังไม่มีรายการจองรถ"}
          </div>

        ) : (

          <div className="table-wrap">

            <table>

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

                    {/* ลูกค้า */}

                    <td>
                      {booking.userName}
                    </td>


                    {/* อีเมล */}

                    <td>
                      {booking.userEmail || "-"}
                    </td>


                    {/* รถ */}

                    <td>
                      {booking.carName}
                    </td>


                    {/* ทะเบียน */}

                    <td>
                      {booking.licensePlate}
                    </td>


                    {/* วันที่รับ */}

                    <td>
                      {booking.startDate}
                    </td>


                    {/* วันที่คืน */}

                    <td>
                      {booking.endDate}
                    </td>


                    {/* จำนวนวัน */}

                    <td>
                      {booking.days} วัน
                    </td>


                    {/* ราคา */}

                    <td>
                      ฿{booking.total.toLocaleString()}
                    </td>


                    {/* สถานะ */}

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


                    {/* =========================
                        ปุ่มจัดการ
                    ========================= */}

                    <td>

                      <div className="booking-actions">

                        {/* =========================
                            รอยืนยัน
                        ========================= */}

                        {booking.status === "รอยืนยัน" && (
                          <>

                            {/* ยืนยัน */}

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


                            {/* ยกเลิก */}

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


                        {/* =========================
                            ยืนยันแล้ว
                        ========================= */}

                        {booking.status === "ยืนยันแล้ว" && (

                          <span className="muted">
                            ยืนยันแล้ว
                          </span>

                        )}


                        {/* =========================
                            ยกเลิกแล้ว
                        ========================= */}

                        {booking.status === "ยกเลิก" && (

                          <span className="muted">
                            ยกเลิกแล้ว
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