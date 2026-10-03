"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";

interface Stats {
  total: number;
  open: number;
  resolved: number;
  thisWeek: number;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    get("/stats")
      .then((s) => active && setStats(s))
      .catch(() => {});
    const id = setInterval(() => {
      get("/stats")
        .then((s) => active && setStats(s))
        .catch(() => {});
    }, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const items = [
    { label: "TOTAL", value: stats?.total ?? "—" },
    { label: "OPEN", value: stats?.open ?? "—" },
    { label: "RESOLVED", value: stats?.resolved ?? "—" },
    { label: "THIS WEEK", value: stats?.thisWeek ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="border-2 border-civic-white/20 p-4 sm:p-5"
        >
          <div className="stat-giant text-civic-white">
            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
          </div>
          <div className="label-mono mt-1 text-civic-white/60">{s.label}</div>
        </div>
      ))}
    </div>
  );
}