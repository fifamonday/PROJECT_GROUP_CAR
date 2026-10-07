import { redirect, notFound } from "next/navigation";

import Link from "next/link";

import { getCurrentUser } from "@/features/auth/service";

import { getBooking } from "@/features/bookings/service";

import BookingEdit from "@/features/bookings/components/BookingEdit";

type BookingEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingEditPage({
  params,
}: BookingEditPageProps) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect(
      "/login?error=เฉพาะผู้ดูแลระบบ"
    );
  }

  const { id } = await params;

  const booking = await getBooking(
    Number(id)
  );

  if (!booking) {
    notFound();
  }

  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>
            แก้ไขรายการเช่า
          </h1>

          <p>
            แก้ไขข้อมูลการคืนรถ
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="secondary-button"
        >
          กลับ
        </Link>
      </div>

      <section className="panel">
        <BookingEdit
          booking={booking}
        />
      </section>
    </main>
  );
}