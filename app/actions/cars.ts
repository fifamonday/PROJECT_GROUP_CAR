"use server";
import { createCar, updateCar, deleteCar } from "@/app/lib/cars";
import { CarDraftSchema } from "@/app/lib/car-schema";
import { getCurrentUser } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin(){
 const user=await getCurrentUser();
 if(!user || user.role!=="admin") redirect("/login?error=เฉพาะผู้ดูแลระบบ");
 return user;
}
function formToDraft(fd:FormData){
 return {
  name:String(fd.get("name")||""), brand:String(fd.get("brand")||""), type:String(fd.get("type")||""),
  pricePerDay:Number(fd.get("pricePerDay")), seats:Number(fd.get("seats")),
  transmission:String(fd.get("transmission")||""), fuel:String(fd.get("fuel")||""),
  image:String(fd.get("image")||""), available:fd.get("available")==="on"
 };
}
export async function createCarAction(fd:FormData){
 await requireAdmin(); const result=CarDraftSchema.safeParse(formToDraft(fd));
 if(!result.success) throw new Error(result.error.issues[0]?.message||"ข้อมูลรถไม่ถูกต้อง");
 await createCar(result.data); revalidatePath("/"); revalidatePath("/admin/cars"); redirect("/admin/cars");
}
export async function updateCarAction(id:number,fd:FormData){
 await requireAdmin(); const result=CarDraftSchema.safeParse(formToDraft(fd));
 if(!result.success) throw new Error(result.error.issues[0]?.message||"ข้อมูลรถไม่ถูกต้อง");
 await updateCar(id,result.data); revalidatePath("/"); revalidatePath("/admin/cars"); redirect("/admin/cars");
}
export async function deleteCarAction(id:number){
 await requireAdmin(); await deleteCar(id); revalidatePath("/"); revalidatePath("/admin/cars"); redirect("/admin/cars");
}
