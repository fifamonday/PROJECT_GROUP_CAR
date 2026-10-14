
import "server-only";

import { z } from "zod";

import {
  readCollection,
  writeCollection,
} from "@/lib/store";

/* =========================================================
   BOOKING SCHEMA
========================================================= */

// กฎข้อมูลการจอง + สถานะ 4 แบบ
export const BookingSchema = z.object({
  id: z.number(),

  carId: z.number(),

  userId: z.number(),

  userName: z.string(),

  userEmail: z.string().optional(),

  carName: z.string(),

  licensePlate: z.string(),

  startDate: z.string(),

  endDate: z.string(),

  // เวลารับ/คืนรถ (HH:mm) รายการเก่าที่จองก่อนเพิ่มฟิลด์นี้จะไม่มี
  startTime: z.string().optional(),

  endTime: z.string().optional(),

  days: z.number(),

  total: z.number(),

  status: z.enum([
    "รอยืนยัน",
    "ยืนยันแล้ว",
    "ยกเลิก",
    "คืนรถแล้ว",
  ]),
});

export type Booking = z.infer<typeof BookingSchema>;

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

// อ่านการจองทั้งหมด
export async function getBookings(): Promise<Booking[]> {
  const data = await readCollection("bookings");

  return BookingSchema.array().parse(data);
}

/* =========================================================
   SAVE BOOKINGS
========================================================= */

// บันทึกการจองทั้งหมดกลับ
async function save(items: Booking[]) {
  await writeCollection("bookings", items);
}

/* =========================================================
   CREATE BOOKING
========================================================= */

// สร้างการจองใหม่ สถานะเริ่มต้น = รอยืนยัน
export async function createBooking(
  data: Omit<Booking, "id" | "status">
) {
  const items = await getBookings();

  const item: Booking = {
    ...data,
    id: Date.now(),
    status: "รอยืนยัน",
  };

  // เพิ่มรายการใหม่ไว้บนสุด
  items.unshift(item);

  await save(items);

  return item;
}

/* =========================================================
   GET USER BOOKINGS
========================================================= */

// การจองของผู้ใช้คนเดียว (เทียบอีเมล)
export async function getUserBookings(userEmail: string) {
  const items = await getBookings();

  return items.filter(
    (booking) =>
      booking.userEmail?.toLowerCase() ===
      userEmail.toLowerCase()
  );
}

/* =========================================================
   GET BOOKING BY ID
========================================================= */

// หาการจอง 1 รายการจาก id
export async function getBooking(id: number) {
  const items = await getBookings();

  return items.find(
    (booking) => booking.id === id
  );
}

/* =========================================================
   UPDATE BOOKING
========================================================= */

// แก้วันคืนรถ แล้วคิดจำนวนวันและราคาใหม่
export async function updateBooking(
  id: number,
  endDate: string
) {
  const items = await getBookings();

  const booking = items.find(
    (item) => item.id === id
  );

  if (!booking) {
    throw new Error("ไม่พบรายการเช่า");
  }

  const start = new Date(booking.startDate);
  const oldEnd = new Date(booking.endDate);
  const newEnd = new Date(endDate);

  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(oldEnd.getTime()) ||
    !Number.isFinite(newEnd.getTime())
  ) {
    throw new Error("รูปแบบวันที่ไม่ถูกต้อง");
  }

  if (newEnd <= start) {
    throw new Error(
      "ต้องเลือกวันคืนรถหลังวันรับรถ"
    );
  }

  const oldDays = Math.ceil(
    (oldEnd.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const newDays = Math.ceil(
    (newEnd.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (oldDays < 1 || newDays < 1) {
    throw new Error("ระยะเวลาเช่าไม่ถูกต้อง");
  }

  // ราคาต่อวัน = ยอดเดิม ÷ จำนวนวันเดิม
  const pricePerDay = booking.total / oldDays;

  booking.endDate = endDate;
  booking.days = newDays;
  booking.total = newDays * pricePerDay;

  await save(items);

  return booking;
}

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

// เปลี่ยนสถานะการจอง
export async function updateBookingStatus(
  id: number,
  status: Booking["status"]
) {
  const items = await getBookings();

  const item = items.find(
    (booking) => booking.id === id
  );

  if (!item) {
    throw new Error("ไม่พบรายการเช่า");
  }

  item.status = status;

  await save(items);

  return item;
}
