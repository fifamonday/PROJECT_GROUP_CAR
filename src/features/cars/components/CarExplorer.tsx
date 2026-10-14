"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import CarSearchForm from "./CarSearchForm";
import BookingModal from "@/features/bookings/components/BookingModal";

import type {
  Car,
  SearchCar,
} from "../schema";

type CarExplorerProps = {
  initialCars: Car[];
};

export default function CarExplorer({
  initialCars,
}: CarExplorerProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const [cars, setCars] = useState(initialCars);

  const [query, setQuery] = useState<SearchCar>({
    q: "",
    type: "ทั้งหมด",
    maxPrice: undefined,
  });

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);

  // อัปเดตข้อมูลรถเมื่อเซิร์ฟเวอร์ส่งข้อมูลชุดใหม่มา
  useEffect(() => {
    setCars(initialCars);
  }, [initialCars]);

  // รีเฟรชสถานะรถเมื่อผู้ใช้กลับมาเปิดหน้าเว็บอีกครั้ง
  useEffect(() => {
    const refreshCars = () => {
      startTransition(() => {
        router.refresh();
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshCars();
      }
    };

    window.addEventListener("focus", refreshCars);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshCars);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  const availableCars = cars.filter((car) => car.available);

  const availableTypes = new Set(
    availableCars.map((car) => car.type)
  ).size;

  const filtered = useMemo(() => {
    return cars
      .filter((car) => {
        const keyword = query.q.toLowerCase().trim();

        if (!keyword) return true;

        return (
          car.name.toLowerCase().includes(keyword) ||
          car.brand.toLowerCase().includes(keyword) ||
          car.licensePlate.toLowerCase().includes(keyword)
        );
      })
      .filter((car) => {
        return (
          query.type === "ทั้งหมด" ||
          car.type === query.type
        );
      })
      .filter((car) => {
        return (
          query.maxPrice === undefined ||
          car.pricePerDay <= query.maxPrice
        );
      });
  }, [cars, query]);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".reveal-on-scroll:not(.is-visible)"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filtered]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return (
    <>
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              CAR RENTAL, MADE SIMPLE
            </span>

            <h1>
              หารถที่ใช่
              <br />
              แล้วออกเดินทาง
            </h1>

            <p>
              เลือกรถตามสไตล์และงบประมาณของคุณ พร้อมส่งคำขอจองได้ในไม่กี่ขั้นตอน
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#available-cars">
                ดูรถทั้งหมด
                <span aria-hidden="true">→</span>
              </a>
              <a className="hero-text-link" href="#search-cars">
                ค้นหาตามงบประมาณ
              </a>
            </div>
          </div>

          <div className="hero-availability">
            <div className="hero-availability-heading">
              <span className="availability-indicator" />
              <span>รถพร้อมให้เช่าตอนนี้</span>
            </div>
            <strong className="availability-count">
              {availableCars.length}
            </strong>
            <span className="availability-caption">
              คันพร้อมออกเดินทาง
            </span>
            <div className="availability-divider" />
            <div className="availability-meta">
              <div>
                <strong>{availableTypes}</strong>
                <span>ประเภทรถ</span>
              </div>
              <div>
                <strong>ออนไลน์</strong>
                <span>ส่งคำขอจองได้ทุกเวลา</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel search-panel" id="search-cars">
          <div className="search-panel-heading">
            <span>ค้นหารถ</span>
            <h2>เริ่มจากสิ่งที่คุณกำลังมองหา</h2>
            <p>ระบุชื่อรถ ประเภท หรือราคาสูงสุดต่อวัน</p>
          </div>

          <CarSearchForm
            onSearch={async (q) => {
              setQuery(q);
            }}
          />
        </section>

        <div className="section-title" id="available-cars">
          <div>
            <h2>รถทั้งหมด</h2>
            <p>พบ {filtered.length} คัน</p>
          </div>
        </div>

        <div className="car-grid">
          {filtered.map((car) => (
            <article
              className="car-card reveal-on-scroll"
              key={car.id}
            >
              <img src={car.image} alt={car.name} />

              <div className="car-body">
                <span className="tag">{car.type}</span>
                <h3>{car.name}</h3>

                <p className="muted">
                  {car.brand} • {car.seats} ที่นั่ง • {car.transmission}
                </p>

                <div className="car-bottom">
                  <strong>
                    ฿{car.pricePerDay.toLocaleString()}
                    <small> / วัน</small>
                  </strong>

                  <button
                    type="button"
                    className="primary-button"
                    disabled={!car.available || isRefreshing}
                    aria-disabled={!car.available || isRefreshing}
                    onClick={() => {
                      if (!car.available) {
                        setShowUnavailablePopup(true);
                        return;
                      }

                      setSelectedCar(car);
                    }}
                  >
                    {car.available ? "เช่ารถ" : "รถถูกจองแล้ว"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty">
            ไม่พบรถที่ตรงกับเงื่อนไข
          </div>
        )}
      </main>

      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {showUnavailablePopup && (
        <div
          className="booking-popup-overlay"
          onClick={() => setShowUnavailablePopup(false)}
        >
          <div
            className="booking-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="unavailable-car-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="booking-popup-icon" aria-hidden="true">
              !
            </div>
            <h2 id="unavailable-car-popup-title">
              รถยังไม่เปิดเช่า
            </h2>
            <p>
              รถคันนี้ยังไม่เปิดให้จองในขณะนี้ กรุณาเลือกรถคันอื่น
            </p>
            <button
              type="button"
              className="booking-popup-button"
              onClick={() => setShowUnavailablePopup(false)}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </>
  );
}