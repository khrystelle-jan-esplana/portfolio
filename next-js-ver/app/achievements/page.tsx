"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";

const SUN = "/svg-icons/sun-icon.svg";
const NAV: [string, string][] = [["about me", "/about"], ["achievements", "/achievements"], ["certifications", "/menu"], ["projects", "/menu"], ["tech stack", "/menu"]];

// Chronological order: planet 1 = first item (1 star) ... planet 4 = last item (4 stars).
// EDIT: replace items 2-4 with your real achievements.
const ITEMS = [
  {
    title: "Leadership", role: "Event’s Manager", org: "DominiXode 2023-2024",
    body: "I joined an organization named Domini Xode during the school year 2023–2024, where I served as the Events Manager. I was responsible for managing, proposing, and planning events in our department. During that time, I learned how to use my resources and manage my time wisely because I had to prepare for events while studying at the same time. Aside from preparing for the events, we also had to promote them to encourage more people to attend. It was a great experience because I learned many skills, such as teamwork, time management, and attention to detail. I also learned how to balance my responsibilities in the organization with my academic responsibilities.",
  },
  { title: "Achievement two", role: "Role here", org: "Organization year", body: "Write about it here." },
  { title: "Achievement three", role: "Role here", org: "Organization year", body: "Write about it here." },
  { title: "Achievement four", role: "Role here", org: "Organization year", body: "Write about it here." },
];

const ANGLES = [-50, -18, 15, 45]; // where each planet sits on the circle (degrees from 3 o'clock)
// star positions around a planet, by star count (x, y in -1..1)
const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
  [[0, -1.05], [-1, 0.45], [1, 0.45], [0, 1.05]],
];

const slideR = (d = 0) => ({
  h: { opacity: 0, x: -60 },
  v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
});

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

export default function AchievementsPage() {
  const [sel, setSel] = useState(0);
  const it = ITEMS[sel];

  return (
    <main className="stage about compact ach">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      <motion.nav className="nav" initial={{ opacity: 0, x: 140 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        {NAV.map(([n, h]) => <Link key={n} href={h} className={n === "achievements" ? "on" : ""}>{n}</Link>)}
      </motion.nav>

      {/* orbit on the left: sun + dashed circle spin, planets swing around the solid circle */}
      <motion.div className="ach-orbit" initial={{ x: -240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="ach-sun"><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
        <div className="ach-dash" />
        <div className="ach-solid" />
        <div className="ach-swing">
          {ITEMS.map((m, i) => (
            <div key={m.title} className="planet-slot" style={{ "--a": `${ANGLES[i]}deg` } as React.CSSProperties}>
              <button className={`planet ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}
                aria-label={`Achievement ${i + 1}: ${m.title}`} aria-pressed={sel === i}>
                {STAR_POS[i].map(([x, y], k) => (
                  <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
                ))}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* content: remounts per planet so the transitions replay */}
      <motion.section key={sel} className="ach-content" initial="h" animate="v">
        <div className="ach-head">
          <motion.h1 variants={slideR(0.1)}>{it.title}</motion.h1>
          <div className="ach-role">
            <div className="r1"><TypingText text={it.role} delay={500} speed={65} /></div>
            <div className="r2"><TypingText text={it.org} delay={500 + it.role.length * 65 + 250} speed={55} /></div>
          </div>
        </div>
        <motion.p variants={slideR(0.5)}>{it.body}</motion.p>
      </motion.section>

      <div className="ach-label">achievements</div>
    </main>
  );
}