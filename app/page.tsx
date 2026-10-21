'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import MovingStars from '@/components/movingStars';

const icons = {
  toggle: (dark: boolean) => `/svg-icons/${dark ? 'darkMode/toggle-darkMode-icon.svg' : 'lightMode/toggle-light-mode-icon.svg'}`,
  ornament: (dark: boolean, name: string) => `/svg-icons/${dark ? 'darkMode' : 'lightMode'}/${name}-${dark ? 'dark' : 'light'}.svg`,
};

export default function LandingPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [revealFrom, setRevealFrom] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(localStorage.getItem('portfolio-theme') === 'dark');
  }, []);

  const toggleTheme = () => {
    setRevealFrom(isDark);
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('portfolio-theme', next ? 'dark' : 'light');
  };

  const handleExplore = () => {
    if (isLoading) return;
    setIsLoading(true);
    window.setTimeout(() => router.push('/menu'), 2500);
  };

  return (
    <main className={`portfolio-scene landing-scene ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="scene-gradient" />
      {revealFrom !== null && <motion.div key={`${revealFrom}-${isDark}`} className={`theme-reveal ${revealFrom ? 'theme-reveal-dark' : 'theme-reveal-light'}`} initial={{ clipPath: 'circle(150% at 40px 40px)' }} animate={{ clipPath: 'circle(0% at 40px 40px)' }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => setRevealFrom(null)} />}
      <div className="star-pattern-overlay" />
      <MovingStars isDark={isDark} />

      <motion.button
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        onClick={toggleTheme}
        whileTap={{ scale: 0.86, rotate: 180 }}
        className="theme-toggle"
      >
        <img src={icons.toggle(isDark)} alt="" />
      </motion.button>

      <div className="ornament ornament-corner" aria-hidden="true"><span /><img src={icons.ornament(isDark, 'crossStar')} alt="" /></div>
      <img className="ornament ornament-top-right" src={icons.ornament(isDark, 'star-raydown')} alt="" />
      <img className="ornament ornament-left-bottom" src={icons.ornament(isDark, 'star-combo-6')} alt="" />

      <section className="landing-frame">
        <div className="landing-rule" aria-hidden="true"><span /></div>
        <div className="landing-title-wrap">
          <p className="portfolio-label">portfolio</p>
          <h1 className="landing-title">khrystelle<span className="name-last"><img src={icons.ornament(isDark, 'star-filledCircle')} alt="" />jan</span></h1>
        </div>
        <motion.button className="explore-button" onClick={handleExplore} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
          <span>{isLoading ? 'entering' : 'explore'}</span>
          <span className="countdown-stars" aria-label={isLoading ? 'Opening menu' : 'Explore the portfolio'}>
            {[0, 1, 2, 3, 4].map((i) => <motion.img key={i} src={icons.ornament(isDark, 'line-star')} alt="" animate={isLoading ? { scale: [1, 1.35, 1], opacity: [0.35, 1, 0.35] } : { opacity: [0.65, 1, 0.65] }} transition={{ duration: isLoading ? 0.75 : 2.2, repeat: Infinity, delay: i * (isLoading ? 0.32 : 0.24) }} />)}
          </span>
        </motion.button>
      </section>
      <AnimatePresence>{isLoading && <motion.div className="launch-flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}</AnimatePresence>
    </main>
  );
}
