"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { createCarAction } from "@/features/cars/actions";

// ฟอร์มเพิ่มรถ (admin)
export default function CarForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // ส่งฟอร์มเอง เพื่อไม่ให้ข้อมูลที่กรอกหายเมื่อบันทึกไม่ผ่าน
  // ส่งฟอร์มเอง ถ้าไม่ผ่านแสดง popup และข้อมูลที่กรอกไม่หาย
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createCarAction(formData);

      if (result && result.success === false) {
        setErrorMessage(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="admin-form"
    >
      <div className="two-col">
        <div>
          <label htmlFor="name">
            ชื่อรถ
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="เช่น Toyota Camry"
            required
          />
        </div>

        <div>
          <label htmlFor="brand">
            ยี่ห้อ
          </label>

          <input
            id="brand"
            name="brand"
            type="text"
            placeholder="เช่น Toyota"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="licensePlate">
          ทะเบียนรถ
        </label>

        <input
          id="licensePlate"
          name="licensePlate"
          type="text"
          placeholder="เช่น กข 1234 เชียงใหม่"
          required
        />
      </div>

      <div className="two-col">
        <div>
          <label htmlFor="type">
            ประเภทรถ
          </label>

          <select
            id="type"
            name="type"
            defaultValue="รถเก๋ง"
            required
          >
            <option value="รถเก๋ง">
              รถเก๋ง
            </option>

            <option value="SUV">
              SUV
            </option>

            <option value="กระบะ">
              กระบะ
            </option>

            <option value="รถตู้">
              รถตู้
            </option>

            <option value="มอเตอร์ไซค์">
              มอเตอร์ไซค์
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="pricePerDay">
            ราคา / วัน
          </label>

          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min="1"
            placeholder="เช่น 1500"
            required
          />
        </div>
      </div>

      <div className="two-col">
        <div>
          <label htmlFor="seats">
            จำนวนที่นั่ง
          </label>

          <input
            id="seats"
            name="seats"
            type="number"
            min="1"
            max="15"
            placeholder="เช่น 5"
            required
          />
        </div>

        <div>
          <label htmlFor="transmission">
            เกียร์
          </label>

          <select
            id="transmission"
            name="transmission"
            defaultValue="อัตโนมัติ"
            required
          >
            <option value="อัตโนมัติ">
              ออโต้
            </option>

            <option value="ธรรมดา">
              ธรรมดา
            </option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="fuel">
          เชื้อเพลิง
        </label>

        <select
          id="fuel"
          name="fuel"
          defaultValue="เบนซิน"
          required
        >
          <option value="เบนซิน">
            เบนซิน
          </option>

          <option value="ดีเซล">
            ดีเซล
          </option>

          <option value="ไฟฟ้า">
            ไฟฟ้า
          </option>

          <option value="ไฮบริด">
            ไฮบริด
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="image">
          URL รูปรถ
        </label>

        <input
          id="image"
          name="image"
          type="url"
          placeholder="https://example.com/car.jpg"
          required
        />
      </div>

      <label className="check">
        <input
          type="checkbox"
          name="available"
          defaultChecked
        />

        เปิดให้เช่า
      </label>

      <button
        type="submit"
        className="primary-button"
        disabled={isPending}
      >
        {isPending ? "กำลังบันทึก..." : "เพิ่มรถเข้าระบบ"}
      </button>

      {errorMessage && (
        <div
          className="car-unavailable-overlay"
          onClick={() => setErrorMessage("")}
        >
          <div
            className="car-unavailable-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="car-form-error-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="car-unavailable-icon" aria-hidden="true">!</div>
            <h2 id="car-form-error-title">เพิ่มรถไม่สำเร็จ</h2>
            <p>{errorMessage}</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setErrorMessage("")}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </form>
  );
}