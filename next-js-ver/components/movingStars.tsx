'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  scale: number;
  yMove: number;
  xMove: number;
  iconName: string;
}

interface MovingStarsProps {
  isDark: boolean;
}

export default function MovingStars({ isDark }: MovingStarsProps) {
  const stars: Star[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        startX: (i * 37) % 100,
        startY: (i * 61) % 100,
        duration: 20 + ((i * 7) % 30),
        delay: (i * 3) % 5,
        scale: 0.2 + ((i * 13) % 50) / 100,
        yMove: -50 - ((i * 17) % 100),
        xMove: ((i * 23) % 50) - 25,
        iconName: i % 2 === 0 ? 'star-combo-6' : 'crossStar',
    }));

  const folder = isDark ? 'darkMode' : 'lightMode';
  const theme = isDark ? 'dark' : 'light';

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute opacity-40"
          initial={{
            top: `${star.startY}%`,
            left: `${star.startX}%`,
            scale: star.scale,
          }}
          animate={{
            y: [0, star.yMove],
            x: [0, star.xMove],
            rotate: [0, 180],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: star.delay,
          }}
        >
          <img
            src={`/svg-icons/${folder}/${star.iconName}-${theme}.svg`}
            alt=""
            className="w-6 h-6"
          />
        </motion.div>
      ))}
    </div>
  );
}