import Link from "next/link";
import {registerAction} from "../actions/auth";
export default async function Register({searchParams}:{searchParams:Promise<{error?:string}>}){
 const p=await searchParams;
 return <main className="auth-page"><div className="auth-card"><h1>สมัครสมาชิก</h1><p>สร้างบัญชีผู้ใช้สำหรับเช่ารถ</p>{p.error&&<div className="error-box">{p.error}</div>}
 <form action={registerAction} className="auth-form"><label>ชื่อผู้ใช้<input name="name" required minLength={2}/></label><label>อีเมล<input name="email" type="email" required/></label><label>รหัสผ่าน<input name="password" type="password" minLength={6} required/></label><label>ยืนยันรหัสผ่าน<input name="confirmPassword" type="password" minLength={6} required/></label><button className="primary-button">สมัครสมาชิก</button></form>
 <p>มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link></p></div></main>
}