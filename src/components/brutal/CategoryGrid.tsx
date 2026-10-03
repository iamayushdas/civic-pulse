"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";

const CATEGORIES = [
  "Water Supply",
  "Roads",
  "Garbage",
  "Drainage",
  "Sewerage",
  "Streetlights",
  "Parks",
  "Pollution",
  "Illegal Dumping",
  "Public Toilets",
  "Stray Animals",
  "Other",
];

export function CategoryGrid() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    get("/stats/categories")
      .then((c) => setCounts(c))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={{ pathname: "/map", query: { category: cat } }}
          className="card-brutal p-4 sm:p-5 flex flex-col justify-between min-h-[110px] hover:-translate-y-1 transition-transform"
        >
          <span className="label-mono">
            {counts?.[cat] ?? 0}
          </span>
          <span className="font-black uppercase text-sm sm:text-base leading-tight">
            {cat.replace(" ", "\n")}
          </span>
        </Link>
      ))}
    </div>
  );
}