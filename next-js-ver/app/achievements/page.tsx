"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { useHash } from "@/components/useHash";
import { useMedia } from "@/components/aboutShared";

const SUN = "/svg-icons/sun-icon.svg";
const IDS = ["leadership", "competitions", "award", "scholarships", "course-completions"];

type Item = { title: string; role: string; org: string; body?: string; images?: { src: string; alt: string }[] };

const ITEMS: Item[] = [
  {
    title: "Leadership", role: "Event’s Manager", org: "DominiXode 2023-2024",
    body: "I joined an organization named Domini Xode during the school year 2023–2024, where I served as the Events Manager. I was responsible for managing, proposing, and planning events in our department. During that time, I learned how to use my resources and manage my time wisely because I had to prepare for events while studying at the same time. Aside from preparing for the events, we also had to promote them to encourage more people to attend. It was a great experience because I learned many skills, such as teamwork, time management, and attention to detail. I also learned how to balance my responsibilities in the organization with my academic responsibilities.",
  },
  { title: "Competition", role: "2nd Place in Badminton", org: "SDCALYMPICS 2024", body: "As an Information Technology student, I was not very physically active because I spent most of my time in front of my computer, especially when coding or studying. Participating in our school's sports competition motivated me to become more physically active and try something different from my usual routine. Fortunately, I won 2nd place in the badminton competition. This experience taught me the importance of staying active and balancing my academic responsibilities with physical activities." },
  { title: "Award", role: "Dean’s Lister", org: "School Year 2023-2026", body: "I was recognized as a consistent Dean’s Lister from the school years 2023 to 2026. This achievement reflects my dedication to my studies, time management, and commitment to maintaining good academic performance. As an Information Technology student, I had to balance different academic tasks, projects, and other responsibilities while meeting the requirements of my courses. Through this experience, I learned the importance of discipline, perseverance, and hard work. This achievement motivates me to continue improving my skills, gaining new knowledge, and maintaining a strong work ethic in both my academic and professional life." },
  { title: "Scholarship", role: "DBP Scholar", org: "School Year 2023-2027", body: "Knowing that I could maintain good academic performance, I decided to apply for a scholarship. Fortunately, I was granted a scholarship from the Development Bank of the Philippines (DBP). I am truly grateful for this opportunity because it has helped me financially, especially in paying ₱30,000 of my tuition fees. Receiving this scholarship has motivated me to continue working hard in my studies and maintain my academic performance. It has also helped lessen the financial burden of my education and encouraged me to make the most of the opportunities given to me." },
  {
    title: "Course Completions", role: "Cisco Networking Academy", org: "",
    images: [
      { src: "/certifications/networking-basics-badge.png", alt: "Cisco Networking Basics badge" },
      { src: "/certifications/networking-basics.png", alt: "Networking Basics certificate" },
      { src: "/certifications/introduction-to-iot-badge.png", alt: "Introduction to IoT badge" },
      { src: "/certifications/intro-to-iot.png", alt: "Introduction to IoT certificate" },
      { src: "/certifications/cisco-packet-tracker.png", alt: "Cisco Packet Tracer certificate" },
    ],
  },
];

// five planets, 26 degrees apart along the ring (0 = 3 o'clock, negative = up)
const ANGLES = [-62, -36, -10, 16, 42];
const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
  [[0, -1.05], [-1, 0.45], [1, 0.45], [0, 1.05]],
  [[0, -1.05], [1, -0.32], [0.62, 0.85], [-0.62, 0.85], [-1, -0.32]],
];

const slideR = (d = 0) => ({
  h: { opacity: 0, x: -60 },
  v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
});
// course-completion frames fade in left -> right, one after another
const galleryWrap = { h: {}, v: { transition: { delayChildren: 0.5, staggerChildren: 0.18 } } };
const frameIn = { h: { opacity: 0, x: -40 }, v: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
// phone: same fade, but each one gets its own delay so badges and certificates flow as one sequence
const frameAt = (d = 0) => ({ h: { opacity: 0, x: -40 }, v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } });

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

const stars = (n: number) =>
  STAR_POS[n].map(([x, y], k) => (
    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
  ));

