'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MovingStars from '@/components/movingStars';

const menuItems = [
  { title: 'introduction', links: ['about me', 'my journey', 'currently'] },
  { title: 'hobbies', links: ['what I make', 'what I read', 'little joys'] },
  { title: 'interests', links: ['design', 'technology', 'the cosmos'] },
  { title: 'skills', links: ['creative', 'technical', 'in progress'] },
];
const starIcon = (dark: boolean) => `/svg-icons/${dark ? 'darkMode/line-star-dark.svg' : 'menuIcons/menu-star-icon-light.svg'}`;

export default function MenuPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [revealFrom, setRevealFrom] = useState<boolean | null>(null);
  const [selectedItem, setSelectedItem] = useState<(typeof menuItems)[number] | null>(null);

  useEffect(() => { setIsDark(localStorage.getItem('portfolio-theme') === 'dark'); }, []);
  const toggleTheme = () => {
    setRevealFrom(isDark);
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('portfolio-theme', next ? 'dark' : 'light');
  };

  return (
    <main className={`portfolio-scene menu-scene ${isDark ? 'theme-dark' : 'theme-light'} ${selectedItem ? 'has-selection' : ''}`}>
      <div className="scene-gradient" />
      {revealFrom !== null && <motion.div key={`${revealFrom}-${isDark}`} className={`theme-reveal ${revealFrom ? 'theme-reveal-dark' : 'theme-reveal-light'}`} initial={{ clipPath: 'circle(150% at 40px 40px)' }} animate={{ clipPath: 'circle(0% at 40px 40px)' }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => setRevealFrom(null)} />}
      <div className="star-pattern-overlay" />
      <MovingStars isDark={isDark} />

      <button className="theme-toggle" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} onClick={toggleTheme}>
        <img src={`/svg-icons/${isDark ? 'darkMode/toggle-darkMode-icon.svg' : 'lightMode/toggle-light-mode-icon.svg'}`} alt="" />
      </button>
      <button className="menu-back" onClick={() => router.push('/')} aria-label="Back to home"><span>←</span><span>home</span></button>

      <section className="menu-frame">
        <div className="menu-corner menu-corner-tl">✧</div><div className="menu-corner menu-corner-tr">✧</div>
        <div className="menu-corner menu-corner-bl">✧</div><div className="menu-corner menu-corner-br">✧</div>

        <div className="menu-left-decor" aria-hidden="true"><div className="sunburst" /></div>
        <div className="menu-right-decor" aria-hidden="true"><div className="sunburst" /></div>

        <div className="orbit-stage" aria-label="Portfolio menu">
          <motion.div className="orbit orbit-outer" animate={{ rotate: 360 }} transition={{ duration: 72, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="orbit orbit-middle" animate={{ rotate: -360 }} transition={{ duration: 58, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="orbit orbit-inner" animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="planet-orbit" animate={{ rotate: 360 }} transition={{ duration: 19, repeat: Infinity, ease: 'linear' }}><span className="orbit-planet" /></motion.div>
          <motion.div className="planet-orbit planet-orbit-two" animate={{ rotate: -360 }} transition={{ duration: 27, repeat: Infinity, ease: 'linear' }}><span className="orbit-planet" /></motion.div>
          <AnimatePresence mode="wait">
            <motion.h1 key={selectedItem?.title ?? 'menu'} className="orbit-label" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55 }}>
              {selectedItem?.title ?? 'menu'}
            </motion.h1>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedItem && <motion.nav className="subcategory-list" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ delay: 0.35, duration: 0.7 }} aria-label={`${selectedItem.title} sections`}>
            {selectedItem.links.map((link, index) => <motion.a key={link} href={`#${link.replaceAll(' ', '-')}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 + index * 0.12, duration: 0.6 }}>{link}<span>↗</span></motion.a>)}
          </motion.nav>}
        </AnimatePresence>

        <div className="menu-stars" role="group" aria-label="Choose a menu section">
          {menuItems.map((item, i) => <motion.button key={item.title} className={`menu-star ${selectedItem?.title === item.title ? 'is-selected' : ''}`} aria-label={`Open ${item.title}`} onClick={() => setSelectedItem(selectedItem?.title === item.title ? null : item)} whileHover={{ scale: 1.25, rotate: 45 }} whileTap={{ scale: 0.85 }} style={{ '--star-index': i } as React.CSSProperties}><img src={starIcon(isDark)} alt="" /><span>{item.title}</span></motion.button>)}
        </div>

        <div className="menu-progress" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i}>✦</span>)}</div>
      </section>
    </main>
  );
}
