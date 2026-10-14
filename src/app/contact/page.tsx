import Link from "next/link";

// หน้า /contact: ข้อมูลติดต่อร้าน (หน้านิ่ง ไม่มีการทำงานกับข้อมูล)
export default function ContactPage() {
  return (
    <main className="container contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <span className="contact-eyebrow">LANLODE • CUSTOMER CARE</span>
          <h1>ติดต่อเรา</h1>
          <p>ยินดีให้คำแนะนำและช่วยเหลือเรื่องการเช่ารถ</p>
        </div>

        <Link
          href="/"
          className="contact-back-link"
        >
          <span aria-hidden="true">←</span>
          กลับหน้าหลัก
        </Link>
      </section>

      <section className="contact-section" aria-labelledby="contact-heading">
        <div className="contact-section-heading">
          <div>
            <span>เราพร้อมช่วยเหลือคุณ</span>
            <h2 id="contact-heading">ช่องทางการติดต่อ</h2>
          </div>
          <p>เลือกช่องทางที่สะดวก แล้วติดต่อเราได้เลย</p>
        </div>

        <div className="contact-list">
          <article className="contact-card">
            <span className="contact-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7.2 3.5h2.6l1.3 4-1.8 1.8a15.4 15.4 0 0 0 5.4 5.4l1.8-1.8 4 1.3v2.6a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 5.2 5.7a2 2 0 0 1 2-2.2Z" />
              </svg>
            </span>
            <div>
              <span className="contact-card-label">โทรหาเรา</span>
              <h3>โทรศัพท์</h3>
              <a href="tel:0800696797">080-0696797</a>
            </div>
          </article>

          <article className="contact-card">
            <span className="contact-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="5" width="17" height="14" rx="2" />
                <path d="m4.5 7 7.5 6 7.5-6" />
              </svg>
            </span>
            <div>
              <span className="contact-card-label">ส่งข้อความถึงเรา</span>
              <h3>อีเมล</h3>
              <a href="mailto:LANLODECNX@gmail.com">LANLODECNX@gmail.com</a>
            </div>
          </article>

          <article className="contact-card">
            <span className="contact-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
            </span>
            <div>
              <span className="contact-card-label">แวะมาหาเรา</span>
              <h3>ที่อยู่</h3>
              <p>มหาวิทยาลัยแม่โจ้ จังหวัดเชียงใหม่</p>
            </div>
          </article>

          <article className="contact-card">
            <span className="contact-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3.2 2" />
              </svg>
            </span>
            <div>
              <span className="contact-card-label">เวลาที่ให้บริการ</span>
              <h3>เวลาทำการ</h3>
              <p>จันทร์ - ศุกร์ <span className="contact-hours">08:00 - 17:00 น.</span></p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}32