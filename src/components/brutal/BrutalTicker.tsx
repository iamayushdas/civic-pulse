export function BrutalTicker() {
  const items = [
    "WATER SUPPLY",
    "ROADS",
    "GARBAGE",
    "DRAINAGE",
    "SEWERAGE",
    "STREETLIGHTS",
    "PARKS",
    "POLLUTION",
    "PUBLIC TOILETS",
    "STRAY ANIMALS",
    "ILLEGAL DUMPING",
  ];

  const ticker = [...items, ...items];

  return (
    <div className="border-y-2 border-civic-black bg-civic-black text-civic-white overflow-hidden py-2">
      <div className="ticker-track">
        {ticker.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6 font-black uppercase text-xs sm:text-sm tracking-[0.18em] whitespace-nowrap">
            <span className="text-civic-accent">◈</span>
            {item}
            <span className="text-civic-muted/40">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}