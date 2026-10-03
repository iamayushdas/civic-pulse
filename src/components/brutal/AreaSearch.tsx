"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const LOCALITIES = [
  "Saket",
  "Greater Kailash",
  "Connaught Place",
  "Dwarka",
  "Rohini",
  "Punjabi Bagh",
  "Lajpat Nagar",
  "Hauz Khas",
  "Vasant Kunj",
  "Shalimar Bagh",
  "Pashchim Vihar",
  "Yamuna Vihar",
  "Seelampur",
  "Chandni Chowk",
  "Nehru Place",
  "Noida Sector 18",
];

export function AreaSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const matches = LOCALITIES.filter((l) =>
    l.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="relative">
      <div className="flex items-center border-2 border-civic-black bg-civic-white">
        <Search className="ml-3 h-4 w-4 text-civic-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="SEARCH LOCALITY OR PINCODE"
          className="w-full bg-transparent px-3 py-2 font-mono text-sm uppercase tracking-wider outline-none placeholder:text-civic-muted/60"
        />
      </div>
      {open && matches.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 border-2 border-civic-black bg-civic-white shadow-[6px_6px_0_0_#111111] max-h-60 overflow-y-auto">
          {matches.map((m) => (
            <Link
              key={m}
              href={{ pathname: "/area", query: { q: m } }}
              onClick={() => {
                setQ("");
                setOpen(false);
              }}
              className="block px-4 py-2 font-black uppercase text-sm hover:bg-civic-accent hover:text-civic-white border-b-2 border-civic-black last:border-b-0"
            >
              {m}
            </Link>
          ))}
        </div>
      )}
      {open && q && matches.length === 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 border-2 border-civic-black bg-civic-white shadow-[6px_6px_0_0_#111111] px-4 py-3 font-mono text-sm text-civic-muted">
          NO MATCHING LOCALITY FOUND
        </div>
      )}
    </div>
  );
}