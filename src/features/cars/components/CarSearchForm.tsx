"use client";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SearchCarSchema,CAR_TYPES,defaultSearch,type SearchCar} from "@/features/cars/schema";
export default function CarSearchForm({onSearch}:{onSearch:(q:SearchCar)=>Promise<void>}){
 const {register,handleSubmit}=useForm<SearchCar>({resolver:zodResolver(SearchCarSchema),defaultValues:defaultSearch});
 return <form className="search-form" onSubmit={handleSubmit(onSearch)}>
  <div><label>ค้นหารถ</label><input {...register("q")} placeholder="เช่น Toyota, Civic"/></div>
  <div><label>ประเภทรถ</label><select {...register("type")}>{CAR_TYPES.map(x=><option key={x}>{x}</option>)}</select></div>
  <div><label>ราคาสูงสุด / วัน</label><input type="number" {...register("maxPrice",{setValueAs:v=>v===""?undefined:Number(v)})} placeholder="ไม่จำกัด"/></div>
  <button className="primary-button">ค้นหารถ</button>
 </form>
}