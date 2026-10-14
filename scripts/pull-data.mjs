// ดึงข้อมูลล่าสุดจาก Redis (เว็บบน Vercel) มาเขียนทับไฟล์ใน data/
// ใช้: npm run pull-data  (ต้องมีไฟล์ .env.redis ที่มี KV_REST_API_URL และ KV_REST_API_TOKEN)

import fs from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    "ไม่พบ KV_REST_API_URL / KV_REST_API_TOKEN ในไฟล์ .env.redis"
  );
  process.exit(1);
}

const redis = new Redis({ url, token });

for (const name of ["cars", "bookings", "users"]) {
  const items = await redis.get(`car-rental:${name}`);

  if (items === null) {
    console.log(`- ${name}: ยังไม่มีข้อมูลบน Redis (ข้าม)`);
    continue;
  }

  await fs.writeFile(
    path.join(process.cwd(), "data", `${name}.json`),
    JSON.stringify(items, null, 2) + "\n",
    "utf8"
  );

  console.log(`✓ ${name}: ${items.length} รายการ → data/${name}.json`);
}
