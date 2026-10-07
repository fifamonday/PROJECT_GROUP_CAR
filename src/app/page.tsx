import CarExplorer from "@/features/cars/components/CarExplorer";
import { getCars } from "@/features/cars/service";
export default async function Home(){ const cars=await getCars(); return <CarExplorer initialCars={cars}/>; }