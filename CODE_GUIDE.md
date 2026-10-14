# คู่มือโค้ด LANLODE Car Rental (สำหรับตอบคำถามครู)

## 0. อ่านอันนี้ก่อน: เว็บนี้ทำงานยังไง (แบบง่ายที่สุด)

LANLODE คือเว็บเช่ารถ: ลูกค้า login ด้วย Google เลือกรถ เลือกวันเวลา ระบบคิดราคาให้ ส่วน admin เป็นคนกดยืนยัน และบันทึกตอนคืนรถ

**เปรียบเทียบกับร้านเช่ารถจริง**

| ในร้านจริง | ในโค้ด | ไฟล์ |
| --- | --- | --- |
| หน้าร้านที่ลูกค้าเห็น | หน้าเว็บ / Component | `src/app/`, `components/` |
| พนักงานที่เช็กบัตรและคิดเงิน | Server Action | `actions.ts` |
| สมุดบัญชีที่จดรายการ | Service | `service.ts` |
| ตู้เก็บเอกสาร | Redis (บน Vercel) / ไฟล์ JSON (ในเครื่อง) | `src/lib/store.ts` |
| บัตรพนักงาน (ใครเป็น admin) | NextAuth + Google | `features/auth/config.ts` |

**เรื่องที่ 1: ลูกค้า login**

1. กด Login ด้วย Google → Google ส่งผลกลับมาที่ `/api/auth/...`
2. ฟังก์ชัน `jwt` ดูอีเมล: ตรงกับอีเมล admin → เป็น admin ไม่งั้นเป็น user
3. ทุกหน้าเรียก `getCurrentUser()` เพื่อรู้ว่าใครเปิดอยู่ แถบเมนูจะโชว์ "รายการจอง / จัดการรถ" เฉพาะ admin

**เรื่องที่ 2: ลูกค้าจองรถ**

1. หน้าแรก (`CarExplorer`) แสดงรถ ค้นหาได้ตามชื่อ ประเภท ราคา
2. กด "เช่ารถ" → popup `BookingModal` ให้เลือกวันและเวลารับ-คืน
3. กดยืนยัน → `createBookingAction` เช็ก 4 อย่าง: login แล้วไหม / กรอกครบไหม / วันคืนหลังวันรับไหม / รถว่างไหม
4. คิดเงิน: **จำนวนวัน × ราคาต่อวัน** (เกินมาแม้ 1 ชั่วโมงนับเป็นอีก 1 วัน)
5. บันทึกด้วย `createBooking` สถานะเริ่มต้น = **รอยืนยัน** ลูกค้าเห็นรายการที่หน้า "ประวัติเช่ารถ"

**เรื่องที่ 3: admin จัดการการจอง**

1. หน้า "รายการจอง" กด **ยืนยัน** → `updateBookingStatusAction` เปลี่ยนสถานะ แล้ว**ปิดรถคันนั้น**ไม่ให้คนอื่นจองซ้ำ (หรือกด **ยกเลิก** ก็จบ)
2. ลูกค้าเอารถมาคืน → admin กด **คืนรถ** → `returnCarAction` เปลี่ยนเป็น "คืนรถแล้ว" และ**เปิดรถให้จองได้อีก**
3. ลูกค้าคืนก่อนกำหนด → admin แก้วันคืน (`updateBooking`) ระบบคิดวันและเงินใหม่

**เรื่องที่ 4: admin เพิ่มรถ**

1. หน้า "จัดการรถ" กรอกฟอร์ม (`CarForm`) → `createCarAction`
2. Zod ตรวจ: ชื่อห้ามว่าง ราคา > 0 ที่นั่ง 1–15 รูปต้องเป็น URL ผิด → popup แจ้งเตือน ค่าที่กรอกไม่หาย
3. ผ่าน → `createCar` บันทึก รถขึ้นหน้าแรกทันที

