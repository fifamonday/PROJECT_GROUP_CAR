"use server";

import { signOut } from "@/features/auth/config";

export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}