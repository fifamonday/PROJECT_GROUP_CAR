import { getCurrentUser } from "@/features/auth/service";
import { getCars } from "@/features/cars/service";
import {redirect,notFound} from "next/navigation";
import Link from "next/link";
import CarForm from "@/features/cars/components/CarForm";
export default async function EditCar({params}:{params:Promise<{id:string}>}){
 const user=await getCurrentUser(); if(user?.role!=="admin") redirect("/login?error=เฉพาะผู้ดูแลระบบ");
 const {id}=await params; const car=(await getCars()).find(c=>c.id===Number(id)); if(!car) notFound();
 return <main className="container narrow"><Link href="/admin/cars" className="back">← กลับจัดการรถ</Link><div className="panel"><h1>แก้ไขข้อมูลรถ</h1><CarForm car={car}/></div></main>
}