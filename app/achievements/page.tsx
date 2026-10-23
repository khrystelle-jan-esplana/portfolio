"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Navbar from "@/components/navbar"; 

const SUN = "/svg-icons/sun-icon.svg";

const ITEMS = [
  {
    title: "Leadership", role: "Event’s Manager", org: "DominiXode 2023-2024",
    body: "I joined an organization named Domini Xode during the school year 2023–2024, where I served as the Events Manager. I was responsible for managing, proposing, and planning events in our department. During that time, I learned how to use my resources and manage my time wisely because I had to prepare for events while studying at the same time. Aside from preparing for the events, we also had to promote them to encourage more people to attend. It was a great experience because I learned many skills, such as teamwork, time management, and attention to detail. I also learned how to balance my responsibilities in the organization with my academic responsibilities.",
  },
  { title: "Competition", role: "2nd Place in Badminton", org: "SDCALYMPICS 2024", body: "As an Information Technology student, I was not very physically active because I spent most of my time in front of my computer, especially when coding or studying. Participating in our school's sports competition motivated me to become more physically active and try something different from my usual routine. Fortunately, I won 2nd place in the badminton competition. This experience taught me the importance of staying active and balancing my academic responsibilities with physical activities." },
  { title: "Award", role: "Dean’s Lister", org: "School Year 2023-2026", body: "I was recognized as a consistent Dean’s Lister from the school years 2023 to 2026. This achievement reflects my dedication to my studies, time management, and commitment to maintaining good academic performance. As an Information Technology student, I had to balance different academic tasks, projects, and other responsibilities while meeting the requirements of my courses. Through this experience, I learned the importance of discipline, perseverance, and hard work. This achievement motivates me to continue improving my skills, gaining new knowledge, and maintaining a strong work ethic in both my academic and professional life." },
  { title: "Scholarship", role: "DBP Scholar", org: "School Year 2023-2027", body: "Knowing that I could maintain good academic performance, I decided to apply for a scholarship. Fortunately, I was granted a scholarship from the Development Bank of the Philippines (DBP). I am truly grateful for this opportunity because it has helped me financially, especially in paying ₱30,000 of my tuition fees. Receiving this scholarship has motivated me to continue working hard in my studies and maintain my academic performance. It has also helped lessen the financial burden of my education and encouraged me to make the most of the opportunities given to me." },
];

const ANGLES = [-50, -18, 15, 45];
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
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const cur = ITEMS[sel];
    const typeMs = 500 + cur.role.length * 65 + 250 + cur.org.length * 55;
    const t = setTimeout(() => setCycle((c) => c + 1), typeMs + 3500);
    return () => clearTimeout(t);
  }, [sel, cycle]);

  return (
    <main className="stage about compact ach">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      
      {/* NEW SHARED NAVBAR */}
      <Navbar current="achievements" />

      <motion.div className="ach-orbit" initial={{ x: -240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="ach-sun"><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
        <div className="ach-dash" />
        <div className="ach-solid" />
        <div className="ach-swing">
          {ITEMS.map((m, i) => (
            <div key={m.title} className="planet-slot" style={{ "--a": `${ANGLES[i]}deg` } as React.CSSProperties}>
              <span className="planet-anchor">
                <button className={`planet ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}
                  aria-label={`Achievement ${i + 1}: ${m.title}`} aria-pressed={sel === i}
                  style={{ "--i": i } as React.CSSProperties}>
                  {STAR_POS[i].map(([x, y], k) => (
                    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
                  ))}
                </button>
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.section key={sel} className="ach-content" initial="h" animate="v">
        <div className="ach-head">
          <motion.h1 variants={slideR(0.1)}>{it.title}</motion.h1>
          <div className="ach-role" key={`${sel}-${cycle}`}>
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