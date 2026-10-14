"use client";

import { signIn } from "next-auth/react";

// ปุ่ม Login: เรียก signIn("google")
export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      className="nav-button"
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
    >
      เข้าสู่ระบบด้วย Google
    </button>
  );
}