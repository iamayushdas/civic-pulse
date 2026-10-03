"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-civic-black text-civic-white",
  VERIFIED: "bg-civic-black text-civic-white",
  ASSIGNED: "bg-civic-black text-civic-white",
  IN_PROGRESS: "bg-civic-accent text-civic-white",
  RESOLVED: "bg-civic-black text-civic-white",
  REOPENED: "bg-civic-accent text-civic-white",
  REJECTED: "bg-civic-black text-civic-white",
  DUPLICATE: "bg-civic-black text-civic-white",
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "JUST NOW";
  if (m < 60) return `${m} MIN AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} HOUR${h > 1 ? "S" : ""} AGO`;
  const d = Math.floor(h / 24);
  if (d < 2) return "YESTERDAY";
  return `${d} DAYS AGO`;
}

export function ComplaintFeed({ complaints }: { complaints: any[] }) {
  const [items, setItems] = useState(complaints);

  useEffect(() => {
    get("/complaints?limit=6&sort=newest")
      .then((r) => setItems(r.complaints || []))
      .catch(() => {});
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="border-2 border-civic-black p-8 text-center">
        <div className="label-mono">NO COMPLAINTS YET</div>
        <p className="font-mono text-sm text-civic-muted mt-2">
          Be the first to report a problem in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-civic-black divide-y-2 divide-civic-black">
      {items.map((c: any) => (
        <Link
          key={c.complaintId}
          href={`/complaints/${c.complaintId}`}
          className="flex items-center gap-4 p-4 hover:bg-civic-black/[0.02] transition-colors"
        >
          <div className="font-mono font-bold text-civic-accent whitespace-nowrap">
            {c.complaintId}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black uppercase text-sm sm:text-base truncate">
              {c.category}
            </div>
            <div className="label-mono">{c.area}</div>
          </div>
          <div
            className={`badge-status ${STATUS_COLORS[c.status] || ""} shrink-0`}
          >
            {c.status.replace("_", " ")}
          </div>
          <div className="label-mono shrink-0 text-right">
            {timeAgo(c.createdAt)}
          </div>
        </Link>
      ))}
    </div>
  );
}