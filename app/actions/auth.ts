"use server";
import { loginUser, logoutUser, registerUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema=z.object({email:z.string().email(),password:z.string().min(1)});
const RegisterSchema=z.object({name:z.string().trim().min(2,"กรุณากรอกชื่อ"),email:z.string().email("อีเมลไม่ถูกต้อง"),password:z.string().min(6,"รหัสผ่านอย่างน้อย 6 ตัว"),confirmPassword:z.string()}).refine(v=>v.password===v.confirmPassword,{path:["confirmPassword"],message:"รหัสผ่านไม่ตรงกัน"});

export async function loginAction(formData:FormData) {
 const result=LoginSchema.safeParse(Object.fromEntries(formData));
 if(!result.success) redirect("/login?error=ข้อมูลไม่ถูกต้อง");
 if(!await loginUser(result.data.email,result.data.password)) redirect("/login?error=อีเมลหรือรหัสผ่านไม่ถูกต้อง");
 redirect("/");
}
export async function registerAction(formData:FormData) {
 const result=RegisterSchema.safeParse(Object.fromEntries(formData));
 if(!result.success) redirect("/register?error=กรุณาตรวจสอบข้อมูล");
 const result2=await registerUser(result.data.name,result.data.email,result.data.password);
 if(!result2.ok) redirect("/register?error="+encodeURIComponent(result2.message));
 redirect("/");
}
export async function logoutAction(){ await logoutUser(); redirect("/"); }
