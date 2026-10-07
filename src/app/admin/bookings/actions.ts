"use server";

import { getCurrentUser } from "@/features/auth/service";

import {
  createBooking,
  updateBooking,
  updateBookingStatus,
} from "@/features/bookings/service";

import { getCars } from "@/features/cars/service";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";


/* =========================================================
   CREATE BOOKING
========================================================= */

export async function createBookingAction(
  formData: FormData
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "กรุณาเข้าสู่ระบบก่อนเช่ารถ"
      )}`
    );
  }

  const carId = Number(
    formData.get("carId")
  );

  const startDate = String(
    formData.get("startDate") ?? ""
  );

  const endDate = String(
    formData.get("endDate") ?? ""
  );

  const startTime = String(
    formData.get("startTime") ?? ""
  );

  const endTime = String(
    formData.get("endTime") ?? ""
  );

  if (
    !Number.isInteger(carId) ||
    carId <= 0 ||
    !startDate ||
    !endDate ||
    !startTime ||
    !endTime
  ) {
    throw new Error(
      "ข้อมูลการเช่าไม่ครบ"
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start
  ) {
    throw new Error(
      "ต้องเลือกวันคืนรถหลังวันรับรถ"
    );
  }

  const days = Math.ceil(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (
    !Number.isFinite(days) ||
    days < 1
  ) {
    throw new Error(
      "วันที่เช่าไม่ถูกต้อง"
    );
  }

  const cars = await getCars();

  const car = cars.find(
    (item) => item.id === carId
  );

  if (!car) {
    throw new Error(
      "ไม่พบรถที่ต้องการเช่า"
    );
  }

  await createBooking({
    carId: car.id,

    userId: user.id,

    userName: user.name,

    userEmail: user.email,

    carName: car.name,

    licensePlate:
      car.licensePlate,

    startDate,

    endDate,

    days,

    total:
      days * car.pricePerDay,
  });

  revalidatePath("/account");

  revalidatePath("/admin/bookings");
}


/* =========================================================
   UPDATE BOOKING
========================================================= */

export async function updateBookingAction(
  id: number,
  formData: FormData
) {
  const user =
    await getCurrentUser();

  if (
    !user ||
    user.role !== "admin"
  ) {
    redirect("/");
  }

  const endDate = String(
    formData.get("endDate") ?? ""
  );

  if (!endDate) {
    throw new Error(
      "กรุณาเลือกวันคืนรถ"
    );
  }

  await updateBooking(
    id,
    endDate
  );

  revalidatePath(
    "/admin/bookings"
  );

  revalidatePath(
    "/account"
  );

  redirect(
    "/admin/bookings"
  );
}


/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

export async function updateBookingStatusAction(
  id: number,
  status:
    | "รอยืนยัน"
    | "ยืนยันแล้ว"
    | "ยกเลิก"
) {
  const user =
    await getCurrentUser();

  // ต้องเป็น Admin
  if (
    !user ||
    user.role !== "admin"
  ) {
    redirect("/");
  }

  // เปลี่ยนสถานะ
  await updateBookingStatus(
    id,
    status
  );

  // บังคับให้หน้า Admin โหลดข้อมูลใหม่
  revalidatePath(
    "/admin/bookings"
  );

  // บังคับให้หน้าลูกค้าโหลดข้อมูลใหม่
  revalidatePath(
    "/account"
  );

  // กลับไปหน้า Admin
  redirect(
    "/admin/bookings"
  );
}