"use server";

import { auth } from "@/features/auth/config";
import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
};

const USERS_FILE = path.join(
  process.cwd(),
  "data",
  "users.json"
);

/* =========================
   อ่าน users.json
========================= */

async function readUsers(): Promise<User[]> {
  try {
    const text = await fs.readFile(
      USERS_FILE,
      "utf8"
    );

    return JSON.parse(text);
  } catch {
    return [];
  }
}

/* =========================
   เขียน users.json
========================= */

async function writeUsers(users: User[]) {
  await fs.writeFile(
    USERS_FILE,
    JSON.stringify(users, null, 2),
    "utf8"
  );
}

/* =========================
   เข้ารหัส Password
========================= */

function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

/* =========================
   Login แบบเดิม
========================= */

export async function loginUser(
  email: string,
  password: string
) {
  const users = await readUsers();

  const passwordHash = hashPassword(password);

  const user = users.find(
    (u) =>
      u.email.toLowerCase() ===
        email.toLowerCase() &&
      u.passwordHash === passwordHash
  );

  if (!user) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set(
    "car_rental_user",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production",
      path: "/",
    }
  );

  return true;
}

/* =========================
   สมัครสมาชิกแบบเดิม
========================= */

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const users = await readUsers();

  const exists = users.some(
    (u) =>
      u.email.toLowerCase() ===
      email.toLowerCase()
  );

  if (exists) {
    return {
      ok: false,
      message: "อีเมลนี้มีผู้ใช้งานแล้ว",
    };
  }

  const newUser: User = {
    id: Date.now(),
    name,
    email,
    passwordHash: hashPassword(password),
    role: "user",
  };

  users.push(newUser);

  await writeUsers(users);

  return {
    ok: true,
    message: "สมัครสมาชิกสำเร็จ",
  };
}

/* =========================
   Logout แบบ Cookie เดิม
========================= */

export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.delete("car_rental_user");
}

/* =========================
   ดึง User ปัจจุบัน
========================= */

export async function getCurrentUser() {
  const session = await auth();

  /* =========================
     Google Login
  ========================= */

  if (session?.user?.email) {
    const email = session.user.email;

    const role =
      email.toLowerCase() ===
      "fifanattapol2549@gmail.com"
        ? "admin"
        : "user";

    return {
      id: 0,
      name: session.user.name ?? email,
      email: email,
      role: role as "admin" | "user",
    };
  }

  /* =========================
     Cookie Login แบบเดิม
  ========================= */

  const cookieStore = await cookies();

  const cookie = cookieStore.get(
    "car_rental_user"
  );

  if (!cookie?.value) {
    return null;
  }

  try {
    return JSON.parse(cookie.value) as {
      id: number;
      name: string;
      email: string;
      role: "admin" | "user";
    };
  } catch {
    return null;
  }
}