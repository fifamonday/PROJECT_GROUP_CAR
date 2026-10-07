import { getCurrentUser } from "@/features/auth/service";
import {
  getCars,
  searchCars,
  CAR_TYPES,
} from "@/features/cars/service";
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
    redirect(
      "/login?error=เฉพาะผู้ดูแลระบบ"
    );
  }

  const params = await searchParams;

  const q = params.q ?? "";

  const selectedType = CAR_TYPES.includes(
    params.type as (typeof CAR_TYPES)[number]
  )
    ? (params.type as (typeof CAR_TYPES)[number])
    : "ทั้งหมด";

  const cars =
    q || selectedType !== "ทั้งหมด"
      ? await searchCars({
          q,
          type: selectedType,
          maxPrice: undefined,
        })
      : await getCars();

  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>จัดการรถ</h1>

          <p>
            เพิ่ม แก้ไข และลบรถที่ให้บริการ
          </p>
        </div>
      </div>

      <div className="admin-layout">
        <section className="panel">
          <h2>เพิ่มรถใหม่</h2>

          <CarForm />
        </section>

        <section>
          <h2>
            รถในระบบ ({cars.length})
          </h2>

          <AdminCarSearchForm />

          {cars.length === 0 ? (
            <div className="empty">
              ไม่พบรถที่ค้นหา
            </div>
          ) : (
            <div className="admin-list">
              {cars.map((car) => (
                <div
                  className="admin-car"
                  key={car.id}
                >
                  <img
                    src={car.image}
                    alt={car.name}
                  />

                  <div>
                    <h3>{car.name}</h3>

                    <p>
                      {car.type} • ฿
                      {car.pricePerDay.toLocaleString()}
                      /วัน
                    </p>
                  </div>

                  <div className="admin-actions">
                    <Link
                      href={`/admin/cars/edit/${car.id}`}
                      className="secondary-button"
                    >
                      แก้ไข
                    </Link>

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