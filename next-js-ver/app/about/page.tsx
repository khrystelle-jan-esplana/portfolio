"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";

const SUN = "/svg-icons/sun-icon.svg";
// Only "about me" exists so far; the others point back to the menu until you build them.
const NAV: [string, string][] = [["about me", "/about"], ["achievements", "/menu"], ["certifications", "/menu"], ["projects", "/menu"], ["tech stack", "/menu"]];

const TOPICS: Record<"interests" | "hobbies", [string, string][]> = {
  interests: [
    ["volunteering", "Recently, I have taken interest in volunteering. With what is happening around the country right now, as a citizen, I want to help as I can even just a little bit."],
    ["hiking", "I’ve always been to the beach when it comes to going on vacation which is why now, I have an interest in hiking especially as it encourages being physically active."],
    ["learning new languages", "I believe that learning new languages can be a good advantage especially when travelling. To add, I also think it would be great to interact with people with different languages. ♡"],
    ["stargazing", "As a kid, I have always been fascinated by the stars much more knowing their names. It feels like I'm closer to them which is why I’m interested in knowing more about constellations."],
  ],

  hobbies: [
    ["listening to music", "Listening to music has always been relaxing which is why it became a hobby of mine to create playlist and learn new songs."], ["cleaning the house", "It has become a hobby of mine to clean the house even though I am tired. I can’t stand seeing my house not cleaned especially if we have visitors."],
    ["cooking", "As the eldest daughter, my parents taught me to cook our meals that it became a hobby of mine to cook meals as well as learning to cook something new to me."], ["swimming", "Ever since I was a child, we have been going to the beach every summer which is why every now and then, it became a hobby to always swim in the ocean and the pool."],
  ],
};
const SKILLS = ["attention to detail", "teamwork & collaboration", "communication", "adaptable", "visual design awareness", "continuous learning"];

// ---- animation helpers (variants "h" = hidden, "v" = visible) ----
const fadeDown = (d = 0) => ({ h: { opacity: 0, y: -26 }, v: { opacity: 1, y: 0, transition: { delay: d, duration: 0.8 } } });
const pop = (d = 0) => ({ h: { scale: 0, opacity: 0 }, v: { scale: 1, opacity: 1, transition: { delay: d, type: "spring" as const, stiffness: 240, damping: 13 } } });
const gx = (d = 0, t = 0.7) => ({ h: { scaleX: 0 }, v: { scaleX: 1, transition: { delay: d, duration: t, ease: "linear" as const } } });
const gy = (d = 0, t = 0.7) => ({ h: { scaleY: 0 }, v: { scaleY: 1, transition: { delay: d, duration: t, ease: "linear" as const } } });
const inView = { initial: "h", whileInView: "v", viewport: { amount: 0.2 } } as const;
const Spark = () => (
  <svg className="spark" viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);
const Sun = () => <span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} />;

