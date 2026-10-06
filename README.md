# Car Rental 324

โปรเจกต์เว็บเช่ารถที่ต่อยอดแนวคิดจาก ProductDemo เดิม

## สิ่งที่มี
- สมัครสมาชิก / Login / Logout
- แยกสิทธิ์ Admin และ User
- User ค้นหารถและสร้างรายการเช่า
- User ดูรายการเช่าของตัวเอง
- Admin เพิ่ม แก้ไข ลบรถ
- Admin ดูรายการจองและยืนยัน/ยกเลิก
- React Hook Form + Zod สำหรับรับและตรวจสอบข้อมูล
- แยก Component และ `lib` ตามแนวทางโปรเจกต์เดิม
- ข้อมูลเก็บใน `data/*.json` เหมาะสำหรับสาธิตงานในเครื่อง

## บัญชีตัวอย่าง
Admin: `admin@carrent.com` / `admin123`
User: `user@carrent.com` / `user123`

## วิธีรัน
```bash
npm install
npm run dev
```
เปิด `http://localhost:3000`

## โครงสร้างสำคัญ
- `app/page.tsx` หน้าแรก
- `app/components/CarExplorer.tsx` แสดง/ค้นหารถ
- `app/components/CarSearchForm.tsx` ฟอร์มค้นหา
- `app/components/CarForm.tsx` ฟอร์มเพิ่ม/แก้ไขรถ
- `app/components/BookingForm.tsx` ฟอร์มเช่ารถ
- `app/lib/cars.ts` Schema, Type และ CRUD รถ
- `app/lib/auth.ts` ระบบผู้ใช้และ Session
- `app/lib/bookings.ts` ข้อมูลรายการเช่า
- `app/actions/*.ts` รับข้อมูลจาก Form แล้วประมวลผล
- `app/admin/*` ส่วนผู้ดูแลระบบ
- `data/*.json` ข้อมูลตัวอย่าง

หมายเหตุ: การเก็บ JSON เหมาะสำหรับโครงงาน/เดโมในเครื่อง ไม่ใช่แนวทางสำหรับ production ที่มีผู้ใช้จำนวนมาก
