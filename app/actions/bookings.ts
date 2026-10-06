"use server";

import { getCurrentUser } from "@/app/lib/auth";

import {
  createBooking,
  updateBookingStatus,
} from "@/app/lib/bookings";

import { getCars } from "@/app/lib/cars";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

export async function createBookingAction(
  fd: FormData
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "กรุณาเข้าสู่ระบบก่อนเช่ารถ"
      )}`
    );
  }

  const carId = Number(fd.get("carId"));

  const start = String(
    fd.get("startDate") || ""
  );

  const end = String(
    fd.get("endDate") || ""
  );

  if (!carId || !start || !end) {
    redirect(
      `/rent/${carId}?error=${encodeURIComponent(
        "ข้อมูลการเช่าไม่ครบ"
      )}`
    );
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate <= startDate) {
    redirect(
      `/rent/${carId}?error=${encodeURIComponent(
        "ต้องเลือกวันคืนรถหลังวันรับรถ"
      )}`
    );
  }

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (!Number.isFinite(days) || days < 1) {
    redirect(
      `/rent/${carId}?error=${encodeURIComponent(
        "วันที่เช่าไม่ถูกต้อง"
      )}`
    );
  }

  const cars = await getCars();

  const car = cars.find(
    (item) => item.id === carId
  );

  if (!car) {
    redirect("/");
  }

  await createBooking({
    carId: car.id,

    userId: user.id,

    userName: user.name,

    // สำคัญ: บันทึก Email ของ Google คนที่จอง
    userEmail: user.email,

    carName: car.name,

    startDate: start,

    endDate: end,

    days,

    total: days * car.pricePerDay,
  });

  revalidatePath("/account");

  redirect("/account");
}

export async function updateBookingStatusAction(
  id: number,
  status: "ยืนยันแล้ว" | "ยกเลิก"
) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/");
  }

  await updateBookingStatus(id, status);

  revalidatePath("/admin/bookings");

  revalidatePath("/account");
}