"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleLoginButton from "./GoogleLoginButton";

type SiteHeaderProps = {
  user: {
    name?: string | null;
    role?: string | null;
  } | null;

  logoutAction: (
    formData: FormData
  ) => void | Promise<void>;
};

export default function SiteHeader({
  user,
  logoutAction,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="luxury-site-header">

      {/* =========================
          แถวบน
      ========================= */}

      <div className="luxury-topbar">

        {/* โลโก้ */}

        <Link
          href="/"
          className="luxury-logo"
          aria-label="LANLODE.cnx หน้าหลัก"
        >
          <img
            src="/images/lanlode-logo.png"
            alt="LANLODE.cnx"
          />
        </Link>


        {/* ด้านขวา */}

        <div className="luxury-actions">

          <a
            href="#available-cars"
            className="retailer-link"
          >
            FIND A RETAILER <span>→</span>
          </a>


          {user ? (

            <form
              action={logoutAction}
              className="luxury-account-form"
            >

              <span>
                สวัสดี {user.name}
              </span>

              <button type="submit">
                ออกจากระบบ
              </button>

            </form>

          ) : (

            <GoogleLoginButton />

          )}

        </div>

      </div>


      {/* =========================
          แถบเมนู
      ========================= */}

      <div className="luxury-modelbar">

        <nav className="luxury-model-nav">

          {/* หน้าแรก */}

          <Link
            href="/"
            className={isActive("/") ? "active" : undefined}
            aria-current={isActive("/") ? "page" : undefined}
          >
            หน้าแรก
          </Link>


          {/* ประวัติการเช่ารถ */}

          <Link
            href="/account"
            className={isActive("/account") ? "active" : undefined}
            aria-current={isActive("/account") ? "page" : undefined}
          >
            ประวัติเช่ารถ
          </Link>


          {/* เมนูสำหรับ Admin */}

          {user?.role === "admin" && (
            <>

              {/* จัดการรถ */}

              <Link
                href="/admin/cars"
                className={isActive("/admin/cars") ? "active" : undefined}
                aria-current={isActive("/admin/cars") ? "page" : undefined}
              >
                จัดการรถ
              </Link>


              {/* รายการจอง */}

              <Link
                href="/admin/bookings"
                className={isActive("/admin/bookings") ? "active" : undefined}
                aria-current={isActive("/admin/bookings") ? "page" : undefined}
              >
                รายการจอง
              </Link>

            </>
          )}


          {/* ติดต่อ */}

          <Link
            href="/contact"
            className={isActive("/contact") ? "active" : undefined}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            ติดต่อ
          </Link>

        </nav>

      </div>

    </header>
  );
}