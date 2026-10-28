"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Navbar from "@/components/navbar";
import { useHash } from "@/components/useHash";
import { Spark as ListSpark, pop, gy, rise, useMedia } from "@/components/aboutShared";

const SUN = "/svg-icons/sun-icon.svg";
const BULLET = "/svg-icons/bulletStar.svg";
const IDS = ["third-year-project", "capstone", "iot"];
const DEFAULT = 1; // opens on Capstone when there is no #hash. Set to 0 once Third Year Project has content.

type Project = {
  title: string; tag: string; body: string; tools: string[];
  objectives: string[]; role: string[]; status: string; photos: string[];
};

// Chronological: planet 1 = first project (1 star) ... planet 3 = last (3 stars).
const ITEMS: Project[] = [
  // Third Year Project: content removed, fill it in later (same fields as the others)
  { title: "", tag: "Third Year Project", body: "", tools: [], objectives: [], role: [], status: "", photos: [] },
  {
    title: "DC SPACE: AI-driven Event Intelligence Platform for Predictive Crowd Management and Adaptive Event Optimization",
    tag: "Capstone Project",
    body: "DC SPACE is a web-based event intelligence platform designed to improve event management at St. Dominic College of Asia. It integrates event registration and management, RFID-based attendance monitoring, AI-powered event analytics, digital certificate generation, feedback collection, and report generation. The platform aims to help students, faculty, organizers, and administrators manage campus events more efficiently using centralized digital records and data-driven insights.",
    objectives: [
      "Develop an event management system for event creation, registration, participant monitoring, and notifications.",
      "Implement RFID-based attendance monitoring with real-time logs and attendance validation.",
      "Provide AI-powered insights for attendance forecasting, crowd density monitoring, congestion prediction, and event planning.",
      "Automate digital certificate generation and event report preparation based on available event and attendance data.",
      "Evaluate the system's functionality, usability, efficiency, reliability, and user satisfaction.",
    ],
    tools: ["TypeScript", "JavaScript", "Next.js", "React", "Tailwind CSS", "MongoDB", "Gemini AI", "RFID Reader"],
    role: [
      "Designed the user interface and contributed to the overall visual consistency of the platform.",
      "Helped ensure responsive layouts and consistent screen sizing across different devices and screen resolutions.",
      "Reviewed interface functionality and navigation to support a consistent and user-friendly experience.",
      "Contributed to project documentation, including organizing and preparing technical and project-related information.",
    ],
    status: "Under development as an academic capstone project. The platform's features and implementation are being developed and refined as part of the project.",
    // PLACEHOLDER photos: replace these with your own pictures (e.g. "/projects/capstone-1.png")
    photos: ["/certifications/dsdap-cert.png", "/certifications/egov-cert.png", "/certifications/html-css-cert.png", "/certifications/msppt-cert.png"],
  },
  {
    title: "DC Space: A Web-Based IoT Event Attendance Monitoring System Using RFID Technology with Real-Time Monitoring",
    tag: "IoT Project",
    body: "DC Space is a web-based IoT attendance monitoring system designed to make event attendance recording faster, more organized, and more reliable. It uses RFID-enabled school identification cards and a USB-based RFID reader to capture participant information and attendance timestamps. The data is processed through a web application and stored in a cloud-based database, allowing event organizers to monitor attendance records through an online dashboard.",
    objectives: [
      "Automate event attendance recording using RFID-enabled identification cards.",
      "Provide real-time attendance monitoring through a web-based dashboard.",
      "Improve the organization and accuracy of attendance records while reducing manual data entry.",
      "Store attendance data digitally for easier monitoring, retrieval, and reporting.",
      "Help event organizers manage and verify participant attendance more efficiently.",
    ],
    tools: ["TypeScript", "JavaScript", "Next.js", "React", "Tailwind CSS", "MongoDB", "ESP32 Microcontroller", "RFID Reader"],
    role: [
      "Designed the user interface to make attendance information clear, organized, and easy to navigate.",
      "Helped maintain consistent layouts, screen sizes, and responsive behavior across different screen resolutions.",
      "Reviewed interface functionality to support a smooth and consistent user experience.",
      "Contributed to the project's technical documentation, including organizing system information and documenting project components and processes.",
    ],
    status: "Academic Internet of Everything (IoE) project documented in April 2026. The project documentation covers the system design, implementation, testing, results, and recommendations.",
    // PLACEHOLDER photos: replace these with your own pictures
    photos: ["/certifications/msword-cert.png", "/certifications/stardom-cert.png", "/certifications/globalcr-day1-cert.png", "/certifications/stardom-day2-cert.png"],
  },
];

