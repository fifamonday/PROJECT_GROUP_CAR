"use server";

import { signOut } from "@/features/auth/config";

// ออกจากระบบ แล้วกลับหน้าแรก
export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}