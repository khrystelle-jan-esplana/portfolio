"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, ICONS } from "@/components/icons";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";

// Stars are in this order around the orbit. Only "about me" has content for now.
const menu = [
  { title: "about me", links: ["introduction", "interests", "hobbies", "skills"] },
  { title: "achievements", href: "/achievements", links: ["leadership", "competition", "award", "scholarship"] },
  { title: "certifications", href: "/", links: [] as string[] },
  { title: "projects", href: "/", links: [] as string[] },
  { title: "tech stack", href: "/", links: [] as string[] },
];

export default function MenuPage() {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => setSel(sel === i ? null : i);
  const item = sel === null ? null : menu[sel];

  return (
    <main className="stage">
      <div className="bg" /><StarField /><div className="frame" />
      <ThemeToggle />

      {/* home button: name + cross star, top right */}
      <Link href="/" className="home-link" aria-label="Back to home">
        <span>khrystelle</span>
        <Icon name="crossStar" className="home-star" />
      </Link>

      <div className="orbit-stage" aria-label="Portfolio menu">
        <div className="ring ring-outer" />
        <div className="ring ring-middle" />
        <div className="ring ring-inner" />
        <div className="planet-orbit"><span className="planet" /></div>
        <div className="planet-orbit two"><span className="planet" /></div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={item?.title ?? "menu"}
            className="orbit-label"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            {item?.title ?? "menu"}
          </motion.h1>
        </AnimatePresence>

        {/* stars orbit the circle; hovering pauses them so they're easy to click */}
        <div className="star-ring">
          {menu.map((m, i) => (
            <button
              key={m.title}
              className={`menu-star ${sel === i ? "on" : ""}`}
              style={{ "--a": `${i * 72}deg` } as React.CSSProperties}
              onClick={() => pick(i)}
              aria-label={`Open ${m.title}`}
              title={m.title}
            >
              <span className="star-mask" style={{ "--m": `url(${ICONS.menuStar.light})` } as React.CSSProperties} />
            </button>
          ))}
        </div>
      </div>

      {/* subcategories: rise from the bottom, lower-left corner */}
      <AnimatePresence mode="wait">
        {item && item.links.length > 0 && (
          <motion.nav
            key={item.title}
            className="sub-list"
            aria-label={`${item.title} sections`}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {item.links.map((link, i) => (
               <motion.div
                  key={link}
                  initial={{ opacity: 0, y: 90 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                  <Link href={`${item.href}#${link}`}>{link}</Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </main>
  );
}