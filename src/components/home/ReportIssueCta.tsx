'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

export function ReportIssueCta() {
  return (
    <Link href="/report">
      <motion.button
        type="button"
        className="group relative flex items-center gap-2 border-4 border-black bg-red-500 px-8 py-4 text-lg font-black uppercase text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ y: -4, x: 2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Rocket className="h-6 w-6 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-1" strokeWidth={3} />
        Report Issue
        <ArrowRight className="h-6 w-6 transition-transform duration-150 group-hover:translate-x-1" strokeWidth={3} />
      </motion.button>
    </Link>
  );
}
