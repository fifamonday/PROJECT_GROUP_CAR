"use server";

import { getCurrentUser } from "@/features/auth/service";
import { CarDraftSchema } from "@/features/cars/schema";
import {
  createCar,
  deleteCar,
  updateCar,
} from "@/features/cars/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/login?error=เฉพาะผู้ดูแลระบบ");
  }
}

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

export async function createCarAction(formData: FormData) {
  await requireAdmin();

  const result = parseCarDraft(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues[0]?.message ?? "ข้อมูลรถไม่ถูกต้อง"
    );
  }

  await createCar(result.data);
  revalidatePath("/");
  revalidatePath("/admin/cars");
  redirect("/admin/cars");
}

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

export async function deleteCarAction(id: number) {
  await requireAdmin();

  await deleteCar(id);
  revalidatePath("/");
  revalidatePath("/admin/cars");
  redirect("/admin/cars");
}
