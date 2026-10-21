'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MovingStars from '@/components/movingStars';
import { CrosshairIcon, OrbitIcon, StarIcon } from '@/components/Icons';

export default function LandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleExplore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push('/menu');
    }, 2500); 
  };

  return (
    <main className={`relative w-screen h-screen overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-dark-mode' : 'bg-light-mode'}`}>
      
      {/* Adds the subtle texture over your gradients */}
      <div className="absolute inset-0 star-pattern-overlay pointer-events-none z-0" />
      
      {/* Moving animated stars */}
      <MovingStars />

      {/* Top Left Theme Toggle */}
      <motion.button 
        onClick={toggleTheme}
        whileTap={{ scale: 0.9, rotate: 180 }}
        className="absolute top-8 left-8 z-50 cursor-pointer"
      >
        <StarIcon className="w-10 h-10" />
      </motion.button>

      {/* Main Content Container (Your Original Layout) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center border-[1px] border-current m-4 p-4 max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] shadow-lg backdrop-blur-sm bg-white/5">
        
        {/* Top Right Decor */}
        <div className="absolute top-10 right-10 flex gap-2 opacity-70">
           <OrbitIcon className="w-16 h-8" />
        </div>

        {/* Text Content */}
        <div className="text-center relative">
          <p className="text-2xl italic absolute -left-32 top-10 opacity-70">portfolio</p>
          
          <h1 className="font-italiana text-[12vw] leading-none tracking-tight flex flex-col items-center">
            khrystelle
            <span className="flex items-center gap-6">
              <OrbitIcon className="w-24 h-24 opacity-80" />
              jan
            </span>
          </h1>
        </div>

        {/* Bottom Right Explore */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-4 cursor-pointer" onClick={handleExplore}>
          <h2 className="text-4xl italic hover:opacity-70 transition-opacity">explore</h2>
          
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={isLoading ? { scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              >
                <CrosshairIcon className="w-5 h-5" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}