// angles on the left half of the ring (180 = 9 o'clock; smaller = lower, larger = higher)
const ANGLES = [220, 182, 150];
const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
];

const slideR = (d = 0) => ({
  h: { opacity: 0, x: -60 },
  v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
});
// technology pills fade in left -> right, one after another
const pillsWrap = { h: {}, v: { transition: { delayChildren: 0.45, staggerChildren: 0.12 } } };
const chipIn = { h: { opacity: 0, x: -34 }, v: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } };
const fadeUp = { h: { opacity: 0, y: 20 }, v: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);
const ChipIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M12 4Q12.6 11.4 20 12Q12.6 12.6 12 20Q11.4 12.6 4 12Q11.4 11.4 12 4Z" fill="currentColor" />
  </svg>
);

const stars = (n: number) =>
  STAR_POS[n].map(([x, y], k) => (
    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
  ));

/* ---------- pieces of a project page (same on desktop and phone) ---------- */

// each section animates when it scrolls into view
const Sec = ({ children }: { children: React.ReactNode }) => (
  <motion.section className="pj-sec" initial="h" whileInView="v" viewport={{ amount: 0.2 }}>{children}</motion.section>
);

// section title with the star bullet (not a button)
const PHead = ({ title }: { title: string }) => (
  <motion.h2 className="pj-head" variants={slideR(0.05)}>
    <span className="pj-bullet" style={{ "--m": `url(${BULLET})` } as React.CSSProperties} />
    <span>{title}</span>
  </motion.h2>
);

// connected-star list: each text appears together with its star, then a line connects down to the next star
function PList({ items, start = 0.5, step = 0.4 }: { items: string[]; start?: number; step?: number }) {
  return (
    <ul className="pl">
      {items.map((s, i) => (
        <li key={i} className="pl-row">
          <motion.span className="pl-star" variants={pop(start + i * step)}><ListSpark /></motion.span>
          {i < items.length - 1 && <motion.i className="pl-line" variants={gy(start + i * step + 0.12, step * 0.8)} />}
          <motion.span className="pl-text" variants={rise(start + i * step)}>{s}</motion.span>
        </li>
      ))}
    </ul>
  );
}

