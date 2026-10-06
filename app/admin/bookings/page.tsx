import {getCurrentUser} from "../../lib/auth";
import {getBookings} from "../../lib/bookings";
import {redirect} from "next/navigation";
import {updateBookingStatusAction} from "../../actions/bookings";
import Link from "next/link";
export default async function AdminBookings(){
 const user=await getCurrentUser(); if(user?.role!=="admin") redirect("/login?error=เฉพาะผู้ดูแลระบบ");
 const bookings=await getBookings();
 return <main className="container"><Link href="/admin/cars" className="back">← จัดการรถ</Link><div className="section-title"><div><h1>รายการจองรถ</h1><p>ตรวจสอบและยืนยันการเช่ารถของสมาชิก</p></div></div>
 <div className="table-wrap"><table><thead><tr><th>ผู้เช่า</th><th>รถ</th><th>วันที่</th><th>รวม</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>{bookings.map(b=><tr key={b.id}><td>{b.userName}</td><td>{b.carName}</td><td>{b.startDate} ถึง {b.endDate}</td><td>฿{b.total.toLocaleString()}</td><td>{b.status}</td><td><div className="row-actions"><form action={updateBookingStatusAction.bind(null,b.id,"ยืนยันแล้ว")}><button className="primary-small">ยืนยัน</button></form><form action={updateBookingStatusAction.bind(null,b.id,"ยกเลิก")}><button className="danger-small">ยกเลิก</button></form></div></td></tr>)}</tbody></table>{bookings.length===0&&<div className="empty">ยังไม่มีรายการจอง</div>}</div></main>
}