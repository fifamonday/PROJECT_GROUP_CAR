import {getCurrentUser} from "../../lib/auth";
import {getCars} from "../../lib/cars";
import {redirect} from "next/navigation";
import Link from "next/link";
import CarForm from "../../components/CarForm";
import {deleteCarAction} from "../../actions/cars";
export default async function AdminCars(){
 const user=await getCurrentUser(); if(user?.role!=="admin") redirect("/login?error=เฉพาะผู้ดูแลระบบ");
 const cars=await getCars();
 return <main className="container"><div className="section-title"><div><h1>จัดการรถ</h1><p>เพิ่ม แก้ไข และลบรถที่ให้บริการ</p></div><Link href="/admin/bookings" className="secondary-button">ดูรายการจอง</Link></div>
 <div className="admin-layout"><section className="panel"><h2>เพิ่มรถใหม่</h2><CarForm/></section><section><h2>รถในระบบ ({cars.length})</h2><div className="admin-list">{cars.map(car=><div className="admin-car" key={car.id}><img src={car.image} alt={car.name}/><div><h3>{car.name}</h3><p>{car.type} • ฿{car.pricePerDay.toLocaleString()}/วัน</p></div><div className="admin-actions"><Link href={`/admin/cars/${car.id}`} className="secondary-button">แก้ไข</Link><form action={deleteCarAction.bind(null,car.id)}><button className="danger-button">ลบ</button></form></div></div>)}</div></section></div></main>
}