'use client';

import { useEffect, useState } from 'react';

const LANGUAGE_EVENT = 'civic-language-change';

export function useLanguage() {
  const [hindi, setHindi] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('civic-language') === 'hi';
    setHindi(saved);
    document.documentElement.lang = saved ? 'hi' : 'en';
    const handleChange = () => setHindi(window.localStorage.getItem('civic-language') === 'hi');
    window.addEventListener(LANGUAGE_EVENT, handleChange);
    return () => window.removeEventListener(LANGUAGE_EVENT, handleChange);
  }, []);

  const toggle = () => {
    const next = !hindi;
    window.localStorage.setItem('civic-language', next ? 'hi' : 'en');
    document.documentElement.lang = next ? 'hi' : 'en';
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  };

  return { hindi, toggle };
}

export function LanguageToggle() {
  const { hindi, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={hindi ? 'Switch to English' : 'हिंदी में बदलें'}
      className="border-3 border-black bg-white px-3 py-2 text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
    >
      {hindi ? 'EN' : 'हिंदी'}
    </button>
  );
}
