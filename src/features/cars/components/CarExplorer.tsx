"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import CarSearchForm from "./CarSearchForm";
import type { Car, SearchCar } from "@/features/cars/schema";

export default function CarExplorer({initialCars}:{initialCars:Car[]}){
 const [cars,setCars]=useState(initialCars);
 const [query,setQuery]=useState<SearchCar>({q:"",type:"ทั้งหมด"});
 const filtered=useMemo(()=>cars.filter(c=>(!query.q || c.name.toLowerCase().includes(query.q.toLowerCase()) || c.brand.toLowerCase().includes(query.q.toLowerCase())) && (query.type==="ทั้งหมด"||c.type===query.type) && (!query.maxPrice||c.pricePerDay<=query.maxPrice)),[cars,query]);
 return <main className="container">
  <section className="hero"><div><span className="eyebrow">CAR RENTAL SYSTEM</span><h1>เช่ารถง่าย ๆ<br/>เลือกคันที่ใช่สำหรับคุณ</h1><p>ค้นหารถตามประเภทและงบประมาณ แล้วจองรถออนไลน์ได้ทันที</p></div><div className="hero-car">🚘</div></section>
  <section className="panel"><CarSearchForm onSearch={async q=>setQuery(q)}/></section>
  <div className="section-title"><div><h2>รถที่พร้อมให้เช่า</h2><p>พบ {filtered.length} คัน</p></div></div>
  <div className="car-grid">{filtered.map(car=><article className="car-card" key={car.id}>
   <img src={car.image} alt={car.name}/><div className="car-body"><span className="tag">{car.type}</span><h3>{car.name}</h3><p className="muted">{car.brand} • {car.seats} ที่นั่ง • {car.transmission}</p><div className="car-bottom"><strong>฿{car.pricePerDay.toLocaleString()} <small>/ วัน</small></strong><Link href={`/rent/${car.id}`} className="primary-button">เช่ารถ</Link></div></div>
  </article>)}</div>
  {filtered.length===0&&<div className="empty">ไม่พบรถที่ตรงกับเงื่อนไข</div>}
 </main>
}