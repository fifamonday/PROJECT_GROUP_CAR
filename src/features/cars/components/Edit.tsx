import Link from "next/link";
import { updateCarAction } from "@/features/cars/actions";

type Car = {
  id: number;
  name: string;
  brand: string;
  licensePlate: string;
  type: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuel: string;
  image: string;
  available: boolean;
};

type EditProps = {
  car: Car;
};

export default function Edit({ car }: EditProps) {
  return (
    <form
      action={updateCarAction.bind(null, car.id)}
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
            defaultValue={car.name}
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
            defaultValue={car.brand}
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
          defaultValue={car.licensePlate}
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
            defaultValue={car.type}
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
            ราคาเช่าต่อวัน
          </label>

          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min="0"
            defaultValue={car.pricePerDay}
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
            defaultValue={car.seats}
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
            defaultValue={car.transmission}
            required
          >
            <option value="อัตโนมัติ">
              อัตโนมัติ
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
          defaultValue={car.fuel}
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
          defaultValue={car.image}
          required
        />
      </div>

      <label className="check">
        <input
          type="checkbox"
          name="available"
          defaultChecked={car.available}
        />

        รถคันนี้พร้อมให้เช่า
      </label>

      <div className="admin-actions">
        <button
          type="submit"
          className="primary-button"
        >
          บันทึกการแก้ไข
        </button>

        <Link
          href="/admin/cars"
          className="secondary-button"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}