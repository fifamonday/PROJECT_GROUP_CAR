
"use server";

import { getCurrentUser } from "@/features/auth/service";

import {
  createBooking,
  getBooking,
  getBookings,
  updateBooking,
  updateBookingStatus,
} from "@/features/bookings/service";

import {
  getCars,
  setCarAvailability,
} from "@/features/cars/service";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type BookingStatus = Parameters<typeof updateBookingStatus>[1];

// กันคนที่ไม่ใช่ admin
async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return user;
}

// สั่งให้หน้าที่เกี่ยวกับการจองโหลดข้อมูลใหม่
function revalidateBookingPages() {
  revalidatePath("/account");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/cars");
  revalidatePath("/");
}

/* =========================================================
   CREATE BOOKING
========================================================= */

// สำคัญ: ลูกค้ากดจอง → เช็ก login, วันเวลา, รถว่าง → คิดราคา → บันทึก
export async function createBookingAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("กรุณาเข้าสู่ระบบก่อนเช่ารถ")}`
    );
  }

  const carId = Number(formData.get("carId"));
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");

  if (
    !Number.isInteger(carId) ||
    carId <= 0 ||
    !startDate ||
    !endDate ||
    !startTime ||
    !endTime
  ) {
    return {
      success: false as const,
      message: "กรุณากรอกข้อมูลการเช่าให้ครบ",
    };
  }

  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start
  ) {
    return {
      success: false as const,
      message: "วันและเวลาคืนรถต้องอยู่หลังวันและเวลารับรถ",
    };
  }

  // จำนวนวัน = (เวลาคืน - เวลารับ) ÷ 1 วัน ปัดเศษขึ้น
  const days = Math.ceil(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (days < 1) {
    return {
      success: false as const,
      message: "ระยะเวลาเช่าไม่ถูกต้อง",
    };
  }

  const cars = await getCars();
  const car = cars.find((item) => item.id === carId);

  if (!car) {
    return {
      success: false as const,
      message: "ไม่พบรถที่ต้องการเช่า",
    };
  }

  if (!car.available) {
    return {
      success: false as const,
      message: "รถยังไม่เปิดเช่า",
    };
  }

  await createBooking({
    carId: car.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    carName: car.name,
    licensePlate: car.licensePlate,
    startDate,
    endDate,
    startTime,
    endTime,
    days,
    total: days * car.pricePerDay,
  });

  revalidateBookingPages();

  return {
    success: true as const,
    message: "ส่งคำขอเช่ารถเรียบร้อย",
  };
}

/* =========================================================
   UPDATE BOOKING
========================================================= */

// admin แก้วันคืนรถ
export async function updateBookingAction(
  id: number,
  formData: FormData
) {
  await requireAdmin();

  const endDate = String(formData.get("endDate") ?? "");

  if (!endDate) {
    throw new Error("กรุณาเลือกวันคืนรถ");
  }

  await updateBooking(id, endDate);

  revalidatePath("/admin/bookings");
  revalidatePath("/account");

  redirect("/admin/bookings");
}

/* =========================================================
   UPDATE BOOKING STATUS
   Admin can confirm or cancel pending bookings.
   Returning a car must use returnCarAction.
========================================================= */

// admin ยืนยัน/ยกเลิก (ได้เฉพาะรายการรอยืนยัน) ยืนยันแล้วปิดรถ
export async function updateBookingStatusAction(
  id: number,
  status: BookingStatus
) {
  await requireAdmin();

  if (status === "คืนรถแล้ว") {
    throw new Error(
      "กรุณาใช้ปุ่มคืนรถสำหรับเปลี่ยนสถานะเป็นคืนรถแล้ว"
    );
  }

  const booking = await getBooking(id);

  if (!booking) {
    throw new Error("ไม่พบรายการเช่า");
  }

  if (booking.status !== "รอยืนยัน") {
    throw new Error(
      "รายการนี้ไม่ได้อยู่ในสถานะรอยืนยันแล้ว"
    );
  }

  if (status !== "ยืนยันแล้ว" && status !== "ยกเลิก") {
    throw new Error("สถานะการจองไม่ถูกต้อง");
  }

  const updatedBooking = await updateBookingStatus(id, status);

  if (status === "ยืนยันแล้ว") {
    await setCarAvailability(updatedBooking.carId, false);
  }

  revalidateBookingPages();
}

/* =========================================================
   ADMIN RETURNS CAR
========================================================= */

// admin คืนรถ (ได้เฉพาะยืนยันแล้ว) แล้วเปิดรถให้จองได้อีก
export async function returnCarAction(id: number) {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("รหัสรายการจองไม่ถูกต้อง");
  }

  const booking = await getBooking(id);

  if (!booking) {
    throw new Error("ไม่พบรายการเช่า");
  }

  if (booking.status !== "ยืนยันแล้ว") {
    throw new Error(
      "คืนรถได้เฉพาะรายการที่มีสถานะยืนยันแล้วเท่านั้น"
    );
  }

  // เปลี่ยนสถานะรายการเดิม ไม่ลบประวัติ
  await updateBookingStatus(id, "คืนรถแล้ว");

  // ตรวจสอบว่ารถคันนี้ยังมีรายการจองที่ยืนยันแล้วอื่นหรือไม่
  const bookings = await getBookings();

  const hasOtherConfirmedBooking = bookings.some(
    (item) =>
      item.carId === booking.carId &&
      item.id !== booking.id &&
      item.status === "ยืนยันแล้ว"
  );

  // เปิดรถรับจองใหม่เมื่อไม่มีรายการยืนยันอื่นค้างอยู่
  if (!hasOtherConfirmedBooking) {
    await setCarAvailability(booking.carId, true);
  }

  revalidateBookingPages();
}
