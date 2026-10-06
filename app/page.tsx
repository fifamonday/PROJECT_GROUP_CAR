import CarExplorer from "./components/CarExplorer";
import { getCars } from "./lib/cars";
export default async function Home(){ const cars=await getCars(); return <CarExplorer initialCars={cars}/>; }