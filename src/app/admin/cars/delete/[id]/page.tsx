import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/features/auth/service";
import { getCar } from "@/features/cars/service";
import Delete from "@/features/cars/components/Delete";

type DeleteCarPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeleteCarPage({
  params,
}: DeleteCarPageProps) {
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
          <h1>ลบรถ</h1>

          <p>
            จัดการการลบรถออกจากระบบ
          </p>
        </div>

        <Link
          href="/admin/cars"
          className="secondary-button"
        >
          กลับ
        </Link>
      </div>

      <Delete
        carId={car.id}
        carName={car.name}
      />
    </main>
  );
}