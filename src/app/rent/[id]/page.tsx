import { getCars } from "@/features/cars/service";
import { getCurrentUser } from "@/features/auth/service";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "@/features/bookings/components/BookingForm";

type RentPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function RentPage({
  params,
  searchParams,
}: RentPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const car = (await getCars()).find(
    (item) => item.id === Number(id)
  );

  if (!car) {
    notFound();
  }

  const user = await getCurrentUser();

  return (
    <main className="container narrow">
      <Link href="/" className="back">
        ← กลับหน้ารายการรถ
      </Link>

      <div className="rent-card">
        <img src={car.image} alt={car.name} />

        <div className="rent-content">
          <span className="tag">{car.type}</span>
          <h1>{car.name}</h1>
          <p>
            {car.brand} • {car.seats} ที่นั่ง • {car.transmission} •{" "}
            {car.fuel}
          </p>

          <div className="rent-price">
            ฿{car.pricePerDay.toLocaleString()} <small>/ วัน</small>
          </div>

          {error && <div className="error-box">{error}</div>}

          {user ? (
            <BookingForm car={car} />
          ) : (
            <div className="login-note">
              กรุณา <Link href="/login">เข้าสู่ระบบ</Link>{" "}
              ก่อนจึงจะเช่ารถได้
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
