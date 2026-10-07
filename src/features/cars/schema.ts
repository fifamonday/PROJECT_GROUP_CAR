import { z } from "zod";

export const CarSchema = z.object({
  id: z.number(),

  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อรถ"),

  brand: z
    .string()
    .trim()
    .min(1, "กรุณากรอกยี่ห้อ"),

  licensePlate: z
    .string()
    .trim()
    .min(1, "กรุณากรอกทะเบียนรถ"),

  type: z
    .string()
    .trim()
    .min(1, "กรุณาเลือกประเภทรถ"),

  pricePerDay: z
    .number()
    .positive("ราคาต้องมากกว่า 0"),

  seats: z
    .number()
    .int()
    .min(1)
    .max(15),

  transmission: z
    .string()
    .min(1),

  fuel: z
    .string()
    .min(1),

  image: z
    .string()
    .url("URL รูปภาพไม่ถูกต้อง"),

  available: z.boolean(),
});

export const CarDraftSchema =
  CarSchema.omit({
    id: true,
  });

export const SearchCarSchema = z.object({
  q: z
    .string()
    .trim(),

  type: z
    .string(),

  maxPrice: z
    .number()
    .positive()
    .optional(),
});

export type Car =
  z.infer<typeof CarSchema>;

export type CarDraft =
  z.infer<typeof CarDraftSchema>;

export type SearchCar =
  z.infer<typeof SearchCarSchema>;

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