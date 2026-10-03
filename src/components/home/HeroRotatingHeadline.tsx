'use client';

import { useEffect, useState } from 'react';

const headlines = [
  {
    text: 'NATION WANTS TO KNOW',
    className:
      'block text-4xl sm:text-5xl lg:text-7xl font-black leading-none tracking-[-0.08em] text-black',
  },
  {
    text: 'ACCOUNTABILITY LENI PADEGI',
    className:
      'block text-3xl sm:text-4xl lg:text-6xl font-black italic leading-none tracking-[0.08em] bg-black text-yellow-300 px-2 -rotate-1',
  },
  {
    text: 'HUMARE GAON KI AWAZ',
    className:
      'block text-3xl sm:text-4xl lg:text-6xl font-extrabold uppercase leading-none tracking-[0.06em] text-red-600',
  },
  {
    text: 'GOVT. KAAM KARNE KO TAYAR?',
    className:
      'block text-3xl sm:text-4xl lg:text-6xl font-black uppercase leading-none tracking-[-0.05em] bg-red-500 text-white px-2 rotate-2',
  },
  {
    text: 'AUR AAKHRI MANZIL HAI ACTION',
    className:
      'block text-3xl sm:text-4xl lg:text-6xl font-black leading-none tracking-[-0.04em] text-cyan-950 bg-lime-400 px-2 rotate-1',
  },
];

export function HeroRotatingHeadline() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % headlines.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const currentHeadline = headlines[activeIndex];

  return (
    <div className="min-h-[120px] sm:min-h-[140px] flex items-center">
      <span
        key={currentHeadline.text}
        className={`${currentHeadline.className} transition-all duration-500 ease-out`}
      >
        {currentHeadline.text}
      </span>
    </div>
  );
}
