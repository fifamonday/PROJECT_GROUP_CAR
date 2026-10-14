import "server-only";

import fs from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";

/* =========================================================
   STORAGE
   บน Vercel เขียนไฟล์ไม่ได้ จึงเก็บข้อมูลใน Upstash Redis
   ถ้าไม่ได้ตั้งค่า Redis (รันในเครื่อง) จะใช้ไฟล์ใน data/ แทน
========================================================= */

const url =
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL;

const token =
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  url && token ? new Redis({ url, token }) : null;

function dataFile(name: string) {
  return path.join(process.cwd(), "data", `${name}.json`);
}

function redisKey(name: string) {
  return `car-rental:${name}`;
}

export async function readCollection(
  name: string
): Promise<unknown> {
  if (redis) {
    const stored = await redis.get(redisKey(name));

    if (stored !== null) {
      return stored;
    }
  }

  // ยังไม่มีข้อมูลใน Redis: เริ่มจากไฟล์ JSON ในโปรเจกต์
  const text = await fs.readFile(dataFile(name), "utf8");

  return JSON.parse(text);
}

export async function writeCollection(
  name: string,
  items: unknown
): Promise<void> {
  if (redis) {
    await redis.set(redisKey(name), items);
    return;
  }

  await fs.writeFile(
    dataFile(name),
    JSON.stringify(items, null, 2),
    "utf8"
  );
}
