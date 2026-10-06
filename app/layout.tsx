import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from "./lib/auth";
import { logoutAction } from "./actions/auth";

export const metadata={title:"Car Rent 324",description:"ระบบเช่ารถออนไลน์"};

export default async function RootLayout({children}:{children:React.ReactNode}){
 const user=await getCurrentUser();
 return <html lang="th"><body>
  <header className="navbar">
   <Link href="/" className="brand">🚗 Car Rent 324</Link>
   <nav>
    <Link href="/">รถเช่า</Link>
    {user && <Link href="/account">รายการเช่า</Link>}
    {user?.role==="admin" && <Link href="/admin/cars">จัดการรถ</Link>}
    {user ? <form action={logoutAction} className="inline-form"><span className="user-label">สวัสดี {user.name}</span><button className="nav-button">ออกจากระบบ</button></form>
      : <><Link href="/login">เข้าสู่ระบบ</Link><Link href="/register" className="nav-button">สมัครสมาชิก</Link></>}
   </nav>
  </header>
  {children}
  <footer>Car Rent 324 • ระบบเช่ารถสำหรับโครงงาน</footer>
 </body></html>
}