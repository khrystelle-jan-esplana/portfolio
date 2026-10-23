"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import StarField from "@/next-js-ver/components/starField";
import ThemeToggle from "@/next-js-ver/components/themeToggle";
import Navbar from "@/next-js-ver/components/navbar";
import Logo from "@/next-js-ver/components/logo";

type Item = { name: string; x: number; y: number; below?: boolean };
type Cat = { title: string; side: "left" | "right"; stars: number; ar: number; items: Item[] };

// x / y are percentages of each box. Items appear and connect in the order listed.
const CATS: Cat[] = [
  { title: "Programming Tools", side: "left", stars: 1, ar: 0.42, items: [
    { name: "Visual Studio Code", x: 53, y: 6 }, { name: "Apache NetBeans", x: 33, y: 30 }, { name: "Android Studio", x: 8, y: 24 },
    { name: "Oracle APEX", x: 21, y: 94 }, { name: "Git", x: 44, y: 54 }, { name: "GitHub", x: 55, y: 80 },
    { name: "Postman", x: 67, y: 26 }, { name: "Node.js", x: 70, y: 56 }, { name: "Render", x: 88, y: 42 }, { name: "Figma", x: 80, y: 84 },
  ] },
  { title: "Programming Languages", side: "right", stars: 2, ar: 0.36, items: [
    { name: "Java", x: 47, y: 8 }, { name: "C", x: 18, y: 14 }, { name: "JavaScript", x: 11, y: 76 }, { name: "TypeScript", x: 35, y: 50 },
    { name: "HTML", x: 69, y: 31 }, { name: "CSS", x: 81, y: 64 }, { name: "Dart", x: 61, y: 93 },
  ] },
  { title: "Frameworks and Libraries", side: "left", stars: 3, ar: 0.26, items: [
    { name: "React", x: 16, y: 10 }, { name: "Next.js", x: 27, y: 83 }, { name: "Flutter", x: 44, y: 12 },
    { name: "Tailwind CSS", x: 59, y: 89 }, { name: "Bootstrap", x: 71, y: 12 },
  ] },
  { title: "Databases", side: "right", stars: 4, ar: 0.17, items: [
    { name: "Mongo DB", x: 78, y: 20, below: true }, { name: "Firebase", x: 60, y: 55, below: true },
  ] },
];

const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
  [[0, -1.05], [-1, 0.45], [1, 0.45], [0, 1.05]],
];

const STEP = 0.85; // seconds between one item and the next
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const spring = { type: "spring" as const, stiffness: 240, damping: 13 };
const pop = (d = 0) => ({ h: { scale: 0, opacity: 0 }, v: { scale: 1, opacity: 1, transition: { delay: d, ...spring } } });

const Spark = () => (
  <svg className="spark" viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

// Types a title. from="right": letters appear at the right edge and the text grows leftward.
function TypeIn({ text, from, delay = 300, speed = 60 }: { text: string; from: "left" | "right"; delay?: number; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => setN((c) => (c >= text.length ? (clearInterval(iv), c) : c + 1)), speed);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay, speed]);
  return <>{from === "right" ? text.slice(text.length - n) : text.slice(0, n)}</>;
}

function Section({ c, index, unlocked, onDone }: { c: Cat; index: number; unlocked: boolean; onDone: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [started, setStarted] = useState(false); // first run begun (needs: previous category finished + on screen)
  const [played, setPlayed] = useState(false);   // first run fully finished
  if (!started && unlocked && inView) setStarted(true);

  // first run: plays to the end even if you scroll away. Later: replays the subcategories every time they scroll into view.
  const show = played ? inView : started;
  const t0 = played ? 0.2 : 0.7 + c.title.length * 0.06; // first run waits for the title to finish typing
  const total = 0.7 + c.title.length * 0.06 + (c.items.length - 1) * STEP + 1.4;

  useEffect(() => {
    if (!started || played) return;
    const t = setTimeout(() => { setPlayed(true); onDone(index); }, total * 1000);
    return () => clearTimeout(t);
  }, [started, played, total, onDone, index]);

  const planetStars = STAR_POS[c.stars - 1].map(([x, y], k) => (
    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
  ));

  return (
    <motion.section ref={ref} id={slug(c.title)} className={`tk-sec ${c.side}`} initial="h" animate={show ? "v" : "h"}>
      <div className="tk-title">
        {/* title + planet animate only on the first run; afterwards they stay put */}
        {played ? <span className="tp">{planetStars}</span> : <motion.span className="tp" variants={pop(0)}>{planetStars}</motion.span>}
        <h2>{played ? c.title : started ? <TypeIn text={c.title} from={c.side} /> : "\u00a0"}</h2>
      </div>

      <div className="tk-box" style={{ aspectRatio: `1 / ${c.ar}` }}>
        <svg className="tk-lines" viewBox={`0 0 100 ${c.ar * 100}`} aria-hidden>
          {c.items.slice(1).map((m, i) => {
            const p = c.items[i];
            return (
              <motion.line key={m.name} x1={p.x} y1={p.y * c.ar} x2={m.x} y2={m.y * c.ar}
                variants={{ h: { pathLength: 0, opacity: 0 }, v: { pathLength: 1, opacity: 0.75, transition: { delay: t0 + (i + 1) * STEP, duration: 0.4, ease: "easeInOut" } } }} />
            );
          })}
        </svg>
        {c.items.map((m, i) => {
          const d = t0 + i * STEP;
          const dir = m.x < 50 ? -28 : 28; // left-placed names fade in from the left, right-placed from the right
          return (
            <div key={m.name} className={`tk-item ${m.below ? "below" : ""}`} style={{ left: `${m.x}%`, top: `${m.y}%` }}>
              <motion.span className="tk-star" variants={pop(d + 0.3)}><Spark /></motion.span>
              <motion.span className="tk-name"
                variants={{ h: { opacity: 0, x: dir }, v: { opacity: 1, x: 0, transition: { delay: d + 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}>
                {m.name}
              </motion.span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function TechStackPage() {
  const [headerDone, setHeaderDone] = useState(false);
  const [done, setDone] = useState(0); // how many categories have fully finished their first run
  const finish = useCallback((i: number) => setDone((d) => Math.max(d, i + 1)), []);

  useEffect(() => {
    const t = setTimeout(() => setHeaderDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  // arriving from the menu with a #category: skip the sequence order and scroll there
  useEffect(() => {
    const id = location.hash.slice(1);
    const k = CATS.findIndex((c) => slug(c.title) === id);
    const t1 = setTimeout(() => { if (k > 0) setDone(k); }, 0);
    const t2 = setTimeout(() => {
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main className="stage about compact ach tech">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <Logo />
      <Navbar current="tech stack" />

      <div className="scroller">
        <div className="tk-wrap">
          <div className="tk-head">
            <motion.span className="tk-hs" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.45, ...spring }}><Spark /></motion.span>
            <motion.span className="tk-line l" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.85, ease: "linear" }} />
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>tech stack</motion.h1>
            <motion.span className="tk-line r" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.85, ease: "linear" }} />
            <motion.span className="tk-hs" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.45, ...spring }}><Spark /></motion.span>
          </div>
          {CATS.map((c, i) => (
            <Section key={c.title} c={c} index={i} unlocked={headerDone && done >= i} onDone={finish} />
          ))}
        </div>
      </div>
    </main>
  );
}