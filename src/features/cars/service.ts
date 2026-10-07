import "server-only";

import fs from "fs/promises";
import path from "path";

import {
  CarSchema,
  CarDraftSchema,
  SearchCarSchema,
} from "./schema";

import type {
  Car,
  CarDraft,
  SearchCar,
} from "./schema";

const filePath = path.join(
  process.cwd(),
  "data",
  "cars.json"
);

export {
  CarSchema,
  CarDraftSchema,
  SearchCarSchema,
};

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
  "มอเตอร์ไซค์",
] as const;

export const defaultSearch: SearchCar = {
  q: "",
  type: "ทั้งหมด",
  maxPrice: undefined,
};

/* =========================
   GET CARS
========================= */

export async function getCars(): Promise<Car[]> {
  const text = await fs.readFile(
    filePath,
    "utf8"
  );

  return JSON.parse(text);
}

/* =========================
   GET CAR
========================= */

export async function getCar(
  id: number
): Promise<Car | undefined> {
  const cars = await getCars();

  return cars.find(
    (car) => car.id === id
  );
}

/* =========================
   SAVE CARS
========================= */

async function saveCars(
  cars: Car[]
) {
  await fs.writeFile(
    filePath,
    JSON.stringify(
      cars,
      null,
      2
    ),
    "utf8"
  );
}

/* =========================
   CREATE CAR
========================= */

export async function createCar(
  draft: CarDraft
) {
  const cars =
    await getCars();

  const car: Car = {
    ...draft,

    id: Date.now(),
  };

  cars.push(car);

  await saveCars(cars);

  return car;
}

/* =========================
   UPDATE CAR
========================= */

export async function updateCar(
  id: number,
  draft: CarDraft
) {
  const cars =
    await getCars();

  const index =
    cars.findIndex(
      (car) => car.id === id
    );

  if (index < 0) {
    throw new Error(
      "ไม่พบรถ"
    );
  }

  cars[index] = {
    ...draft,
    id,
  };

  await saveCars(cars);

  return cars[index];
}

/* =========================
   DELETE CAR
========================= */

export async function deleteCar(
  id: number
) {
  const cars =
    await getCars();

  const filtered =
    cars.filter(
      (car) => car.id !== id
    );

  await saveCars(filtered);
}

/* =========================
   SEARCH CARS
========================= */

export async function searchCars(
  query: SearchCar
) {
  const cars =
    await getCars();

  return cars
    .filter((car) => {
      const keyword =
        query.q
          .toLowerCase();

      return (
        car.name
          .toLowerCase()
          .includes(keyword) ||
        car.brand
          .toLowerCase()
          .includes(keyword)
      );
    })
    .filter(
      (car) =>
        query.type ===
          "ทั้งหมด" ||
        car.type ===
          query.type
    )
    .filter(
      (car) =>
        !query.maxPrice ||
        car.pricePerDay <=
          query.maxPrice
    );
}