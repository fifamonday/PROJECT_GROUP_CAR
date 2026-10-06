import "server-only";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const filePath=path.join(process.cwd(),"data/bookings.json");
export const BookingSchema=z.object({
 id:z.number(), carId:z.number(), userId:z.number(), userName:z.string(),
 carName:z.string(), startDate:z.string(), endDate:z.string(), days:z.number(),
 total:z.number(), status:z.enum(["รอยืนยัน","ยืนยันแล้ว","ยกเลิก"])
});
export type Booking=z.infer<typeof BookingSchema>;
export async function getBookings():Promise<Booking[]> { return JSON.parse(await fs.readFile(filePath,"utf8")); }
async function save(items:Booking[]) { await fs.writeFile(filePath,JSON.stringify(items,null,2),"utf8"); }
export async function createBooking(data:Omit<Booking,"id"|"status">) {
 const items=await getBookings(); const item={...data,id:Date.now(),status:"รอยืนยัน" as const};
 items.push(item); await save(items); return item;
}
export async function getUserBookings(userId:number) { return (await getBookings()).filter(b=>b.userId===userId); }
export async function updateBookingStatus(id:number,status:Booking["status"]) {
 const items=await getBookings(); const item=items.find(b=>b.id===id); if(!item) throw new Error("ไม่พบรายการเช่า");
 item.status=status; await save(items); return item;
}
