"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCarSearchForm() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [type, setType] = useState("ทั้งหมด");

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) {
      params.set("q", q.trim());
    }

    if (type !== "ทั้งหมด") {
      params.set("type", type);
    }

    const query = params.toString();

    router.push(
      query
        ? `/admin/cars?${query}`
        : "/admin/cars"
    );
  }

  return (
    <form
      className="search-form"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        value={q}
        placeholder="ค้นหาชื่อรถหรือยี่ห้อ..."
        onChange={(e) =>
          setQ(e.target.value)
        }
      />

      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      >
        <option value="ทั้งหมด">
          ทั้งหมด
        </option>

        <option value="รถเก๋ง">
          รถเก๋ง
        </option>

        <option value="SUV">
          SUV
        </option>

        <option value="กระบะ">
          กระบะ
        </option>

        <option value="รถตู้">
          รถตู้
        </option>

        <option value="มอเตอร์ไซค์">
          มอเตอร์ไซค์
        </option>
      </select>

      <button
        type="submit"
        className="primary-button"
      >
        ค้นหา
      </button>
    </form>
  );
}