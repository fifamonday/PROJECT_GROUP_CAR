import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="container">
      <div className="section-title">
        <div>
          <h1>ติดต่อเรา</h1>
          <p>ติดต่อสอบถามข้อมูลเกี่ยวกับการเช่ารถ</p>
        </div>

        <Link
          href="/"
          className="secondary-button"
        >
          กลับหน้าหลัก
        </Link>
      </div>

      <section className="panel">
        <h2>ช่องทางการติดต่อ</h2>

        <div className="contact-list">
          <div>
            <strong>โทรศัพท์</strong>
            <p>080-0696797</p>
          </div>

          <div>
            <strong>อีเมล</strong>
            <p>@gmail.com</p>
          </div>

          <div>
            <strong>ที่อยู่</strong>
            <p>มหาวิทยาลัยแม่โจ้ จังหวัดเชียงใหม่</p>
          </div>

          <div>
            <strong>เวลาทำการ</strong>
            <p>จันทร์ - ศุกร์ เวลา 08:00 - 17:00 น.</p>
          </div>
        </div>
      </section>
    </main>
  );
}32