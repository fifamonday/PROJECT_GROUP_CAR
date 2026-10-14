
import { getCurrentUser } from "@/features/auth/service";
import {
  getCars,
  searchCars,
  CAR_TYPES,
} from "@/features/cars/service";
import { openCarForBookingAction } from "@/features/cars/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import CarForm from "@/features/cars/components/CarForm";
import AdminCarSearchForm from "@/features/cars/components/AdminCarSearchForm";

type AdminCarsProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
};

export default async function AdminCars({
  searchParams,
}: AdminCarsProps) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/login?error=เฉพาะผู้ดูแลระบบ");
  }

  const params = await searchParams;
  const q = params.q ?? "";

  const selectedType = CAR_TYPES.includes(
    params.type as (typeof CAR_TYPES)[number]
  )
    ? (params.type as (typeof CAR_TYPES)[number])
    : "ทั้งหมด";

  const cars =
    q.trim() !== "" || selectedType !== "ทั้งหมด"
      ? await searchCars({
          q,
          type: selectedType,
          maxPrice: undefined,
        })
      : await getCars();

  return (
    <main className="container admin-cars-page">
      <div className="section-title admin-cars-page-header">
        <div>
          <h1>จัดการรถ</h1>
          <p>เพิ่ม แก้ไข ลบรถ และจัดการการเปิดรับจอง</p>
        </div>
      </div>

      <div className="admin-layout">
        <section className="panel">
          <h2>เพิ่มรถใหม่</h2>
          <CarForm />
        </section>

        <section className="admin-cars-section">
          <div className="admin-cars-heading">
            <div>
              <span className="admin-cars-eyebrow">FLEET MANAGEMENT</span>
              <h2>รถในระบบ</h2>
              <p>ค้นหาและจัดการรถที่เปิดให้บริการ</p>
            </div>
            <span className="admin-cars-count">{cars.length} คัน</span>
          </div>

          <div className="admin-car-toolbar">
            <AdminCarSearchForm />
          </div>

          {cars.length === 0 ? (
            <div className="empty">ไม่พบรถที่ค้นหา</div>
          ) : (
            <div className="admin-list">
              {cars.map((car) => (
                <div className="admin-car" key={car.id}>
                  <img src={car.image} alt={car.name} />

                  <div>
                    <h3>{car.name}</h3>
                    <p>
                      {car.type} • ฿
                      {car.pricePerDay.toLocaleString("th-TH")}/วัน
                    </p>
                    <p className="muted">
                      ทะเบียน {car.licensePlate}
                    </p>
                    <p>
                      <span
                        className={`status ${
                          car.available
                            ? "status-success"
                            : "status-warning"
                        }`}
                      >
                        {car.available ? "เปิดรับจอง" : "ปิดรับจอง"}
                      </span>
                    </p>
                  </div>

                  <div className="admin-actions">
                    <Link
                      href={`/admin/cars/edit/${car.id}`}
                      className="secondary-button"
                    >
                      แก้ไข
                    </Link>

                    {!car.available && (
                      <form
                        action={openCarForBookingAction.bind(
                          null,
                          car.id
                        )}
                      >
                        <button
                          type="submit"
                          className="confirm-button"
                        >
                          เปิดจองใหม่
                        </button>
                      </form>
                    )}

                    <Link
                      href={`/admin/cars/delete/${car.id}`}
                      className="danger-button"
                    >
                      ลบ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