**คำตอบสำเร็จรูปเมื่อครูถาม "ตรงนี้ทำงานยังไง"**: "หน้าเว็บเรียก action → action เช็กสิทธิ์และตรวจข้อมูล → action เรียก service ให้บันทึก" แล้วเปิดไฟล์ตามตารางด้านล่าง ในโค้ดมีคอมเมนต์ภาษาไทยเหนือทุกฟังก์ชันสำคัญ ค้นด้วย `Ctrl+Shift+F` พิมพ์ `// สำคัญ`

## 1. ภาพรวม: จำแค่ 3 ชั้นนี้

ทุกฟีเจอร์ในเว็บทำงานแบบเดียวกัน ถ้าครูถามว่า "ตรงนี้ทำงานยังไง" ให้ตอบตาม 3 ชั้นนี้เสมอ

1. **หน้าเว็บ (Page / Component)** — สิ่งที่ผู้ใช้เห็นและกด อยู่ใน `src/app/` กับ `src/features/*/components/`
2. **Server Action (`actions.ts`)** — พอกดปุ่ม จะมาที่นี่ เช็กว่า login แล้วไหม เป็น admin ไหม ข้อมูลถูกไหม แล้วคำนวณสิ่งที่ต้องคำนวณ
3. **Service (`service.ts`)** — อ่าน/เขียนข้อมูลจริง (ผ่าน `src/lib/store.ts`)

ประโยคที่ใช้ตอบได้เกือบทุกคำถาม: **"หน้าเว็บเรียก action → action เช็กสิทธิ์และตรวจข้อมูล → action เรียก service ให้บันทึก"**

### แผนที่โฟลเดอร์

| โฟลเดอร์ / ไฟล์ | เก็บอะไร |
| --- | --- |
| `src/app/` | หน้าเว็บทุกหน้า ชื่อโฟลเดอร์ = URL (เช่น `app/account/page.tsx` = `/account`) |
| `src/app/layout.tsx` | โครงที่ครอบทุกหน้า: แถบเมนูบน (SiteHeader) + footer |
| `src/app/globals.css` | สีและหน้าตาทั้งเว็บ (โทนดำ-ทอง `#F5C518`) |
| `src/features/auth/` | Login, ผู้ใช้ปัจจุบัน, สิทธิ์ admin |
| `src/features/cars/` | ข้อมูลรถ: ค้นหา เพิ่ม แก้ ลบ |
| `src/features/bookings/` | การจอง: จอง ยืนยัน ยกเลิก แก้วันคืน คืนรถ |
| `src/lib/store.ts` | ตัวกลางอ่าน/เขียนข้อมูล (Redis หรือไฟล์ JSON) |
| `data/` | `cars.json`, `bookings.json`, `users.json` |
| `public/images/` | โลโก้ |
| `scripts/pull-data.mjs` | คำสั่ง `npm run pull-data` ดึงข้อมูลจากเว็บลงไฟล์ |

คำศัพท์ที่ควรรู้: **Server Component** = หน้าที่รันบน server ดึงข้อมูลได้ตรง (ส่วนใหญ่ใน `app/`) · **Client Component** = ไฟล์ที่ขึ้นต้นด้วย `"use client"` รันใน browser ใช้ `useState` ทำ popup ปฏิทิน ฟอร์ม · **Server Action** = ฟังก์ชันในไฟล์ที่ขึ้นต้นด้วย `"use server"` หน้าเว็บเรียกได้ตรงเหมือน API โดยไม่ต้องเขียน backend แยก

## 2. หน้าเว็บทุกหน้า

เว็บมี 10 หน้า หน้า admin ทุกหน้าเช็กสิทธิ์ก่อนด้วย `getCurrentUser()` ถ้าไม่ใช่ admin จะถูกส่งกลับ (redirect)

