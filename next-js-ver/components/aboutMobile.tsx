"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATS, SKILLS, TOPICS, slug, fadeDown, gx, gy, pop, rise, Spark } from "./aboutShared";

const BULLET = "/svg-icons/bulletStar.svg";
const mInView = { initial: "h", whileInView: "v", viewport: { amount: 0.15 } } as const;
const bulletMask = { "--m": `url(${BULLET})` } as React.CSSProperties;
const open = { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

// ✦——— title ———✦ : lines grow from the title outward, then the stars pop
function MHead({ title }: { title: string }) {
  const side = (s: "l" | "r") => (
    <span className={`mh-rule ${s}`}>
      <motion.i className="mh-line" variants={gx(0.15, 0.6)} />
      <span className="mh-sp"><motion.span style={{ display: "block" }} variants={pop(0.7)}><Spark /></motion.span></span>
    </span>
  );
  return (
    <div className="mh">
      {side("l")}
      <motion.h2 variants={fadeDown(0.3)}>{title}</motion.h2>
      {side("r")}
    </div>
  );
}

// interests / hobbies: bullet rows that open to show their text (one open at a time)
function Bullets({ id, title, items }: { id: string; title: string; items: [string, string][] }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <motion.section id={id} className="msec" {...mInView}>
      <MHead title={title} />
      <ul className="ml">
        {items.map(([name, text], i) => (
          <motion.li key={name} variants={rise(0.9 + i * 0.2)}>
            <button className="mb" aria-expanded={sel === i} onClick={() => setSel(sel === i ? null : i)}>
              <span className="mb-star" style={bulletMask} />
              <span>{name}</span>
            </button>
            <AnimatePresence initial={false}>
              {sel === i && (
                <motion.div key="d" className="md" {...open}>
                  <p>{text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

// stars connect one after another with a line, then the texts fade in one by one
// each star appears together with its text, then a line connects down to the next star
function Chain({ items, start, inner = false }: { items: string[]; start: number; inner?: boolean }) {
  const step = 0.35;
  return (
    <ul className={`ms-list ${inner ? "in" : ""}`}>
      {items.map((s, i) => (
        <li key={s} className="ms-row">
          <span className="ms-col">
            <motion.span className="ms-star" variants={pop(start + i * step)}><Spark /></motion.span>
            {i < items.length - 1 && <motion.i className="ms-line" variants={gy(start + i * step + 0.12, step * 0.8)} />}
          </span>
          <motion.span className="ms-text" variants={rise(start + i * step)}>{s}</motion.span>
        </li>
      ))}
    </ul>
  );
}

function Skills() {
  return (
    <motion.section id="skills" className="msec" {...mInView}>
      <MHead title="skills" />
      <Chain items={SKILLS} start={0.7} />
    </motion.section>
  );
}

// tech stack: each category is a bullet that opens its connected list
function Tech() {
  const [sel, setSel] = useState<number | null>(null);

  // arriving with a #category opens it
  useEffect(() => {
    const k = CATS.findIndex((c) => slug(c.title) === location.hash.slice(1));
    const t = setTimeout(() => { if (k >= 0) setSel(k); }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.section id="tech-stack" className="msec mt" {...mInView}>
      <MHead title="tech stack" />
      <ul className="ml">
        {CATS.map((c, i) => (
          <motion.li key={c.title} id={slug(c.title)} variants={rise(0.9 + i * 0.2)}>
            <button className="mb" aria-expanded={sel === i} onClick={() => setSel(sel === i ? null : i)}>
              <span className="mb-star" style={bulletMask} />
              <span>{c.title}</span>
            </button>
            <AnimatePresence initial={false}>
              {sel === i && (
                <motion.div key="d" className="md" {...open}>
                  <motion.div initial="h" animate="v">
                    <Chain items={c.items.map((m) => m.name)} start={0.3} inner />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

export default function AboutMobile() {
  return (
    <>
      <Bullets id="interests" title="interests" items={TOPICS.interests} />
      <Bullets id="hobbies" title="hobbies" items={TOPICS.hobbies} />
      <Skills />
      <Tech />
    </>
  );
}