import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/features/auth/service";
import { getCar } from "@/features/cars/service";
import Edit from "@/features/cars/components/Edit";

type EditCarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCarPage({
  params,
}: EditCarPageProps) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect(
      "/login?error=เฉพาะผู้ดูแลระบบ"
    );
  }

  const { id } = await params;

  const car = await getCar(Number(id));

  if (!car) {
    notFound();
  }

  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>แก้ไขรถ</h1>

          <p>
            แก้ไขข้อมูลรถ {car.name}
          </p>
        </div>

        <Link
          href="/admin/cars"
          className="secondary-button"
        >
          กลับ
        </Link>
      </div>

      <section className="panel">
        <Edit car={car} />
      </section>
    </main>
  );
}