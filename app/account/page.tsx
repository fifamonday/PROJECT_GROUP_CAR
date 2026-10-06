import {getCurrentUser} from "../lib/auth";
import {getUserBookings} from "../lib/bookings";
import {redirect} from "next/navigation";
export default async function Account(){
 const user=await getCurrentUser(); if(!user) redirect("/login");
 const bookings=await getUserBookings(user.id);
 return <main className="container"><div className="section-title"><div><h1>รายการเช่าของฉัน</h1><p>ประวัติการจองรถของ {user.name}</p></div></div>
 <div className="table-wrap"><table><thead><tr><th>รถ</th><th>วันที่รับ</th><th>วันที่คืน</th><th>จำนวนวัน</th><th>รวม</th><th>สถานะ</th></tr></thead><tbody>{bookings.map(b=><tr key={b.id}><td>{b.carName}</td><td>{b.startDate}</td><td>{b.endDate}</td><td>{b.days}</td><td>฿{b.total.toLocaleString()}</td><td><span className="status">{b.status}</span></td></tr>)}</tbody></table>{bookings.length===0&&<div className="empty">ยังไม่มีรายการเช่ารถ</div>}</div></main>
}