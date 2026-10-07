import { createCarAction, updateCarAction } from "@/features/cars/actions";
import type { Car } from "@/features/cars/schema";
const types=["รถเก๋ง","SUV","กระบะ","รถตู้"];
export default function CarForm({car}:{car?:Car}){
 const action=car?updateCarAction.bind(null,car.id):createCarAction;
 return <form action={action} className="admin-form">
  <div className="two-col"><div><label>ชื่อรถ</label><input name="name" defaultValue={car?.name} required/></div><div><label>ยี่ห้อ</label><input name="brand" defaultValue={car?.brand} required/></div></div>
  <div className="two-col"><div><label>ประเภทรถ</label><select name="type" defaultValue={car?.type||types[0]}>{types.map(x=><option key={x}>{x}</option>)}</select></div><div><label>ราคา / วัน</label><input name="pricePerDay" type="number" min="1" defaultValue={car?.pricePerDay} required/></div></div>
  <div className="two-col"><div><label>จำนวนที่นั่ง</label><input name="seats" type="number" min="1" defaultValue={car?.seats||5} required/></div><div><label>เกียร์</label><select name="transmission" defaultValue={car?.transmission||"ออโต้"}><option>ออโต้</option><option>ธรรมดา</option></select></div></div>
  <div className="two-col"><div><label>เชื้อเพลิง</label><select name="fuel" defaultValue={car?.fuel||"เบนซิน"}><option>เบนซิน</option><option>ดีเซล</option><option>ไฟฟ้า</option><option>ไฮบริด</option></select></div><div><label>URL รูปรถ</label><input name="image" defaultValue={car?.image} required/></div></div>
  <label className="check"><input name="available" type="checkbox" defaultChecked={car?.available??true}/> เปิดให้เช่า</label>
  <button className="primary-button">{car?"บันทึกการแก้ไข":"เพิ่มรถเข้าระบบ"}</button>
 </form>
}