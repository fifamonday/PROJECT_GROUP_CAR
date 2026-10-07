import "./globals.css";

import { getCurrentUser } from "@/features/auth/service";
import { logoutAction } from "@/features/auth/actions";
import SiteHeader from "@/features/auth/components/SiteHeader";

export const metadata = {
  title: "LANLODE.CNX",
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

        <SiteHeader
          user={user}
          logoutAction={logoutAction}
        />

        <main className="site-main">
          {children}
        </main>

        <footer>
          LANLODE.CNX • รถที่ใช่สำหรับคุณ
        </footer>

      </body>
    </html>
  );
}