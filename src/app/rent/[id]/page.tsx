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
    <main className="container rent-page">
      <Link href="/" className="back">
        ← กลับหน้ารายการรถ
      </Link>

      <div className="rent-card">
        <img src={car.image} alt={car.name} />

        <div className="rent-content">
          <section className="rent-car-summary" aria-label="รายละเอียดรถ">
            <div className="rent-car-badges">
              <span className="tag">{car.type}</span>
              <span className={`rent-availability ${car.available ? "is-available" : "is-unavailable"}`}>
                <span aria-hidden="true" />
                {car.available ? "พร้อมให้เช่า" : "ไม่พร้อมให้เช่า"}
              </span>
            </div>
            <h1>{car.name}</h1>
            <p className="rent-car-specs">
              {car.brand} <span>•</span> {car.seats} ที่นั่ง <span>•</span>{" "}
              {car.transmission} <span>•</span> {car.fuel}
            </p>

            <div className="rent-price">
              <span>ราคาเช่า</span>
              <strong>฿{car.pricePerDay.toLocaleString()}</strong>
              <small>/ วัน</small>
            </div>
          </section>

          <section className="rent-booking-panel" aria-labelledby="rent-booking-title">
            <div className="rent-booking-heading">
              <span>ขั้นตอนการจอง</span>
              <h2 id="rent-booking-title">เลือกวันรับและคืนรถ</h2>
              <p>เลือกวันเดินทางให้ครบ เพื่อคำนวณระยะเวลาเช่า</p>
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
          </section>
        </div>
      </div>
    </main>
  );
}
