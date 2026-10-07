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
- แยกโค้ดตามฟีเจอร์เพื่อให้ง่ายต่อการค้นหาและดูแล
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
- `src/app/` หน้าเว็บและ route ของ Next.js
- `src/features/auth/` ระบบผู้ใช้, NextAuth และคอมโพเนนต์เข้าสู่ระบบ
- `src/features/cars/` ค้นหาและจัดการรถ, schema และข้อมูลรถ
- `src/features/bookings/` ฟอร์มเช่าและการจัดการรายการจอง
- `data/*.json` ข้อมูลตัวอย่าง

หมายเหตุ: การเก็บ JSON เหมาะสำหรับโครงงาน/เดโมในเครื่อง ไม่ใช่แนวทางสำหรับ production ที่มีผู้ใช้จำนวนมาก
