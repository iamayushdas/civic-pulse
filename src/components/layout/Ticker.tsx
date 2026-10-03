'use client';

export function Ticker({ items }: { items: string[] }) {
  const doubledItems = [...items, ...items];
  
  return (
    <div className="border-y-2 border-civic-black bg-civic-accent text-civic-white overflow-hidden py-3">
      <div className="ticker-track">
        {doubledItems.map((item, index) => (
          <span key={index} className="inline-flex items-center px-6 font-bold text-sm tracking-wider whitespace-nowrap">
            {item}
            <span className="mx-6">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
