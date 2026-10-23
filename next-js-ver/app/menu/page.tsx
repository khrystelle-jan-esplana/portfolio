"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { useHash } from "@/components/useHash";
import { Icon, ICONS } from "@/components/icons";
import { markFromMenu } from "@/components/fromMenu";

type Sub = { label: string; id: string };
// `id` is the #hash the destination page uses to open that section / planet.
const menu: { title: string; href: string; links: Sub[] }[] = [
  { title: "about me", href: "/about", links: [
    { label: "introduction", id: "introduction" }, { label: "interests", id: "interests" },
    { label: "hobbies", id: "hobbies" }, { label: "skills", id: "skills" } ] },
  { title: "achievements", href: "/achievements", links: [
    { label: "leadership", id: "leadership" }, { label: "competitions", id: "competitions" },
    { label: "award", id: "award" }, { label: "scholarships", id: "scholarships" },
    { label: "course completions", id: "course-completions" } ] },
  { title: "certifications", href: "/certifications", links: [] as Sub[] },
  { title: "projects", href: "/projects", links: [
    { label: "M.I.G.S", id: "migs" }, { label: "capstone", id: "capstone" }, { label: "IoT", id: "iot" } ] },
  { title: "tech stack", href: "/tech-stack", links: [
    { label: "programming tools", id: "programming-tools" }, { label: "programming languages", id: "programming-languages" },
    { label: "frameworks and libraries", id: "frameworks-and-libraries" }, { label: "databases", id: "databases" } ] },
];

export default function MenuPage() {
  const [sel, setSel] = useState<number | null>(null);
  const pick = (i: number) => setSel(sel === i ? null : i);
  const item = sel === null ? null : menu[sel];

  // tells the next page the logo should slide in from the right
  useEffect(() => { markFromMenu(); }, []);

  return (
    <main className="stage">
      <div className="bg" /><StarField /><div className="frame" />
      <ThemeToggle />

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
                <Link href={`${item.href}#${l.id}`}>{l.label}</Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </main>
  );
}