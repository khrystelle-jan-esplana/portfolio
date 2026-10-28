"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import { Icon, ICONS } from "@/components/icons";
import { markFromMenu } from "@/components/fromMenu";
import { menu, subHref } from "@/components/menuData";
import MobileMenuList from "@/components/mobileMenuList";

export default function MenuPage() {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => setSel(sel === i ? null : i);
  const item = sel === null ? null : menu[sel];

  // tells the next page the logo should slide in from the right
  useEffect(() => { markFromMenu(); }, []);

  return (
    <main className="stage menu-page">
      <div className="bg" /><StarField /><div className="frame" />
      <ThemeToggle />

      {/* phone: curled frame corners */}
      {["tl", "tr", "bl", "br"].map((c) => (
        <svg key={c} className={`m-corner ${c}`} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <path d="M3 13c0-6 4-10 10-10" />
          <circle cx="8" cy="8" r="2.2" />
        </svg>
      ))}

      {/* ================= DESKTOP ================= */}
      <Link href="/" className="home-link" aria-label="Back to home">
        <span>khrystelle</span>
        <Icon name="crossStar" className="home-star" />
      </Link>

      <div className="orbit-stage" aria-label="Portfolio menu">
        <div className="ring ring-outer" />
        <div className="ring ring-middle" />
        <div className="ring ring-inner" />
        <div className="planet-orbit"><span className="m-planet" /></div>
        <div className="planet-orbit two"><span className="m-planet" /></div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={item?.title ?? "menu"}
            className="orbit-label"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            {item ? <Link href={item.href}>{item.title}</Link> : "menu"}
          </motion.h1>
        </AnimatePresence>

        <div className="star-ring">
          {menu.map((m, i) => (
            <button
              key={m.title}
              className={`menu-star ${sel === i ? "on" : ""}`}
              style={{ "--a": `${i * 72}deg` } as React.CSSProperties}
              onClick={() => pick(i)}
              aria-label={`Open ${m.title}`}
            >
              <span className="star-mask" style={{ "--m": `url(${ICONS.menuStar.light})` } as React.CSSProperties} />
              <span className="star-label">{m.title}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {item && item.links.length > 0 && (
          <motion.nav
            key={item.title}
            className="sub-list"
            aria-label={`${item.title} sections`}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {item.links.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={subHref(item, l)}>{l.label}</Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ================= PHONE ================= */}
      <nav className="m-menu" aria-label="Portfolio menu" style={{ "--m": `url(${ICONS.menuStar.light})` } as React.CSSProperties}>
        <div className="m-head">
          <span className="m-rule l"><span className="m-star" /></span>
          <h1>menu</h1>
          <span className="m-rule r"><span className="m-star" /></span>
        </div>
        <MobileMenuList delay={2.3} />
      </nav>

      <Link href="/" className="home-link m-home" aria-label="Back to home">
        <span>khrystelle</span>
        <Icon name="crossStar" className="home-star" />
      </Link>
    </main>
  );
}