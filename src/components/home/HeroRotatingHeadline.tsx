'use client';

import { useEffect, useState } from 'react';

type TextSegment = {
  text: string;
  className: string;
};

type Headline = {
  segments: TextSegment[];
  baseClassName: string;
};

const headlines: Headline[] = [
  {
    baseClassName: 'block text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-[-0.08em] border-4 border-black shadow-[8px_8px_0_0_#000]',
    segments: [
      { text: 'NATION ', className: 'text-black' },
      { text: 'WANTS TO ', className: 'text-black' },
      { text: 'KNOW', className: 'text-yellow-300 bg-black px-2' },
    ],
  },
  {
    baseClassName: 'block text-4xl sm:text-5xl lg:text-7xl font-black italic leading-none tracking-[0.08em] bg-black text-yellow-300 px-4 py-1 border-4 border-black shadow-[8px_8px_0_0_#000] -rotate-1',
    segments: [
      { text: 'ACCOUNTABILITY ', className: '' },
      { text: 'LENI ', className: 'font-extrabold text-red-500 bg-yellow-300 px-1 -rotate-2' },
      { text: 'PADEGI', className: 'underline decoration-4 underline-offset-4 decoration-yellow-300' },
    ],
  },
  {
    baseClassName: 'block text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase leading-none tracking-[0.06em]',
    segments: [
      { text: 'POV: ', className: 'text-red-600 bg-yellow-300 px-1' },
      { text: 'YOUR POTHOLE ', className: 'text-black bg-lime-400 px-1 rotate-1' },
      { text: 'IS VIRAL NOW', className: 'text-red-600 bg-white px-1 border-2 border-red-600' },
    ],
  },
  {
    baseClassName: 'block text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-none tracking-[-0.05em] bg-red-500 text-white px-4 py-1 border-4 border-black shadow-[8px_8px_0_0_#000] rotate-2',
    segments: [
      { text: 'GOVT. ', className: 'bg-black px-1' },
      { text: 'KAAM KARNE ', className: '' },
      { text: 'KO TAYAR?', className: 'text-yellow-300 bg-black px-1 underline decoration-4 underline-offset-2 decoration-yellow-300' },
    ],
  },
  {
    baseClassName: 'block text-4xl sm:text-5xl lg:text-7xl font-black leading-none tracking-[-0.04em] text-cyan-950 bg-lime-400 px-4 py-1 border-4 border-black shadow-[8px_8px_0_0_#000] rotate-1',
    segments: [
      { text: 'AUR ', className: '' },
      { text: 'AAKHRI ', className: 'text-red-600 bg-yellow-300 px-1 -rotate-1' },
      { text: 'MANZIL HAI ', className: '' },
      { text: 'ACTION', className: 'font-extrabold text-white bg-red-500 px-2 border-2 border-black shadow-[4px_4px_0_0_#000]' },
    ],
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
        key={activeIndex}
        className={`${currentHeadline.baseClassName} transition-all duration-500 ease-out`}
      >
        {currentHeadline.segments.map((segment, i) => (
          <span key={i} className={segment.className}>
            {segment.text}
          </span>
        ))}
      </span>
    </div>
  );
}