export default function AchievementsPage() {
  const mobile = useMedia("(max-width: 700px)");
  const hash = useHash();

  // picked: a planet number, "list" (phone: back to the list), or null (follow the #hash)
  const [picked, setPicked] = useState<number | "list" | null>(null);
  const [seenHash, setSeenHash] = useState(hash);
  if (seenHash !== hash) { setSeenHash(hash); setPicked(null); } // choosing a link in the menu overrides an earlier tap

  const hashIdx = IDS.indexOf(hash);
  const dSel = typeof picked === "number" ? picked : Math.max(0, hashIdx);                                   // desktop: always one selected
  const mSel = picked === "list" ? null : typeof picked === "number" ? picked : hashIdx >= 0 ? hashIdx : null; // phone: list until one is chosen
  const sel = mobile ? mSel : dSel;

  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (sel === null) return;
    const cur = ITEMS[sel];
    const typeMs = 500 + cur.role.length * 65 + 250 + cur.org.length * 55;
    const t = setTimeout(() => setCycle((c) => c + 1), typeMs + 3500);
    return () => clearTimeout(t);
  }, [sel, cycle]);

  const it = ITEMS[dSel];
  const mIt = mSel === null ? null : ITEMS[mSel];
  const badges = mIt?.images?.filter((m) => m.src.includes("badge")) ?? [];
  const certs = mIt?.images?.filter((m) => !m.src.includes("badge")) ?? [];

  return (
    <main className="stage about compact ach">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <Logo />
      <Navbar current="achievements" />

      {mobile === null ? null : mobile ? (
        /* ================= PHONE ================= */
        <>
          {/* sun in the bottom-left corner, still circling */}
          <div className="ach-msun" aria-hidden><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>

          <AnimatePresence mode="wait">
            {mIt === null ? (
              <motion.ul key="list" className="ach-mlist" initial="h" animate="v" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                {ITEMS.map((m, i) => (
                  <motion.li key={m.title} variants={slideR(0.3 + i * 0.15)}>
                    <button className="ach-mrow" onClick={() => setPicked(i)} aria-label={`Open ${m.title}`}>
                      <span className="mplanet">{stars(i)}</span>
                      <span>{m.title}</span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.section key={`d-${mSel}`} className="ach-mdetail" initial="h" animate="v" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                {/* tap the title to go back to the list */}
                <motion.button className="ach-mhead" variants={slideR(0.1)} onClick={() => setPicked("list")} aria-label="Back to the achievements list">
                  <span className="mplanet">{stars(0)}</span>
                  <span>{mIt.title}</span>
                </motion.button>

                <div className="ach-mrole" key={`${mSel}-${cycle}`}>
                  <div className="r1"><TypingText text={mIt.role} delay={500} speed={65} /></div>
                  {mIt.org && <div className="r2"><TypingText text={mIt.org} delay={500 + mIt.role.length * 65 + 250} speed={55} /></div>}
                </div>

                {mIt.body && <motion.p variants={slideR(0.5)}>{mIt.body}</motion.p>}

                {mIt.images && (
                  <div className="ach-mgal">
                    <div className="ach-mbadges">
                      {badges.map((img, k) => (
                        <motion.div key={img.src} variants={frameAt(0.5 + k * 0.18)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.src} alt={img.alt} draggable={false} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="ach-mcerts">
                      {certs.map((img, k) => (
                        <motion.div key={img.src} variants={frameAt(0.5 + (badges.length + k) * 0.18)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.src} alt={img.alt} draggable={false} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* ================= DESKTOP ================= */
        <>
          <motion.div className="ach-orbit" initial={{ x: -240, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="ach-sun"><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
            <div className="ach-dash" />
            <div className="ach-solid" />
            <div className="ach-swing">
              {ITEMS.map((m, i) => (
                <div key={m.title} className="planet-slot" style={{ "--a": `${ANGLES[i]}deg` } as React.CSSProperties}>
                  <span className="planet-anchor">
                    <button className={`planet ${dSel === i ? "on" : ""}`} onClick={() => setPicked(i)}
                      aria-label={`Achievement ${i + 1}: ${m.title}`} aria-pressed={dSel === i}
                      style={{ "--i": i } as React.CSSProperties}>
                      {stars(i)}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.section key={dSel} className="ach-content" initial="h" animate="v">
            <div className="ach-head">
              <motion.h1 variants={slideR(0.1)}>{it.title}</motion.h1>
              <div className="ach-role" key={`${dSel}-${cycle}`}>
                <div className="r1"><TypingText text={it.role} delay={500} speed={65} /></div>
                <div className="r2"><TypingText text={it.org} delay={500 + it.role.length * 65 + 250} speed={55} /></div>
              </div>
            </div>
            {it.body && <motion.p variants={slideR(0.5)}>{it.body}</motion.p>}
            {it.images && (
              <motion.div className="gallery" variants={galleryWrap}>
                {it.images.map((img) => (
                  <motion.div key={img.src} className="frame-card" variants={frameIn}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} draggable={false} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>

          <div className="ach-label">achievements</div>
        </>
      )}
    </main>
  );
}