// swipeable photo slides with arrows + dots
function Slides({ photos }: { photos: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el || el.children.length < 2) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) { setIdx(photos.length - 1); return; }
    const pitch = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    setIdx(Math.min(photos.length - 1, Math.max(0, Math.round(el.scrollLeft / pitch))));
  };
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.min(photos.length - 1, Math.max(0, i));
    el.scrollTo({ left: (el.children[k] as HTMLElement).offsetLeft, behavior: "smooth" });
  };

  return (
    <Sec>
      <motion.div variants={fadeUp}>
        <div className="pj-slides" ref={ref} onScroll={onScroll}>
          {photos.map((src, i) => (
            <div key={src} className="pj-slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Project photo ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>
        <div className="pj-nav">
          <button className="pj-arrow" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous photo">‹</button>
          <div className="pj-dots">
            {photos.map((_, i) => (
              <button key={i} className={`pj-dot ${i === idx ? "on" : ""}`} onClick={() => go(i)} aria-label={`Photo ${i + 1}`} />
            ))}
          </div>
          <button className="pj-arrow" onClick={() => go(idx + 1)} disabled={idx === photos.length - 1} aria-label="Next photo">›</button>
        </div>
      </motion.div>
    </Sec>
  );
}

function ProjectBody({ it }: { it: Project }) {
  return (
    <div className="pj">
      {(it.title || it.body) && (
        <motion.div initial="h" animate="v">
          {it.title && <motion.h1 className="pj-title" variants={slideR(0.1)}>{it.title}</motion.h1>}
          {it.body && <motion.p className="pj-p pj-desc" variants={slideR(0.4)}>{it.body}</motion.p>}
        </motion.div>
      )}

      {it.objectives.length > 0 && (
        <Sec><PHead title="Objectives" /><PList items={it.objectives} /></Sec>
      )}

      {it.tools.length > 0 && (
        <Sec>
          <PHead title="Technologies Used" />
          <motion.ul className="chips" variants={pillsWrap}>
            {it.tools.map((t) => (
              <motion.li key={t} className="chip" variants={chipIn}><ChipIcon /><span>{t}</span></motion.li>
            ))}
          </motion.ul>
        </Sec>
      )}

      {it.role.length > 0 && (
        <Sec><PHead title="My Role and Contributions" /><PList items={it.role} /></Sec>
      )}

      {it.status && (
        <Sec>
          <PHead title="Current Status" />
          <motion.p className="pj-p" variants={slideR(0.3)}>{it.status}</motion.p>
        </Sec>
      )}

      {it.photos.length > 0 && <Slides photos={it.photos} />}
    </div>
  );
}

/* ---------- page ---------- */

export default function ProjectsPage() {
  const mobile = useMedia("(max-width: 700px)");
  const hash = useHash();

  // picked: a planet number, "list" (phone: back to the list), or null (follow the #hash)
  const [picked, setPicked] = useState<number | "list" | null>(null);
  const [seenHash, setSeenHash] = useState(hash);
  if (seenHash !== hash) { setSeenHash(hash); setPicked(null); } // choosing a link in the menu overrides an earlier tap

  const hashIdx = IDS.indexOf(hash);
  const dSel = typeof picked === "number" ? picked : hashIdx >= 0 ? hashIdx : DEFAULT;                        // desktop: always one selected
  const mSel = picked === "list" ? null : typeof picked === "number" ? picked : hashIdx >= 0 ? hashIdx : null; // phone: list until one is chosen
  const it = ITEMS[dSel];
  const mIt = mSel === null ? null : ITEMS[mSel];

  // typing loop for the bottom-right tag (desktop only)
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (mobile !== false) return;
    const t = setTimeout(() => setCycle((c) => c + 1), 500 + ITEMS[dSel].tag.length * 65 + 3500);
    return () => clearTimeout(t);
  }, [dSel, cycle, mobile]);

  return (
    <main className="stage about compact ach proj">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      <Navbar current="projects" />

      {mobile === null ? null : mobile ? (
        /* ================= PHONE ================= */
        <>
          <div className="ach-msun" aria-hidden><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>

          <AnimatePresence mode="wait">
            {mIt === null ? (
              <motion.ul key="list" className="ach-mlist" initial="h" animate="v" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                {ITEMS.map((m, i) => (
                  <motion.li key={m.tag} variants={slideR(0.3 + i * 0.15)}>
                    <button className="ach-mrow" onClick={() => setPicked(i)} aria-label={`Open ${m.tag}`}>
                      <span className="mplanet">{stars(i)}</span>
                      <span>{m.tag}</span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.section key={`d-${mSel}`} className="ach-mdetail" initial="h" animate="v" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                {/* tap the title to go back to the list */}
                <motion.button className="ach-mhead" variants={slideR(0.1)} onClick={() => setPicked("list")} aria-label="Back to the projects list">
                  <span className="mplanet">{stars(0)}</span>
                  <span>{mIt.tag}</span>
                </motion.button>
                <ProjectBody it={mIt} />
              </motion.section>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* ================= DESKTOP ================= */
        <>
          {/* orbit on the right */}
          <motion.div className="proj-orbit" initial={{ x: 240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="ach-sun"><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
            <div className="ach-dash" />
            <div className="ach-solid" />
            <div className="ach-swing">
              {ITEMS.map((m, i) => (
                <div key={m.tag} className="planet-slot" style={{ "--a": `${ANGLES[i]}deg` } as React.CSSProperties}>
                  <span className="planet-anchor">
                    <button className={`planet ${dSel === i ? "on" : ""}`} onClick={() => setPicked(i)}
                      aria-label={`Project ${i + 1}: ${m.tag}`} aria-pressed={dSel === i}>
                      {stars(i)}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* content remounts per planet so the transitions replay */}
          <section key={dSel} className="proj-content">
            <ProjectBody it={it} />
          </section>

          <div className="proj-label">projects</div>
          <div className="proj-tag" key={`${dSel}-${cycle}`}><TypingText text={it.tag} delay={500} speed={65} /></div>
        </>
      )}
    </main>
  );
}