function TypeOnView({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  return (
    <motion.span style={{ display: "inline-block" }} onViewportEnter={() => setOn(true)} onViewportLeave={() => setOn(false)}>
      {on ? <TypingText text={text} speed={110} /> : "\u00a0"}
    </motion.span>
  );
}

function Topics() {
  const [mode, setMode] = useState<"interests" | "hobbies">("interests");
  const t = TOPICS[mode];
  const Item = ({ i, d }: { i: number; d: number }) => (
    <div className="item">
      <motion.h3 variants={fadeDown(d)}>{t[i][0]}</motion.h3>
      <motion.p variants={fadeDown(d + 0.2)}>{t[i][1]}</motion.p>
    </div>
  );
  return (
    <section id="interests" className="sec">
      <span id="hobbies" />
      <motion.div key={mode} className="ih" {...inView}>
        <div className="row">
          <Item i={0} d={0.9} />
          <motion.span className="vl up" variants={gy(0.1)}><Spark /></motion.span>
          <Item i={1} d={1.1} />
        </div>
        <div className="mid">
          <motion.span className="hl l" variants={gx(0.1)}><Spark /></motion.span>
          <motion.button className="ih-title" variants={fadeDown(0.3)} onClick={() => setMode(mode === "interests" ? "hobbies" : "interests")}
            aria-label={`Showing ${mode}. Switch to ${mode === "interests" ? "hobbies" : "interests"}`}>{mode}</motion.button>
          <motion.span className="hl r" variants={gx(0.1)}><Spark /></motion.span>
        </div>
        <div className="row">
          <Item i={2} d={1.3} />
          <motion.span className="vl dn" variants={gy(0.1)}><Spark /></motion.span>
          <Item i={3} d={1.5} />
        </div>
      </motion.div>
    </section>
  );
}

const at = (r: number, c: number, span = 1) => ({ gridRow: r, gridColumn: `${c} / span ${span}` });
// [label, star row, column, delay]
const NODES: [string, number, number, number][] = [
  [SKILLS[0], 2, 1, 0.4], [SKILLS[1], 2, 2, 0.9], [SKILLS[2], 2, 3, 1.4], [SKILLS[3], 2, 4, 1.9],
  [SKILLS[4], 4, 3, 3.1], [SKILLS[5], 4, 4, 2.6],
];

export default function AboutPage() {
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 1300);
  }, []);

  return (
    <main className="stage about compact">
      <div className="bg" /><StarField count={220} />
      <ThemeToggle />
      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      <motion.nav className="nav" initial={{ opacity: 0, x: 140 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        {NAV.map(([n, h]) => <Link key={n} href={h} className={n === "about me" ? "on" : ""}>{n}</Link>)}
      </motion.nav>

      <div className="scroller">
        <section id="introduction" className="sec intro">
          <div className="cloud-wrap">
              <svg className="cloud" viewBox="0 0 600 260" aria-hidden>
                <defs>
                    <filter id="cb" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
                </defs>
                <g filter="url(#cb)">
                    <circle cx="140" cy="152" r="62" /><circle cx="215" cy="102" r="72" />
                    <circle cx="312" cy="84" r="82" /><circle cx="412" cy="108" r="70" />
                    <circle cx="482" cy="152" r="58" />
                    <rect x="105" y="130" width="410" height="92" rx="46" />
                </g>
            </svg>
            <svg className="myname" viewBox="0 0 300 110" aria-hidden>
              <path id="arc" d="M10 100 Q45 28 180 12" fill="none" />
              <text><textPath href="#arc">my name is</textPath></text>
            </svg>
            <h1 className="bigname"><TypeOnView text="khrystelle" /></h1>
          </div>

          <h2 className="tagline">
            <span className="tag-wrap">
              <TypingText text={"keeping it cute and\noperational"} delay={600} speed={70} />
              <span className="tag-ic smile"><span className="mask" style={{ "--m": "url(/svg-icons/emoji-happy.svg)" } as React.CSSProperties} /></span>
              <span className="tag-ic cup"><span className="mask" style={{ "--m": "url(/svg-icons/coffee.svg)" } as React.CSSProperties} /></span>
            </span>
          </h2>

          <motion.div className="card-wrap" {...inView}>
            <div className="sun-wrap l"><motion.div variants={pop(1.2)}><Sun /></motion.div></div>
            <div className="sun-wrap r"><motion.div variants={pop(1.4)}><Sun /></motion.div></div>
            <motion.div className="card" variants={fadeDown(0)}>
              <motion.h2 className="card-title" variants={fadeDown(0.3)}>about me</motion.h2>
              <motion.p variants={fadeDown(0.6)}>I am an Information Technology 4th year student with experience in developing websites and applications, along with a strong interest in understanding how software and systems work. I enjoy exploring new technologies, solving technical problems, and continuously improving my skills.</motion.p>
              <motion.p variants={fadeDown(0.8)}>My career goal is to begin as a System Administrator, where I can develop my expertise in system management, network administration, and technical troubleshooting. In the future, I also aspire to pursue Quality Assurance (QA), focusing on software reliability, functionality, and overall user experience.</motion.p>
              <motion.p variants={fadeDown(1)}>I believe that technology should not only be functional but also reliable and efficient. As I continue to grow in the IT field, I aim to build a strong technical foundation, gain practical experience, and contribute to developing and maintaining technology that people can depend on.</motion.p>
            </motion.div>
          </motion.div>
        </section>

        <Topics />

        <section id="skills" className="sec">
          <motion.div className="card skills-card" variants={fadeDown(0)} {...inView}>
            {["tl", "tr", "bl", "br"].map((c, i) => (
              <motion.span key={c} className={`corner ${c}`} variants={pop(0.8 + i * 0.4)}><Sun /></motion.span>
            ))}
            <motion.h2 className="card-title" variants={fadeDown(0.3)}>skills</motion.h2>
            <div className="sk-grid">
              <motion.span className="sk-line" style={{ ...at(2, 1, 4), margin: "0 12.5%", transformOrigin: "0 50%" }} variants={gx(0.4, 1.5)} />
              <motion.span className="sk-line v" style={{ gridRow: "2 / 5", gridColumn: 4, margin: "1.3rem 0", transformOrigin: "50% 0" }} variants={gy(1.9, 0.7)} />
              <motion.span className="sk-line" style={{ ...at(4, 3, 2), margin: "0 25%", transformOrigin: "100% 50%" }} variants={gx(2.6, 0.5)} />
              {NODES.map(([label, r, c, d]) => (
                <span key={label} style={{ display: "contents" }}>
                  <motion.span className={`sk-label ${r === 2 ? "top" : "bot"}`} style={at(r === 2 ? 1 : 5, c)} variants={pop(d)}>{label}</motion.span>
                  <motion.span className="sk-star" style={at(r, c)} variants={pop(d)}><Spark /></motion.span>
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}