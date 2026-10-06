import GoogleLoginButton from "../components/GoogleLoginButton";

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