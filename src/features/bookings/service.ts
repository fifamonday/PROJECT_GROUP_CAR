import "server-only";

import fs from "fs/promises";

import path from "path";

import { z } from "zod";


/* =========================================================
   FILE PATH
========================================================= */

const filePath =
  path.join(
    process.cwd(),
    "data",
    "bookings.json"
  );


/* =========================================================
   BOOKING SCHEMA
========================================================= */

export const BookingSchema =
  z.object({

    id: z.number(),

    carId: z.number(),

    userId: z.number(),

    userName: z.string(),

    userEmail:
      z.string().optional(),

    carName: z.string(),

    licensePlate:
      z.string(),

    startDate:
      z.string(),

    endDate:
      z.string(),

    days: z.number(),

    total: z.number(),

    status: z.enum([
      "รอยืนยัน",
      "ยืนยันแล้ว",
      "ยกเลิก",
    ]),

  });


export type Booking =
  z.infer<
    typeof BookingSchema
  >;


/* =========================================================
   GET ALL BOOKINGS
========================================================= */

export async function getBookings(): Promise<
  Booking[]
> {

  const text =
    await fs.readFile(
      filePath,
      "utf8"
    );


  const data =
    JSON.parse(text);


  return BookingSchema
    .array()
    .parse(data);
}


/* =========================================================
   SAVE BOOKINGS
========================================================= */

async function save(
  items: Booking[]
) {

  await fs.writeFile(

    filePath,

    JSON.stringify(
      items,
      null,
      2
    ),

    "utf8"

  );

}


/* =========================================================
   CREATE BOOKING
========================================================= */

export async function createBooking(
  data: Omit<
    Booking,
    "id" | "status"
  >
) {

  const items =
    await getBookings();


  const item: Booking = {

    ...data,

    id: Date.now(),

    status:
      "รอยืนยัน",

  };


  // เพิ่มรายการใหม่ไว้บนสุด

  items.unshift(item);


  await save(items);


  return item;

}


/* =========================================================
   GET USER BOOKINGS
========================================================= */

export async function getUserBookings(
  userEmail: string
) {

  const items =
    await getBookings();


  return items.filter(
    (booking) =>

      booking.userEmail
        ?.toLowerCase() ===
      userEmail.toLowerCase()
  );

}


/* =========================================================
   GET BOOKING BY ID
========================================================= */

export async function getBooking(
  id: number
) {

  const items =
    await getBookings();


  return items.find(
    (booking) =>
      booking.id === id
  );

}


/* =========================================================
   UPDATE BOOKING
========================================================= */

export async function updateBooking(
  id: number,
  endDate: string
) {

  const items =
    await getBookings();


  const booking =
    items.find(
      (item) =>
        item.id === id
    );


  if (!booking) {

    throw new Error(
      "ไม่พบรายการเช่า"
    );

  }


  const start =
    new Date(
      booking.startDate
    );


  const oldEnd =
    new Date(
      booking.endDate
    );


  const newEnd =
    new Date(endDate);


  if (newEnd <= start) {

    throw new Error(
      "ต้องเลือกวันคืนรถหลังวันรับรถ"
    );

  }


  const oldDays =
    Math.ceil(

      (
        oldEnd.getTime() -
        start.getTime()
      ) /

      (1000 * 60 * 60 * 24)

    );


  const newDays =
    Math.ceil(

      (
        newEnd.getTime() -
        start.getTime()
      ) /

      (1000 * 60 * 60 * 24)

    );


  const pricePerDay =
    booking.total /
    oldDays;


  booking.endDate =
    endDate;


  booking.days =
    newDays;


  booking.total =
    newDays *
    pricePerDay;


  await save(items);


  return booking;

}


/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

export async function updateBookingStatus(
  id: number,
  status: Booking["status"]
) {

  const items =
    await getBookings();


  const item =
    items.find(
      (booking) =>
        booking.id === id
    );


  if (!item) {

    throw new Error(
      "ไม่พบรายการเช่า"
    );

  }


  item.status =
    status;


  await save(items);


  return item;

}