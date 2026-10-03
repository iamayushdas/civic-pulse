'use client';

import { motion } from 'framer-motion';

// Metro moving LEFT to RIGHT
export function AnimatedMetro() {
  return (
    <motion.div
      className="absolute top-20 w-64 h-24"
      initial={{ x: '-300px' }}
      animate={{ x: 'calc(100vw + 300px)' }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="w-full h-full bg-black rounded-lg relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-14 bg-white rounded"></div>
        <div className="absolute top-1/2 -translate-y-1/2 left-20 w-12 h-14 bg-white rounded"></div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-14 bg-white rounded"></div>
        <div className="absolute -bottom-2 left-8 w-6 h-6 bg-black rounded-full"></div>
        <div className="absolute -bottom-2 right-8 w-6 h-6 bg-black rounded-full"></div>
      </div>
    </motion.div>
  );
}

// Bus moving RIGHT to LEFT
export function AnimatedBus() {
  return (
    <motion.div
      className="absolute bottom-20 w-48 h-32 right-0"
      initial={{ x: '300px' }}
      animate={{ x: 'calc(-100vw - 300px)' }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="absolute bottom-0 left-6 w-10 h-10 bg-black rounded-full"></div>
      <div className="absolute bottom-0 right-6 w-10 h-10 bg-black rounded-full"></div>
      <div className="absolute bottom-10 left-0 w-full h-20 bg-black rounded-t-xl">
        <div className="absolute top-2 left-2 w-12 h-10 bg-white rounded"></div>
        <div className="absolute top-2 left-16 w-12 h-10 bg-white rounded"></div>
        <div className="absolute top-2 right-2 w-12 h-10 bg-white rounded"></div>
      </div>
    </motion.div>
  );
}

// Auto Rickshaw moving LEFT to RIGHT
export function AnimatedAutoRickshaw() {
  return (
    <motion.div
      className="absolute top-1/2 w-36 h-28 -translate-y-1/2"
      initial={{ x: '-300px' }}
      animate={{ x: 'calc(100vw + 300px)' }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'linear',
        delay: 3,
      }}
    >
      <div className="absolute bottom-0 left-4 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-0 right-4 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-8 left-0 w-full h-16 bg-black rounded-t-2xl"></div>
      <div className="absolute top-2 left-6 w-20 h-10 bg-white rounded-t-lg"></div>
    </motion.div>
  );
}

// DTC Bus moving LEFT to RIGHT
export function AnimatedDTCBus() {
  return (
    <motion.div
      className="absolute bottom-20 w-40 h-28"
      initial={{ x: '-300px' }}
      animate={{ x: 'calc(100vw + 300px)' }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'linear',
        delay: 8,
      }}
    >
      <div className="absolute bottom-0 left-4 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-0 right-4 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-8 left-0 w-full h-16 bg-black rounded-t-lg">
        <div className="absolute top-2 left-2 w-10 h-8 bg-white"></div>
        <div className="absolute top-2 right-2 w-10 h-8 bg-white"></div>
      </div>
    </motion.div>
  );
}

// Cycle Rickshaw moving RIGHT to LEFT
export function AnimatedCycleRickshaw() {
  return (
    <motion.div
      className="absolute bottom-20 w-36 h-24 right-0"
      initial={{ x: '300px' }}
      animate={{ x: 'calc(-100vw - 300px)' }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear',
        delay: 5,
      }}
    >
      <div className="absolute bottom-0 left-2 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-0 right-2 w-8 h-8 bg-black rounded-full"></div>
      <div className="absolute bottom-8 left-0 w-full h-12 bg-black rounded-t-2xl"></div>
      <div className="absolute bottom-8 left-12 w-2 h-16 bg-black -rotate-45"></div>
    </motion.div>
  );
}

// Water Tanker moving RIGHT to LEFT
export function AnimatedWaterTanker() {
  return (
    <motion.div
      className="absolute top-10 w-56 h-32 right-0"
      initial={{ x: '300px' }}
      animate={{ x: 'calc(-100vw - 300px)' }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: 'linear',
        delay: 10,
      }}
    >
      <div className="absolute bottom-0 left-8 w-10 h-10 bg-black rounded-full"></div>
      <div className="absolute bottom-0 right-8 w-10 h-10 bg-black rounded-full"></div>
      <div className="absolute bottom-10 left-0 w-full h-20 bg-black rounded-t-3xl">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full"></div>
      </div>
      <div className="absolute top-0 left-4 w-16 h-8 bg-black rounded-lg"></div>
    </motion.div>
  );
}
