// หน้าแรก ดึงข้อมูลรถทั้งหมด
import CarExplorer from "@/features/cars/components/CarExplorer";
import { getCars } from "@/features/cars/service";
// หน้าแรก (/): ดึงรถทั้งหมดจาก server แล้วส่งให้ CarExplorer แสดงผล
export default async function Home(){ const cars=await getCars(); return <CarExplorer initialCars={cars}/>; }