| URL | ไฟล์ | ใครเข้าได้ | ทำอะไร |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` → `CarExplorer` | ทุกคน | ดึงรถด้วย `getCars()` แสดงการ์ดรถ ค้นหา/กรอง กด "เช่ารถ" เปิด popup จอง (`BookingModal`) |
| `/rent/[id]` | `app/rent/[id]/page.tsx` | ทุกคน (จองต้อง login) | หน้ารายละเอียดรถ 1 คัน + ฟอร์มจอง (`BookingForm`) (ไม่มีลิงก์จากหน้าอื่น และฟอร์มนี้ไม่มีช่องเวลา จึงจองจากหน้านี้ไม่ผ่าน จองจริงใช้ popup หน้าแรก) ถ้าไม่ login จะขึ้นให้ไปเข้าสู่ระบบ ไม่เจอรถ → `notFound()` |
| `/login` | `app/login/page.tsx` | ทุกคน | ปุ่ม Login ด้วย Google (`GoogleLoginButton`) |
| `/account` | `app/account/page.tsx` | คนที่ login | รายการจองของตัวเอง (`getUserBookings(email)`) วันที่แบบไทย เช่น 23 ต.ค. 2569 และเวลาอยู่บรรทัดล่าง นับจำนวนทั้งหมด/รอยืนยัน ป้ายสถานะสีเขียว/แดง/เหลือง ไม่ login → ส่งไป `/login` |
| `/contact` | `app/contact/page.tsx` | ทุกคน | ข้อมูลติดต่อ: โทร 080-0696797, อีเมล, ม.แม่โจ้ เชียงใหม่ (หน้านิ่ง ไม่มีโค้ดทำงาน) |
| `/admin/cars` | `app/admin/cars/page.tsx` | admin | ฟอร์มเพิ่มรถ (`CarForm`) + รายการรถ ค้นหา (`AdminCarSearchForm`) ปุ่มแก้ไข และ "เปิดจองใหม่" สำหรับรถที่ปิดอยู่ |
| `/admin/cars/edit/[id]` | `app/admin/cars/edit/[id]/page.tsx` | admin | ฟอร์มแก้ข้อมูลรถ (`Edit`) |
| `/admin/cars/delete/[id]` | `app/admin/cars/delete/[id]/page.tsx` | admin | หน้ายืนยันลบรถ (`Delete`) |
| `/admin/bookings` | `app/admin/bookings/page.tsx` | admin | ตารางการจองทั้งหมด ค้นหาตามชื่อ/อีเมล/รถ/ทะเบียน ปุ่มยืนยัน/ยกเลิก (เฉพาะรอยืนยัน) และปุ่มคืนรถ (เฉพาะยืนยันแล้ว) |
| `/admin/bookings/edit/[id]` | `app/admin/bookings/edit/[id]/page.tsx` | admin | แก้วันคืนรถ (`BookingEdit`) |
| `/api/auth/...` | `app/api/auth/[...nextauth]/route.ts` | ระบบ | API ตัวเดียวของเว็บ ให้ NextAuth รับ callback จาก Google |

ระวัง: หน้า `/admin/bookings` **ไม่มีปุ่มลิงก์ไปหน้าแก้วันคืน** ต้องพิมพ์ URL `/admin/bookings/edit/<รหัสการจอง>` เอง ถ้าจะสาธิตส่วนนี้ให้เตรียม URL ไว้ก่อน (ส่วนหน้าลบรถ มีปุ่ม "ลบ" ในหน้าจัดการรถให้กดเข้าได้)

แถบเมนูเรียงเป็น: **หน้าแรก · ประวัติเช่ารถ · รายการจอง · จัดการรถ · ติดต่อ** (รายการจอง กับ จัดการรถ โชว์เฉพาะ admin) กำหนดใน `SiteHeader.tsx`

## 3. ระบบ Login และสิทธิ์ admin

Login ใช้ **NextAuth (Auth.js v5) กับ Google** ไม่มีการเก็บรหัสผ่านเอง และ admin ตัดสินจาก**อีเมล** `fifanattapol2549@gmail.com` คนเดียว อีเมลอื่นเป็น user

| ฟังก์ชัน / ไฟล์ | อยู่ที่ | ทำอะไร |
| --- | --- | --- |
| `NextAuth({...})` → `handlers, auth, signIn, signOut` | `features/auth/config.ts` | ตั้งค่า Google Provider ด้วย `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` |
| callback `jwt` | `features/auth/config.ts` | ตอน login ถ้าอีเมลตรงกับ admin ใส่ `role = "admin"` ลงใน token ไม่งั้น `"user"` |
| callback `session` | `features/auth/config.ts` | เอา role จาก token ใส่ลง session ให้หน้าเว็บใช้ได้ |
| `GET, POST` | `app/api/auth/[...nextauth]/route.ts` | เปิด endpoint ให้ Google ส่งผล login กลับมา |
| `GoogleLoginButton` | `features/auth/components/GoogleLoginButton.tsx` | ปุ่มที่เรียก `signIn("google")` |
| `getCurrentUser()` | `features/auth/service.ts` | **ฟังก์ชันสำคัญที่สุด** ใช้ทุกหน้า: เรียก `auth()` อ่าน session ได้ `{ id, name, email, role }` หรือ `null` ถ้ายังไม่ login |
| `logoutAction()` | `features/auth/actions.ts` | เรียก `signOut` แล้วกลับหน้าแรก |
| `requireAdmin()` | `features/cars/actions.ts`, `features/bookings/actions.ts` | ใช้ก่อนทุก action ของ admin ถ้าไม่ใช่ admin → redirect ไปหน้า login |
| `SiteHeader` | `features/auth/components/SiteHeader.tsx` | แถบเมนูบน แสดงชื่อผู้ใช้ ปุ่ม Logout และเมนู admin เฉพาะคนที่เป็น admin ไฮไลต์เมนูของหน้าปัจจุบัน |
| `loginUser`, `registerUser` | `features/auth/service.ts` | ระบบ login อีเมล/รหัสผ่านแบบเดิม (เข้ารหัส SHA-256 เก็บใน `users.json` + cookie) **ยังอยู่ในโค้ดแต่หน้าเว็บไม่ได้ใช้แล้ว** |

กันคนแอบเข้าหน้า admin 2 ชั้น: (1) หน้า admin เช็ก `user?.role !== "admin"` แล้ว redirect (2) action ของ admin เรียก `requireAdmin()` อีกรอบ ต่อให้ยิงคำขอตรงๆ ก็ทำไม่ได้

## 4. ระบบรถ (`features/cars/`)

รถ 1 คันมีข้อมูล: `id, name, brand, licensePlate, type, pricePerDay, seats, transmission, fuel, image, available` ตัวสำคัญคือ **`available`** (true = จองได้, false = ถูกจอง/ปิดอยู่)

### Schema ตรวจข้อมูล (`schema.ts`) ใช้ Zod

| ชื่อ | ทำอะไร |
| --- | --- |
| `CarSchema` | กฎของรถ: ชื่อ/ยี่ห้อ/ทะเบียนห้ามว่าง ราคา > 0 ที่นั่ง 1–15 รูปต้องเป็น URL |
| `CarDraftSchema` | เหมือน `CarSchema` แต่ไม่มี `id` (ใช้ตอนเพิ่ม/แก้ เพราะ id ระบบสร้างเอง) |
| `SearchCarSchema` | เงื่อนไขค้นหา: คำค้น ประเภท ราคาสูงสุด |
| `CAR_TYPES` | รายการประเภท: ทั้งหมด, รถเก๋ง, SUV, กระบะ, รถตู้, มอเตอร์ไซค์ |

### Service (`service.ts`) — อ่าน/เขียนข้อมูลรถ

| ฟังก์ชัน | ทำอะไร |
| --- | --- |
| `getCars()` | อ่านรถทั้งหมด แล้วตรวจด้วย `CarSchema` |
| `getCar(id)` | หารถ 1 คันตาม id |
| `searchCars(filters)` | กรองรถตามคำค้น (ชื่อ/ยี่ห้อ/ทะเบียน) ประเภท และราคาสูงสุด (ใช้ในหน้า admin) |
| `createCar(input)` | เพิ่มรถ id ใหม่ = id มากสุด + 1 |
| `updateCar(id, input)` | แก้ข้อมูลรถ ไม่เจอ → error "ไม่พบรถที่ต้องการแก้ไข" |
| `deleteCar(id)` | ลบรถออก (`splice`) |
| `setCarAvailability(id, available)` | เปิด/ปิดการจองรถ ระบบจองเรียกตัวนี้ตอนยืนยันและคืนรถ |

### Action (`actions.ts`) — ทุกตัวเรียก `requireAdmin()` ก่อน

| ฟังก์ชัน | ทำอะไร |
| --- | --- |
| `parseCarDraft(formData)` | แปลงค่าจากฟอร์มเป็นรถ (ตัวเลขด้วย `Number()` checkbox เป็น true/false) แล้วตรวจด้วย `safeParse` |
| `createCarAction` | เพิ่มรถ ถ้าข้อมูลผิดหรือบันทึกไม่ได้ คืนข้อความให้ฟอร์มแสดง popup ถ้าสำเร็จ → `revalidatePath` + กลับ `/admin/cars` |
| `updateCarAction` | แก้รถ ข้อมูลผิด → throw error (ยังเป็นแบบเดิม) |
| `deleteCarAction` | ลบรถ |
| `openCarForBookingAction` | ปุ่ม "เปิดจองใหม่" ตั้ง `available = true` |

`revalidatePath("/")` = บอก Next.js ว่าข้อมูลเปลี่ยนแล้ว ให้หน้านั้นโหลดข้อมูลใหม่

### Component (`components/`)

| Component | ทำอะไร |
| --- | --- |
| `CarExplorer` | หน้าแรกทั้งหน้า (client): กรองรถใน browser ด้วย `useMemo` + `filter` 3 ชั้น (คำค้น → ประเภท → ราคา) กด "เช่ารถ" เปิด `BookingModal` ถ้ารถไม่ว่างขึ้น popup แจ้ง และ `router.refresh()` ดึงสถานะรถใหม่ทุกครั้งที่กลับมาเปิดแท็บเว็บ (`focus`, `visibilitychange`) การ์ดค่อยๆ โผล่ตอนเลื่อนด้วย `IntersectionObserver` |
| `CarSearchForm` | ฟอร์มค้นหาหน้าแรก ใช้ React Hook Form + `zodResolver(SearchCarSchema)` |
| `AdminCarSearchForm` | ค้นหาในหน้า admin ใส่คำค้นลง URL (`?q=...&type=...`) ด้วย `router.push` แล้วหน้า server เรียก `searchCars` |
| `CarForm` | ฟอร์มเพิ่มรถ (client) ส่งผ่าน `useTransition` ข้อมูลผิด → popup "เพิ่มรถไม่สำเร็จ" ค่าที่กรอกไม่หาย |
| `Edit` | ฟอร์มแก้รถ ใช้ `updateCarAction.bind(null, car.id)` (ผูก id รถไว้กับ action) |
| `Delete` | หน้ายืนยันลบ ใช้ `deleteCarAction.bind(null, carId)` |

## 5. ระบบการจอง (`features/bookings/`)

การจอง 1 รายการเก็บ: `id, carId, userId, userName, userEmail, carName, licensePlate, startDate, endDate, startTime, endTime, days, total, status` (`id` = `Date.now()` เวลาตอนจอง) สถานะมี 4 แบบเปลี่ยนตามลำดับนี้เท่านั้น

1. **รอยืนยัน** — ทุกการจองเริ่มที่นี่
2. **ยืนยันแล้ว** (admin กดยืนยัน → รถถูกปิดจอง) หรือ **ยกเลิก** (admin กดยกเลิก → จบ)
3. **คืนรถแล้ว** (จาก "ยืนยันแล้ว" เท่านั้น → รถเปิดจองได้อีก)

### Service (`service.ts`)

| ฟังก์ชัน | ทำอะไร |
| --- | --- |
| `BookingSchema` | กฎของการจอง และกำหนดสถานะ 4 แบบด้วย `z.enum` |
| `getBookings()` | อ่านการจองทั้งหมด |
| `getUserBookings(email)` | การจองของคนนั้น เทียบอีเมลแบบไม่สนตัวพิมพ์เล็ก/ใหญ่ (หน้า `/account`) |
| `getBooking(id)` | หาการจอง 1 รายการ |
| `createBooking(data)` | สร้างการจอง สถานะ "รอยืนยัน" ใส่ไว้บนสุด (`unshift`) |
| `updateBooking(id, endDate)` | แก้วันคืน: หาราคาต่อวันจาก `total ÷ จำนวนวันเดิม` แล้วคิด `days` กับ `total` ใหม่ วันคืนต้องหลังวันรับ |
| `updateBookingStatus(id, status)` | เปลี่ยนสถานะ |

### Action (`actions.ts`)

| ฟังก์ชัน | ใครใช้ | ทำอะไรทีละขั้น |
| --- | --- | --- |
| `createBookingAction` | ลูกค้า | 1) ยังไม่ login → ส่งไป `/login` 2) เช็กกรอกครบ 3) วันเวลาคืนต้องหลังวันรับ 4) `days = Math.ceil((คืน − รับ) ÷ 1 วัน)` เศษปัดขึ้น 5) หารถ ไม่เจอ/ไม่ว่าง → แจ้ง 6) `total = days × pricePerDay` แล้ว `createBooking` ผิดตรงไหนคืน `{ success: false, message }` ให้ popup |
| `updateBookingStatusAction` | admin | ใช้ได้เฉพาะรายการ "รอยืนยัน" เปลี่ยนเป็น ยืนยันแล้ว หรือ ยกเลิก ถ้ายืนยัน → `setCarAvailability(carId, false)` ปิดรถ ห้ามใช้ตัวนี้เปลี่ยนเป็น "คืนรถแล้ว" |
| `returnCarAction` | admin | ใช้ได้เฉพาะ "ยืนยันแล้ว" เปลี่ยนเป็น "คืนรถแล้ว" (ไม่ลบประวัติ) แล้วเช็กว่ารถคันนี้มีการจองยืนยันอื่นค้างไหม (`some`) ถ้าไม่มี → `setCarAvailability(carId, true)` เปิดรถ |
| `updateBookingAction` | admin | รับ `endDate` จากฟอร์ม แล้วเรียก `updateBooking` |
| `requireAdmin`, `revalidateBookingPages` | ภายใน | เช็กสิทธิ์ / สั่งรีเฟรชหน้าที่เกี่ยวกับการจอง |

### Component (`components/`)

| Component | ทำอะไร |
| --- | --- |
| `BookingModal` | popup จองบนหน้าแรก มีปฏิทินเลือกวัน เรียก `createBookingAction` |
| `BookingForm` | ฟอร์มจองในหน้า `/rent/[id]` ปฏิทินทำเอง (`getDaysInMonth`, `getFirstDayOfMonth`) เช็กวันก่อนส่ง (`handleSubmit`) แสดง popup เมื่อจองไม่ผ่าน |
| `BookingEdit` | ฟอร์มแก้วันคืน (admin) ช่องอื่นอ่านอย่างเดียว แก้ได้แค่วันคืน (`min` = วันรับ) |
| `ReturnCarButton` | ปุ่มคืนรถ ถามยืนยันด้วย `window.confirm` ก่อนเรียก `returnCarAction` |

หมายเหตุ: มีไฟล์ `app/admin/bookings/actions.ts` ที่ซ้ำกับ `features/bookings/actions.ts` แต่**ไม่มีหน้าไหนเรียกใช้** ถ้าครูถาม ตอบว่าเป็นโค้ดเก่าก่อนย้ายมารวมที่ features

## 6. การเก็บข้อมูล (`src/lib/store.ts`)

ข้อมูลมี 3 ชุด: `cars`, `bookings`, `users` ทุก service อ่าน/เขียนผ่าน 2 ฟังก์ชันนี้เท่านั้น

| ฟังก์ชัน | บน Vercel (มีค่า `KV_REST_API_URL`) | ในเครื่อง (`npm run dev`) |
| --- | --- | --- |
| `readCollection(name)` | อ่านจาก Redis key `car-rental:<name>` ถ้ายังว่าง อ่านจาก `data/<name>.json` แทน | อ่าน `data/<name>.json` |
| `writeCollection(name, items)` | เขียนลง Redis | เขียนทับ `data/<name>.json` |

**ทำไมต้องมี Redis:** บน Vercel ไฟล์ในโปรเจกต์อ่านได้อย่างเดียว (read-only) เขียน JSON ไม่ได้ จึงใช้ Upstash Redis เก็บข้อมูลแทน โดยเก็บเป็น JSON ก้อนเดิม โค้ดส่วนอื่นไม่ต้องแก้

**อ่านทั้งก้อน เขียนทั้งก้อน:** ทุกการแก้ไข = อ่าน array ทั้งหมด → แก้ใน array → เขียนทั้ง array กลับ ง่ายแต่ไม่เหมาะกับคนใช้พร้อมกันเยอะๆ (คนหนึ่งอาจเขียนทับอีกคน)

**ดึงข้อมูลจากเว็บลงไฟล์:** `npm run pull-data` (ไฟล์ `scripts/pull-data.mjs`) อ่านค่า Redis จาก `.env.redis` แล้วเขียนทับ `data/*.json`

**ค่า Environment ที่ต้องมี:** `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (login) · `KV_REST_API_URL`, `KV_REST_API_TOKEN` (Redis บน Vercel ตั้งให้อัตโนมัติ) — ไม่เคยอยู่ใน GitHub เพราะ `.gitignore` กัน `.env*` ไว้

## 7. คำถามที่ครูน่าจะถาม

| คำถาม | ตอบสั้นๆ | เปิดไฟล์ไหนโชว์ |
| --- | --- | --- |
| คำนวณราคาตรงไหน | ใน `createBookingAction`: จำนวนวัน = เวลาคืน − เวลารับ ÷ 1 วัน ปัดขึ้น (`Math.ceil`) แล้ว × ราคาต่อวัน คำนวณฝั่ง server ลูกค้าแก้ราคาเองไม่ได้ | `features/bookings/actions.ts` |
| กันจองซ้ำยังไง | admin ยืนยัน → `setCarAvailability(false)` ปิดรถ และ `createBookingAction` ไม่ให้จองรถที่ `available` เป็น false หน้าแรกก็ปิดปุ่ม "รถถูกจองแล้ว" | `features/bookings/actions.ts` |
| รู้ได้ไงว่าใครเป็น admin | callback `jwt` เทียบอีเมล Google กับอีเมล admin แล้วใส่ role ไว้ใน session | `features/auth/config.ts` |
| คนทั่วไปพิมพ์ URL เข้าหน้า admin ได้ไหม | ไม่ได้ หน้าเช็ก role แล้ว redirect และ action เช็กซ้ำด้วย `requireAdmin()` | `app/admin/cars/page.tsx` |
| ตรวจข้อมูลที่กรอกยังไง | 2 ชั้น: ฟอร์ม HTML (`required`, `min`, `max`, `type="url"`) และ server ด้วย Zod (`CarSchema`, `BookingSchema`) | `features/cars/schema.ts` |
| เก็บข้อมูลที่ไหน | ในเครื่อง = ไฟล์ JSON ใน `data/` บน Vercel = Upstash Redis เพราะ Vercel เขียนไฟล์ไม่ได้ | `src/lib/store.ts` |
| ทำไมไม่ใช้ฐานข้อมูล SQL | เริ่มจาก JSON เพราะง่ายและเห็นข้อมูลชัด ตอน deploy เจอปัญหาเขียนไฟล์ไม่ได้ จึงย้ายไป Redis ถ้าใช้จริงควรย้ายไป Postgres | `src/lib/store.ts` |
| Server Action คืออะไร | ฟังก์ชันในไฟล์ `"use server"` ที่ฟอร์มเรียกได้ตรง รันบน server แทนการเขียน API เอง | `features/cars/actions.ts` |
| `.bind(null, id)` คืออะไร | ผูก id ไว้กับ action ล่วงหน้า พอกดปุ่ม action จะรู้ว่าทำกับรถ/การจองตัวไหน | `features/cars/components/Edit.tsx` |
| `revalidatePath` ทำอะไร | สั่งให้หน้านั้นโหลดข้อมูลใหม่หลังแก้ข้อมูล ไม่งั้นอาจเห็นข้อมูลเก่าค้าง | `features/bookings/actions.ts` |
| คืนรถแล้วรถกลับมาได้ยังไง | `returnCarAction` เปลี่ยนสถานะ แล้วเช็กว่าไม่มีการจองยืนยันอื่นค้าง จึงเปิดรถ | `features/bookings/actions.ts` |
| ใช้ Library อะไรบ้าง | Next.js 16, React 19, TypeScript, NextAuth v5, Zod, React Hook Form, Tailwind CSS 4, @upstash/redis | `package.json` |
| จุดอ่อนของระบบ | ไม่มีชำระเงิน · admin ผูกกับอีเมลในโค้ด · เก็บข้อมูลทั้งก้อน คนกดพร้อมกันอาจชนกัน · ปิดรถทั้งคันแทนการเช็กช่วงวันที่ทับกัน | — |

### คำถามเพิ่มเติม (สิ่งที่เพิ่งแก้ล่าสุด)

| คำถาม | ตอบสั้นๆ | เปิดไฟล์ไหนโชว์ |
| --- | --- | --- |
| แสดงวันที่แบบไทยยังไง | `formatBookingDate` ใช้ `toLocaleDateString("th-TH")` แปลง 2026-10-23 เป็น 23 ต.ค. 2569 (พ.ศ. อัตโนมัติ) ใส่เวลา 12:00 กันวันเลื่อนเพราะ timezone | `app/account/page.tsx` |
| เก็บเวลารับ-คืนไหม | เก็บ `startTime`, `endTime` ตอนจอง แสดงเป็นบรรทัดล่างของวันที่ รายการเก่าก่อนเพิ่มฟีเจอร์นี้จะมีแค่วันที่ | `features/bookings/service.ts` |
| เพิ่มรถผิดแล้วเกิดอะไร | action คืนข้อความ `{ success: false, message }` แทนการ throw error ฟอร์มแสดง popup และค่าที่กรอกไม่หาย | `features/cars/actions.ts`, `CarForm.tsx` |
| เมนู admin ซ่อนยังไง | `SiteHeader` เช็ก `user?.role === "admin"` ก่อนแสดงเมนู รายการจอง / จัดการรถ | `features/auth/components/SiteHeader.tsx` |
| หน้าแรกรู้ได้ไงว่ารถถูกจองแล้ว | รถมี `available` ถ้า false ปุ่มเปลี่ยนเป็น "รถถูกจองแล้ว" และ `router.refresh()` ดึงสถานะใหม่ทุกครั้งที่กลับมาเปิดแท็บ | `features/cars/components/CarExplorer.tsx` |
| ล้างข้อมูลบนเว็บยังไง | ใน Upstash CLI สั่ง `SET car-rental:bookings "[]"` (ห้าม DEL เพราะจะดึงข้อมูลเก่าจากไฟล์กลับมา) | `src/lib/store.ts` |

**เทคนิคตอบคำถามที่ไม่แน่ใจ:** บอกว่าอยู่ชั้นไหนก่อน (หน้าเว็บ / action / service) แล้วเปิดไฟล์ตามตารางข้างบน ใน VS Code กด `Ctrl+P` พิมพ์ชื่อไฟล์เปิดได้เร็ว และ `Ctrl+Shift+F` ค้นชื่อฟังก์ชันทั้งโปรเจกต์
