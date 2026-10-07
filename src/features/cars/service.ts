import "server-only";

import fs from "fs/promises";
import path from "path";

import { CarSchema, CarDraftSchema, SearchCarSchema } from "./schema";

import type {
  Car,
  CarDraft,
  SearchCar,
} from "./schema";

const filePath = path.join(
  process.cwd(),
  "data/cars.json"
);

export { CarSchema, CarDraftSchema, SearchCarSchema };

export type {
  Car,
  CarDraft,
  SearchCar,
};

export const CAR_TYPES = [
  "ทั้งหมด",
  "รถเก๋ง",
  "SUV",
  "กระบะ",
  "รถตู้",
] as const;

export const defaultSearch: SearchCar = {
  q: "",
  type: "ทั้งหมด",
  maxPrice: undefined,
};

export async function getCars(): Promise<Car[]> {
  return JSON.parse(
    await fs.readFile(filePath, "utf8")
  );
}

export async function getCar(
  id: number
): Promise<Car | undefined> {
  const cars = await getCars();

  return cars.find(
    (car) => car.id === id
  );
}

async function saveCars(cars: Car[]) {
  await fs.writeFile(
    filePath,
    JSON.stringify(cars, null, 2),
    "utf8"
  );
}

export async function createCar(
  draft: CarDraft
) {
  const cars = await getCars();

  const car = {
    ...draft,
    id: Date.now(),
  };

  cars.push(car);

  await saveCars(cars);

  return car;
}

export async function updateCar(
  id: number,
  draft: CarDraft
) {
  const cars = await getCars();

  const index = cars.findIndex(
    (c) => c.id === id
  );

  if (index < 0) {
    throw new Error("ไม่พบรถ");
  }

  cars[index] = {
    ...draft,
    id,
  };

  await saveCars(cars);

  return cars[index];
}

export async function deleteCar(
  id: number
) {
  const cars = await getCars();

  await saveCars(
    cars.filter(
      (c) => c.id !== id
    )
  );
}

export async function searchCars(
  query: SearchCar
) {
  const cars = await getCars();

  return cars
    .filter(
      (c) =>
        c.name
          .toLowerCase()
          .includes(
            query.q.toLowerCase()
          ) ||
        c.brand
          .toLowerCase()
          .includes(
            query.q.toLowerCase()
          )
    )
    .filter(
      (c) =>
        query.type === "ทั้งหมด" ||
        c.type === query.type
    )
    .filter(
      (c) =>
        !query.maxPrice ||
        c.pricePerDay <= query.maxPrice
    );
}