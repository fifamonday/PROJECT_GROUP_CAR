import {getCars} from "../../lib/cars";
import {getCurrentUser} from "../../lib/auth";
import {notFound} from "next/navigation";
import Link from "next/link";
import BookingForm from "../../components/BookingForm";
export default async function RentPage({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<{error?:string}>}){
 const {id}=await params; const p=await searchParams; const car=(await getCars()).find(c=>c.id===Number(id)); if(!car) notFound(); const user=await getCurrentUser();
 return <main className="container narrow"><Link href="/" className="back">← กลับหน้ารายการรถ</Link><div className="rent-card"><img src={car.image} alt={car.name}/><div className="rent-content"><span className="tag">{car.type}</span><h1>{car.name}</h1><p>{car.brand} • {car.seats} ที่นั่ง • {car.transmission} • {car.fuel}</p><div className="rent-price">฿{car.pricePerDay.toLocaleString()} <small>/ วัน</small></div>{p.error&&<div className="error-box">{p.error}</div>}{user?<BookingForm car={car}/>:<div className="login-note">กรุณา <Link href="/login">เข้าสู่ระบบ</Link> ก่อนจึงจะเช่ารถได้</div>}</div></div></main>
}