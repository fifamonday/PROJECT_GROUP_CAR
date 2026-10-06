import "server-only";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";

export type UserRole = "admin" | "user";
export type User = { id:number; name:string; email:string; passwordHash:string; role:UserRole };

const filePath = path.join(process.cwd(), "data/users.json");
const COOKIE = "car_rental_session";
const SECRET = process.env.AUTH_SECRET || "car-rental-demo-secret";

async function readUsers(): Promise<User[]> {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}
async function writeUsers(users: User[]) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");
}
export function hashPassword(password:string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
function sign(value:string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}
function createToken(user:User) {
  const value = `${user.id}|${user.email}|${user.role}`;
  return `${Buffer.from(value).toString("base64url")}.${sign(value)}`;
}
async function getTokenUser(token:string|undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  try {
    const value = Buffer.from(encoded, "base64url").toString("utf8");
    if (sign(value) !== signature) return null;
    const [id, email, role] = value.split("|");
    const users = await readUsers();
    return users.find(u => u.id === Number(id) && u.email === email && u.role === role) ?? null;
  } catch { return null; }
}
export async function getCurrentUser() {
  const store = await cookies();
  return getTokenUser(store.get(COOKIE)?.value);
}
export async function loginUser(email:string,password:string) {
  const users = await readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashPassword(password));
  if (!user) return false;
  const store = await cookies();
  store.set(COOKIE, createToken(user), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*7 });
  return true;
}
export async function logoutUser() {
  const store = await cookies();
  store.delete(COOKIE);
}
export async function registerUser(name:string,email:string,password:string) {
  const users = await readUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { ok:false, message:"อีเมลนี้มีสมาชิกแล้ว" };
  const user:User = { id: Date.now(), name, email:email.toLowerCase(), passwordHash:hashPassword(password), role:"user" };
  users.push(user);
  await writeUsers(users);
  const store = await cookies();
  store.set(COOKIE, createToken(user), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*7 });
  return { ok:true, message:"สมัครสมาชิกสำเร็จ" };
}
