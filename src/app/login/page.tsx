import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

// หน้า /login: มีปุ่มเข้าสู่ระบบด้วย Google
export default function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>เข้าสู่ระบบ</h1>
        <p>เข้าสู่ระบบเพื่อเช่ารถและดูรายการจอง</p>

        <GoogleLoginButton />
      </div>
    </main>
  );
}