import {createBookingAction} from "../actions/bookings";
import type {Car} from "../lib/car-schema";
export default function BookingForm({car}:{car:Car}){
 return <form action={createBookingAction} className="booking-form">
  <input type="hidden" name="carId" value={car.id}/>
  <label>วันที่รับรถ<input name="startDate" type="date" required/></label>
  <label>วันที่คืนรถ<input name="endDate" type="date" required/></label>
  <button className="primary-button">ยืนยันการเช่ารถ</button>
 </form>
}