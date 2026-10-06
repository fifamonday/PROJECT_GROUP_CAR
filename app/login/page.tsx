import Link from "next/link";
import { loginAction } from "../actions/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const p = await searchParams;

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>เข้าสู่ระบบ</h1>
        <p>เข้าสู่ระบบเพื่อเช่ารถและดูรายการจอง</p>

        {p.error && (
          <div className="error-box">{p.error}</div>
        )}

        <form action={loginAction} className="auth-form">
          <label>
            อีเมล
            <input
              name="email"
              type="email"
              placeholder="อีเมล"
              required
            />
          </label>

          <label>
            รหัสผ่าน
            <input
              name="password"
              type="password"
              placeholder="รหัสผ่าน"
              required
            />
          </label>

          <button type="submit" className="primary-button">
            เข้าสู่ระบบ
          </button>
        </form>

        <div style={{ margin: "16px 0", textAlign: "center" }}>
          หรือ
        </div>

        <GoogleLoginButton />

        <p>
          ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
        </p>

        <div className="demo-box">
          <strong>บัญชีสำหรับทดสอบ</strong>
          <br />
          Email: fifanattapol2549@gmail.com
          <br />
          Password: 123
          <br />
          สิทธิ์: Admin
        </div>
      </div>
    </main>
  );
}
