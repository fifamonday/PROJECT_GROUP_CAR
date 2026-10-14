import "server-only";

import fs from "fs/promises";
import path from "path";

import {
  CarSchema,
  CarDraftSchema,
  CAR_TYPES,
  defaultSearch,
  SearchCarSchema,
} from "@/features/cars/schema";

import type {
  Car,
  CarDraft,
  SearchCar,
} from "@/features/cars/schema";

export { CAR_TYPES };

const filePath = path.join(
  process.cwd(),
  "data",
  "cars.json"
);

export async function getCars(): Promise<Car[]> {
  const text = await fs.readFile(filePath, "utf8");
  const data: unknown = JSON.parse(text);

  return CarSchema.array().parse(data);
}

export async function getCar(
  id: number
): Promise<Car | undefined> {
  const cars = await getCars();

  return cars.find((car) => car.id === id);
}

async function saveCars(cars: Car[]): Promise<void> {
  await fs.writeFile(
    filePath,
    JSON.stringify(cars, null, 2),
    "utf8"
  );
}

export async function searchCars(
  filters: Partial<SearchCar> = {}
): Promise<Car[]> {
  const parsed = SearchCarSchema.safeParse({
    ...defaultSearch,
    ...filters,
  });

  if (!parsed.success) {
    throw new Error("เงื่อนไขค้นหารถไม่ถูกต้อง");
  }

  const { q, type, maxPrice } = parsed.data;
  const cars = await getCars();
  const keyword = q.toLocaleLowerCase().trim();

  return cars.filter((car) => {
    const matchesKeyword =
      !keyword ||
      car.name.toLocaleLowerCase().includes(keyword) ||
      car.brand.toLocaleLowerCase().includes(keyword) ||
      car.licensePlate.toLocaleLowerCase().includes(keyword);

    const matchesType =
      !type ||
      type === "ทั้งหมด" ||
      car.type === type;

    const matchesPrice =
      maxPrice === undefined ||
      car.pricePerDay <= maxPrice;

    return (
      matchesKeyword &&
      matchesType &&
      matchesPrice
    );
  });
}

export async function createCar(
  input: CarDraft
): Promise<Car> {
  const draft = CarDraftSchema.parse(input);
  const cars = await getCars();

  const nextId =
    cars.length > 0
      ? Math.max(...cars.map((car) => car.id)) + 1
      : 1;

  const car: Car = {
    ...draft,
    id: nextId,
  };

  cars.push(car);
  await saveCars(cars);

  return car;
}

export async function updateCar(
  id: number,
  input: CarDraft
): Promise<Car> {
  const draft = CarDraftSchema.parse(input);
  const cars = await getCars();

  const index = cars.findIndex(
    (car) => car.id === id
  );

  if (index === -1) {
    throw new Error("ไม่พบรถที่ต้องการแก้ไข");
  }

  const updatedCar: Car = {
    ...draft,
    id,
  };

  cars[index] = updatedCar;

  await saveCars(cars);

  return updatedCar;
}

export async function deleteCar(
  id: number
): Promise<void> {
  const cars = await getCars();

  const index = cars.findIndex(
    (car) => car.id === id
  );

  if (index === -1) {
    throw new Error("ไม่พบรถที่ต้องการลบ");
  }

  cars.splice(index, 1);

  await saveCars(cars);
}

export async function setCarAvailability(
  id: number,
  available: boolean
): Promise<Car> {
  const cars = await getCars();

  const car = cars.find(
    (item) => item.id === id
  );

  if (!car) {
    throw new Error("ไม่พบรถที่ต้องการเปลี่ยนสถานะ");
  }

  car.available = available;

  await saveCars(cars);

  return car;
}
