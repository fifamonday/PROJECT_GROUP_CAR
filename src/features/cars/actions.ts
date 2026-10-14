// ควบคุมสิทธิ์และเรียกใช้การจัดการรถ
"use server";

import { getCurrentUser } from "@/features/auth/service";
import { CarDraftSchema } from "@/features/cars/schema";
import {
  createCar,
  deleteCar,
  setCarAvailability,
  updateCar,
} from "@/features/cars/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// กันคนที่ไม่ใช่ admin เรียก action ของ admin
async function requireAdmin() {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/login?error=เฉพาะผู้ดูแลระบบ");
  }
}

// แปลงค่าจากฟอร์มเป็นข้อมูลรถ แล้วตรวจด้วย Zod
function parseCarDraft(formData: FormData) {
  return CarDraftSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    licensePlate: String(formData.get("licensePlate") ?? ""),
    type: String(formData.get("type") ?? ""),
    pricePerDay: Number(formData.get("pricePerDay")),
    seats: Number(formData.get("seats")),
    transmission: String(formData.get("transmission") ?? ""),
    fuel: String(formData.get("fuel") ?? ""),
    image: String(formData.get("image") ?? ""),
    available: formData.get("available") === "on",
  });
}

// ปุ่มเพิ่มรถ: ตรวจข้อมูล → บันทึก → กลับหน้าจัดการรถ (ผิดพลาดคืนข้อความให้ popup)
export async function createCarAction(formData: FormData) {
  await requireAdmin();

  const result = parseCarDraft(formData);

  // คืนข้อความให้ฟอร์มแสดงแจ้งเตือน แทนการ throw ซึ่งทำให้หน้าเว็บ error
  if (!result.success) {
    return {
      success: false as const,
      message:
        result.error.issues[0]?.message ?? "ข้อมูลรถไม่ถูกต้อง",
    };
  }

  try {
    await createCar(result.data);
  } catch (error) {
    console.error("Create car error:", error);

    return {
      success: false as const,
      message: "บันทึกข้อมูลรถไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/cars");

  redirect("/admin/cars");
}

// ปุ่มบันทึกการแก้ไขรถ
export async function updateCarAction(
  id: number,
  formData: FormData
) {
  await requireAdmin();

  const result = parseCarDraft(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "ข้อมูลรถไม่ถูกต้อง"
    );
  }

  await updateCar(id, result.data);

  revalidatePath("/");
  revalidatePath("/admin/cars");

  redirect("/admin/cars");
}

// ปุ่มลบรถ
export async function deleteCarAction(id: number) {
  await requireAdmin();

  await deleteCar(id);

  revalidatePath("/");
  revalidatePath("/admin/cars");

  redirect("/admin/cars");
}

/* เปิดรถกลับมารับจองใหม่ */
export async function openCarForBookingAction(id: number) {
  await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("รหัสรถไม่ถูกต้อง");
  }

  await setCarAvailability(id, true);

  revalidatePath("/");
  revalidatePath("/admin/cars");
  revalidatePath("/admin/bookings");
  revalidatePath("/account");

  redirect("/admin/cars");
}
