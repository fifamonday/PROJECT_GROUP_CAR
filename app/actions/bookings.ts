 "use server";
import { getCurrentUser } from "@/app/lib/auth";
import { createBooking, updateBookingStatus } from "@/app/lib/bookings";
import { getCars } from "@/app/lib/cars";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBookingAction(fd:FormData){
 const user=await getCurrentUser(); if(!user) redirect("/login?error=กรุณาเข้าสู่ระบบก่อนเช่ารถ");
 const carId=Number(fd.get("carId")); const start=String(fd.get("startDate")||""); const end=String(fd.get("endDate")||"");
 const startDate=new Date(start), endDate=new Date(end);
 const days=Math.ceil((endDate.getTime()-startDate.getTime())/(1000*60*60*24));
 if(!start || !end || !Number.isFinite(days) || days<1) redirect(`/rent/${carId}?error=วันที่เช่าไม่ถูกต้อง`);
 const cars=await getCars(); const car=cars.find(c=>c.id===carId); if(!car) redirect("/");
 await createBooking({carId,userId:user.id,userName:user.name,carName:car.name,startDate:start,endDate:end,days,total:days*car.pricePerDay});
 revalidatePath("/account"); redirect("/account");
}
export async function updateBookingStatusAction(id:number,status:"ยืนยันแล้ว"|"ยกเลิก"){
 const user=await getCurrentUser(); if(user?.role!=="admin") redirect("/");
 await updateBookingStatus(id,status); revalidatePath("/admin/bookings"); revalidatePath("/account");
}
