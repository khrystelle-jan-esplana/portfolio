"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Navbar from "@/components/navbar";

const SUN = "/svg-icons/sun-icon.svg";

// Chronological: planet 1 = first project (1 star) ... planet 3 = last (3 stars).
const ITEMS = [
  {
    title: "M.I.G.S Tambayan: Seafarer Job and Networking Platform",
    tag: "M.I.G.S",
    body: "M.I.G.S Tambayan is a mobile application designed to connect seafarers with job opportunities and people looking to hire seafarers. It provides a platform where users can create profiles, showcase their qualifications, and share their professional information. The app aims to make job searching and recruitment within the maritime industry more accessible and convenient. It focuses on helping seafarers connect with opportunities that match their skills and experience.",
    tools: ["Dart", "Flutter", "Android Studio", "MongoDB", "Firebase", "Android Emulator"],
  },
  {
    title: "DC SPACE: AI-driven Event Intelligence Platform for Predictive Crowd Management and Adaptive Event Optimization",
    tag: "Capstone Project",
    body: "DC SPACE is an AI-powered web platform designed to improve event management at St. Dominic College of Asia. It uses RFID technology to track attendance in real time and help prevent duplicate or fraudulent records. Its AI features predict attendance, monitor crowd density, identify possible congestion, and generate event insights. It also includes event registration, digital certificates, feedback, and notifications to make event planning more efficient.",
    tools: ["TypeScript", "JavaScript", "Next.js", "React", "Tailwind CSS", "MongoDB", "Gemini AI", "RFID Reader"],
  },
  {
    title: "DC Space: A Web-Based IoT Event Attendance Monitoring System Using RFID Technology with Real-Time Monitoring",
    tag: "IoT Project",
    body: "DC Space is an IoT-based attendance monitoring system that uses an ESP32 microcontroller and RFID technology to scan student IDs and record event attendance. It transmits attendance data to a web-based platform for secure storage and real-time monitoring. The system features an admin dashboard for viewing attendance records and tracking participant activity, helping reduce manual work and improve accuracy.",
    tools: ["TypeScript", "JavaScript", "Next.js", "React", "Tailwind CSS", "MongoDB", "ESP32 Microcontroller", "RFID Reader"],
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
// tools fade in left -> right, one after another
const chipsWrap = { h: {}, v: { transition: { delayChildren: 0.9, staggerChildren: 0.13 } } };
const chipIn = { h: { opacity: 0, x: -34 }, v: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } };

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);
const ChipIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M12 4Q12.6 11.4 20 12Q12.6 12.6 12 20Q11.4 12.6 4 12Q11.4 11.4 12 4Z" fill="currentColor" />
  </svg>
);

export default function ProjectsPage() {
  const [sel, setSel] = useState(0);
  const it = ITEMS[sel];

  // typing loop for the bottom-right tag
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setCycle((c) => c + 1), 500 + ITEMS[sel].tag.length * 65 + 3500);
    return () => clearTimeout(t);
  }, [sel, cycle]);

  return (
    <main className="stage about compact ach proj">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      <Navbar current="projects" />

      {/* orbit on the right */}
      <motion.div className="proj-orbit" initial={{ x: 240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="ach-sun"><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
        <div className="ach-dash" />
        <div className="ach-solid" />
        <div className="ach-swing">
          {ITEMS.map((m, i) => (
            <div key={m.tag} className="planet-slot" style={{ "--a": `${ANGLES[i]}deg` } as React.CSSProperties}>
              <span className="planet-anchor">
                <button className={`planet ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}
                  aria-label={`Project ${i + 1}: ${m.tag}`} aria-pressed={sel === i}>
                  {STAR_POS[i].map(([x, y], k) => (
                    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
                  ))}
                </button>
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* content remounts per planet so the transitions replay */}
      <motion.section key={sel} className="proj-content" initial="h" animate="v">
        <motion.h1 variants={slideR(0.1)}>{it.title}</motion.h1>
        <motion.p variants={slideR(0.4)}>{it.body}</motion.p>
        <motion.ul className="chips" variants={chipsWrap}>
          {it.tools.map((t) => (
            <motion.li key={t} className="chip" variants={chipIn}><ChipIcon /><span>{t}</span></motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <div className="proj-label">projects</div>
      <div className="proj-tag" key={`${sel}-${cycle}`}><TypingText text={it.tag} delay={500} speed={65} /></div>
    </main>
  );
}