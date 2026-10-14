# LANLODE Car Rental (car-rental-324)

เว็บแอปเช่ารถ สร้างด้วย Next.js (App Router) ผู้ใช้เข้าสู่ระบบด้วยบัญชี Google ค้นหารถ และจองรถได้ ส่วนผู้ดูแลระบบจัดการรถและรายการจองได้ ข้อมูลทั้งหมดเก็บเป็นไฟล์ JSON ในโฟลเดอร์ `data/`

## ฟีเจอร์

**ผู้ใช้ทั่วไป**
- เข้าสู่ระบบ / ออกจากระบบด้วย Google (NextAuth v5)
- ค้นหารถจากชื่อ ยี่ห้อ หรือทะเบียน และกรองตามประเภทรถกับราคาสูงสุดต่อวัน
- จองรถโดยเลือกวันรับและวันคืนรถ ระบบคำนวณจำนวนวันและราคารวมให้
- ดูรายการจองของตัวเองที่หน้า `/account`

**ผู้ดูแลระบบ (Admin)**
- เพิ่ม แก้ไข และลบรถ (`/admin/cars`)
- ดูรายการจองทั้งหมด เปลี่ยนสถานะ (รอยืนยัน / ยืนยันแล้ว / ยกเลิก / คืนรถแล้ว) และแก้ไขวันคืนรถ (`/admin/bookings`)
- บันทึกการคืนรถ ซึ่งจะเปิดให้รถคันนั้นจองได้อีกครั้ง

## เทคโนโลยี

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- [NextAuth (Auth.js) v5](https://authjs.dev/) กับ Google Provider
- React Hook Form + Zod สำหรับฟอร์มและการตรวจสอบข้อมูล
- Tailwind CSS v4 และ CSS ใน `src/app/globals.css`

## เริ่มต้นใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Google OAuth

1. เข้า [Google Cloud Console](https://console.cloud.google.com/apis/credentials) แล้วสร้าง **OAuth client ID** ประเภท *Web application*
2. เพิ่ม Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
3. สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```env
AUTH_SECRET=ค่าสุ่มยาวๆ        # สร้างด้วย: npx auth secret
AUTH_GOOGLE_ID=xxxxxxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=xxxxxxxx
```

> ไฟล์ `.env*` ถูก ignore ใน git แล้ว อย่า commit ค่า secret ขึ้น repository

### 3. รันโปรเจกต์

```bash
npm run dev
```

เปิด http://localhost:3000

## สคริปต์

| คำสั่ง | หน้าที่ |
| --- | --- |
| `npm run dev` | รัน development server |
| `npm run build` | build สำหรับ production |
| `npm run start` | รันเวอร์ชันที่ build แล้ว |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |

## สิทธิ์ Admin

ตอนนี้ระบบกำหนด Admin จากอีเมลที่เขียนไว้ในโค้ดโดยตรง อีเมลอื่นทั้งหมดจะได้สิทธิ์ `user` ถ้าจะเปลี่ยนอีเมล Admin ต้องแก้ **2 ที่**:

- `src/features/auth/config.ts` ใน callback `jwt`
- `src/features/auth/service.ts` ในฟังก์ชัน `getCurrentUser`

## โครงสร้างโปรเจกต์

```
data/
  cars.json          ข้อมูลรถ
  bookings.json      รายการจอง
  users.json         ผู้ใช้ (ใช้กับระบบ login แบบเดิม)
public/images/       โลโก้และรูปภาพ
src/
  app/               หน้าเว็บและ route
    page.tsx           หน้าแรก / ค้นหารถ
    rent/[id]/         หน้าจองรถ
    account/           รายการจองของผู้ใช้
    login/             หน้าเข้าสู่ระบบ
    contact/           หน้าติดต่อ
    admin/cars/        จัดการรถ (เพิ่ม/แก้ไข/ลบ)
    admin/bookings/    จัดการรายการจอง
    api/auth/[...nextauth]/  endpoint ของ NextAuth
  features/          โค้ดแยกตามฟีเจอร์
    auth/              config NextAuth, ผู้ใช้ปัจจุบัน, header, ปุ่ม login
    cars/              schema (Zod), service อ่าน/เขียนข้อมูลรถ, ฟอร์ม, ค้นหา
    bookings/          service การจอง, ฟอร์มจอง, แก้ไข, คืนรถ
```

แต่ละฟีเจอร์แบ่งไฟล์เป็น `service.ts` (อ่าน/เขียนไฟล์ JSON ทำงานฝั่ง server เท่านั้น), `actions.ts` (Server Actions ที่เช็กสิทธิ์ก่อนเรียก service) และ `components/`

## ข้อมูลและสถานะการจอง

- รถแต่ละคันมีฟิลด์ `available` ที่บอกว่าจองได้หรือไม่
- การจองใหม่จะเริ่มที่สถานะ `รอยืนยัน` แล้ว Admin เปลี่ยนเป็น `ยืนยันแล้ว`, `ยกเลิก` หรือ `คืนรถแล้ว`
- ถ้าแก้วันคืนรถ ระบบจะคำนวณจำนวนวันและราคารวมใหม่จากราคาต่อวันเดิม

## ข้อจำกัด

- การเก็บข้อมูลเป็นไฟล์ JSON เหมาะกับงานเดโมหรือโปรเจกต์ที่รันในเครื่อง ไม่รองรับผู้ใช้พร้อมกันจำนวนมาก และจะใช้ไม่ได้บนโฮสต์ที่ระบบไฟล์เป็นแบบอ่านอย่างเดียว เช่น Vercel ถ้าจะใช้งานจริงควรย้ายไปใช้ฐานข้อมูล
- ในโค้ดยังมีระบบ login ด้วยอีเมล/รหัสผ่านแบบเดิม (`loginUser`, `registerUser` ใน `src/features/auth/service.ts`) แต่หน้าเว็บตอนนี้ใช้แค่ Google Login
