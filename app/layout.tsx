import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from "./lib/auth";
import { logoutAction } from "./actions/auth";
import GoogleLoginButton from "./components/GoogleLoginButton";

export const metadata = {
  title: "nongkin shop",
  description: "ระบบเช่ารถออนไลน์",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="th">
      <body>
        <header className="navbar">
          <Link href="/" className="brand">
            nongkin shop
          </Link>

          <nav>
            <Link href="/">รถเช่า</Link>

            {user && (
              <Link href="/account">
                รายการเช่า
              </Link>
            )}

            {user?.role === "admin" && (
              <Link href="/admin/cars">
                จัดการรถ
              </Link>
            )}

            {user ? (
              <form
                action={logoutAction}
                className="inline-form"
              >
                <span className="user-label">
                  สวัสดี {user.name}
                </span>

                <button
                  type="submit"
                  className="nav-button"
                >
                  ออกจากระบบ
                </button>
              </form>
            ) : (
              <GoogleLoginButton />
            )}
          </nav>
        </header>

        {children}

        <footer>
          Car Rent 324 • ระบบเช่ารถสำหรับโครงงาน
        </footer>
      </body>
    </html>
  );
}