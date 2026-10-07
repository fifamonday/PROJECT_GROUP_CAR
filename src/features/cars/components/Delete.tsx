import Link from "next/link";
import { deleteCarAction } from "@/features/cars/actions";

type DeleteProps = {
  carId: number;
  carName: string;
};

export default function Delete({
  carId,
  carName,
}: DeleteProps) {
  return (
    <div className="panel">
      <h2>ยืนยันการลบรถ</h2>

      <p>
        คุณต้องการลบรถ{" "}
        <strong>{carName}</strong>{" "}
        ใช่หรือไม่?
      </p>

      <p className="muted">
        เมื่อลบแล้ว ข้อมูลรถคันนี้จะถูกนำออกจากระบบ
      </p>

      <div className="admin-actions">
        <form
          action={deleteCarAction.bind(null, carId)}
        >
          <button
            type="submit"
            className="danger-button"
          >
            ยืนยันลบรถ
          </button>
        </form>

        <Link
          href="/admin/cars"
          className="secondary-button"
        >
          ยกเลิก
        </Link>
      </div>
    </div>
  );
}