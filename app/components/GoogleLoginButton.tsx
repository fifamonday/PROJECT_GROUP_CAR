"use client";

import { signIn } from "next-auth/react";

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