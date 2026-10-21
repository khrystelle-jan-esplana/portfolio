'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovingStars from '@/components/movingStars';
import { StarIcon, CrosshairIcon } from '@/components/Icons';
import { useRouter } from 'next/navigation';

const menuItems = ["introduction", "hobbies", "interests", "skills"];

export default function MenuPage() {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-light-mode text-[#460C3F]">
      
      {/* Texture & Moving Stars */}
      <div className="absolute inset-0 star-pattern-overlay pointer-events-none z-0" />
      <MovingStars />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50 cursor-pointer flex gap-2 opacity-70 hover:opacity-100 transition-opacity" onClick={() => router.push('/')}>
         <CrosshairIcon className="w-6 h-6" />
      </div>

      <div className="relative z-10 w-full h-full flex justify-between items-center px-16 border-[1px] border-current m-4 p-4 max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] shadow-lg backdrop-blur-sm bg-white/5">
        
        {/* Left Side - Menu Items */}
        <div className="flex flex-col gap-4 z-20">
          {menuItems.map((item) => (
            <motion.h2
              key={item}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedItem(item)}
              className={`text-7xl cursor-pointer transition-all duration-300 ${hoveredItem && hoveredItem !== item ? 'opacity-30' : 'opacity-100'}`}
              animate={hoveredItem === item ? { x: 20 } : { x: 0 }}
            >
              {item}
            </motion.h2>
          ))}
        </div>

        {/* Center - Orbiting Menu Graphic (Original) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-[400px] h-[400px] border border-dashed border-current rounded-full opacity-50"
           />
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute w-[300px] h-[300px] border border-current rounded-full opacity-70"
           />
           
           {/* Orbiting Planet */}
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute w-[400px] h-[400px]"
           >
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-300 to-white shadow-[0_0_15px_rgba(255,255,255,0.8)] absolute -top-4 left-1/2 -ml-4" />
           </motion.div>
           
           <h1 className="font-italiana text-6xl z-10 pointer-events-none">menu</h1>
        </div>

        {/* Selected Menu Star Fade-In Overlay (Original) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center pointer-events-auto cursor-pointer"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col items-center gap-8"
              >
                <StarIcon className="w-16 h-16" />
                <h1 className="text-6xl capitalize">{selectedItem}</h1>
                
                <div className="flex gap-6 opacity-70 text-2xl mt-4">
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>Detail 1</motion.span>
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>Detail 2</motion.span>
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>Detail 3</motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}