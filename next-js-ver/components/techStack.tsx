"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CATS, slug, spring, pop, Spark, type Cat } from "./aboutShared";

const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
  [[0, -1.05], [-1, 0.45], [1, 0.45], [0, 1.05]],
];

const STEP = 0.42; // seconds between one item and the next (was 0.85)
const LINE = 0.22; // how long each connecting line takes to draw (was 0.4)

// header animation (plays when the tech stack scrolls into view)
const HS = { h: { scale: 0, opacity: 0 }, v: { scale: 1, opacity: 1, transition: { delay: 1.45, ...spring } } };
const HLINE = { h: { scaleX: 0 }, v: { scaleX: 1, transition: { delay: 0.6, duration: 0.85, ease: "linear" as const } } };
const HTITLE = { h: { opacity: 0, y: 28 }, v: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

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
  const total = 0.7 + c.title.length * 0.06 + (c.items.length - 1) * STEP + 1.0;

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
                variants={{ h: { pathLength: 0, opacity: 0 }, v: { pathLength: 1, opacity: 0.75, transition: { delay: t0 + (i + 1) * STEP, duration: LINE, ease: "easeInOut" } } }} />
            );
          })}
        </svg>
        {c.items.map((m, i) => {
          const d = t0 + i * STEP;
          const dir = m.x < 50 ? -28 : 28; // left-placed names fade in from the left, right-placed from the right
          return (
            <div key={m.name} className={`tk-item ${m.below ? "below" : ""}`} style={{ left: `${m.x}%`, top: `${m.y}%` }}>
              <motion.span className="tk-star" variants={pop(d + 0.2)}><Spark /></motion.span>
              <motion.span className="tk-name"
                variants={{ h: { opacity: 0, x: dir }, v: { opacity: 1, x: 0, transition: { delay: d + 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
                {m.name}
              </motion.span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function TechStack() {
  const wrap = useRef<HTMLElement>(null);
  const go = useInView(wrap, { once: true, margin: "0px 0px -25% 0px" }); // starts when it scrolls into view
  const [headerDone, setHeaderDone] = useState(false);
  const [done, setDone] = useState(0); // how many categories have fully finished their first run
  const finish = useCallback((i: number) => setDone((d) => Math.max(d, i + 1)), []);

  useEffect(() => {
    if (!go) return;
    const t = setTimeout(() => setHeaderDone(true), 1900);
    return () => clearTimeout(t);
  }, [go]);

  // arriving with a #category: skip the sequence order so it plays right away
  useEffect(() => {
    const id = location.hash.slice(1);
    const k = CATS.findIndex((c) => slug(c.title) === id);
    const t = setTimeout(() => { if (k >= 0) { setHeaderDone(true); if (k > 0) setDone(k); } }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={wrap} id="tech-stack" className="tk-wrap">
      <motion.div className="tk-head" initial="h" animate={go ? "v" : "h"}>
        <motion.span className="tk-hs" variants={HS}><Spark /></motion.span>
        <motion.span className="tk-line l" variants={HLINE} />
        <motion.h1 variants={HTITLE}>tech stack</motion.h1>
        <motion.span className="tk-line r" variants={HLINE} />
        <motion.span className="tk-hs" variants={HS}><Spark /></motion.span>
      </motion.div>
      {CATS.map((c, i) => (
        <Section key={c.title} c={c} index={i} unlocked={headerDone && done >= i} onDone={finish} />
      ))}
    </section>
  );
}