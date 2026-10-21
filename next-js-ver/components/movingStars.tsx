'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, SparkleIcon } from './Icons';

export default function MovingStars() {
  // useMemo ensures the random positions are only calculated ONCE on load
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 5,
      scale: Math.random() * 0.5 + 0.2,
      yMove: Math.random() * -100 - 50,
      xMove: Math.random() * 50 - 25,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute opacity-40"
          initial={{ top: `${star.startY}%`, left: `${star.startX}%`, scale: star.scale }}
          animate={{
            y: [0, star.yMove], 
            x: [0, star.xMove],   
            rotate: [0, 180],
            opacity: [0.2, 0.6, 0.2] 
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay
          }}
        >
          {star.id % 3 === 0 ? <StarIcon className="w-6 h-6" /> : <SparkleIcon className="w-4 h-4" />}
        </motion.div>
      ))}
    </div>
  );
}