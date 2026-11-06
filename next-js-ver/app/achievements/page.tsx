"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { useHash } from "@/components/useHash";
import { useMedia } from "@/components/aboutShared";

const SUN = "/svg-icons/sun-icon.svg";
const IDS = ["leadership", "competitions", "award", "scholarships", "course-completions", "toeic"];

type Photo = { src: string; alt: string };
type Item = { title: string; role: string; org: string; body?: string; images?: Photo[]; photos?: Photo[] };

const ITEMS: Item[] = [
  {
    title: "Leadership", role: "Event’s Manager", org: "DominiXode 2023-2024",
    body: "I joined an organization named Domini Xode during the school year 2023–2024, where I served as the Events Manager. I was responsible for managing, proposing, and planning events in our department. During that time, I learned how to use my resources and manage my time wisely because I had to prepare for events while studying at the same time. Aside from preparing for the events, we also had to promote them to encourage more people to attend. It was a great experience because I learned many skills, such as teamwork, time management, and attention to detail. I also learned how to balance my responsibilities in the organization with my academic responsibilities.",
    photos: [1, 2, 3, 4].map((n) => ({ src: `/achievements/dominixode-img${n}.jpg`, alt: `DominiXode event photo ${n}` })),
  },
  {
    title: "Competition", role: "2nd Place in Badminton", org: "SDCALYMPICS 2024",
    body: "As an Information Technology student, I was not very physically active because I spent most of my time in front of my computer, especially when coding or studying. Participating in our school's sports competition motivated me to become more physically active and try something different from my usual routine. Fortunately, I won 2nd place in the badminton competition. This experience taught me the importance of staying active and balancing my academic responsibilities with physical activities.",
    photos: [{ src: "/achievements/competition-img1.jpg", alt: "SDCALYMPICS badminton photo" }],
  },
  {
    title: "Award", role: "Dean’s Lister", org: "School Year 2023-2026",
    body: "I was recognized as a consistent Dean’s Lister from the school years 2023 to 2026. This achievement reflects my dedication to my studies, time management, and commitment to maintaining good academic performance. As an Information Technology student, I had to balance different academic tasks, projects, and other responsibilities while meeting the requirements of my courses. Through this experience, I learned the importance of discipline, perseverance, and hard work. This achievement motivates me to continue improving my skills, gaining new knowledge, and maintaining a strong work ethic in both my academic and professional life.",
    photos: [1, 2].map((n) => ({ src: `/achievements/deans-list-img${n}.jpg`, alt: `Dean’s List photo ${n}` })),
  },
  {
    title: "Scholarship", role: "DBP Scholar", org: "School Year 2023-2027",
    body: "Knowing that I could maintain good academic performance, I decided to apply for a scholarship. Fortunately, I was granted a scholarship from the Development Bank of the Philippines (DBP). I am truly grateful for this opportunity because it has helped me financially, especially in paying ₱30,000 of my tuition fees. Receiving this scholarship has motivated me to continue working hard in my studies and maintain my academic performance. It has also helped lessen the financial burden of my education and encouraged me to make the most of the opportunities given to me.",
    photos: [
      { src: "/achievements/dbp-img1.jpg", alt: "DBP scholarship photo 1" },
      { src: "/achievements/dbp-img2.jpeg", alt: "DBP scholarship photo 2" },
    ],
  },
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
  {
    title: "TOEIC", role: "TOEIC Examination", org: "April 11, 2024",
    body: "I took my TOEIC (Test of English for International Communication) examination on April 11, 2024, during my first year in college. I felt satisfied and proud when I received a high score because it served as a confirmation of my ability to understand and communicate effectively in English. It also gave me more confidence in using the language, especially in situations where proper communication is important. English plays a significant role in academic and professional settings, such as delivering class presentations, participating in discussions, communicating with different people, and attending formal events like job interviews. Through this experience, I realized that having good English communication skills is not only important for academic performance but also an advantage when preparing for future career opportunities. Overall, the examination helped me recognize my strengths in English while encouraging me to continue improving my communication skills.",
    photos: [{ src: "/achievements/toeic-img1.jpg", alt: "TOEIC result photo" }],
  },
];

// six planets, 26 degrees apart along the ring (0 = 3 o'clock, negative = up)
const ANGLES = [-75, -49, -23, 3, 29, 55];
const STAR_POS: number[][][] = [
  [[0.6, -0.8]],
  [[0.1, -1], [0.95, 0.45]],
  [[0.05, -1], [-0.95, 0.4], [0.95, 0.4]],
  [[0, -1.05], [-1, 0.45], [1, 0.45], [0, 1.05]],
  [[0, -1.05], [1, -0.32], [0.62, 0.85], [-0.62, 0.85], [-1, -0.32]],
  [[0, -1.05], [0.95, -0.5], [0.95, 0.5], [0, 1.05], [-0.95, 0.5], [-0.95, -0.5]],
];

const slideR = (d = 0) => ({
  h: { opacity: 0, x: -60 },
  v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
});
// course-completion frames fade in left -> right, one after another
const galleryWrap = { h: {}, v: { transition: { delayChildren: 0.5, staggerChildren: 0.18 } } };
const frameIn = { h: { opacity: 0, x: -40 }, v: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
const frameAt = (d = 0) => ({ h: { opacity: 0, x: -40 }, v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } });

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

const stars = (n: number) =>
  STAR_POS[n].map(([x, y], k) => (
    <span key={k} className="pstar" style={{ "--x": x, "--y": y } as React.CSSProperties}><Spark /></span>
  ));

/* ---------- photo slider (same look as the projects page) ---------- */
function PhotoSlider({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const kids = el.children;
    const t = kids[Math.max(0, Math.min(photos.length - 1, i))] as HTMLElement;
    el.scrollTo({ left: t.offsetLeft - (kids[0] as HTMLElement).offsetLeft, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const base = (el.children[0] as HTMLElement).offsetLeft;
    let best = 0, bestD = Infinity;
    Array.from(el.children).forEach((c, k) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - base - el.scrollLeft);
      if (d < bestD) { bestD = d; best = k; }
    });
    setIdx(best);
  };

  return (
    <div className="ach-photos">
      <div className="pj-slides" ref={ref} onScroll={onScroll}>
        {photos.map((p, k) => (
          <button key={p.src} type="button" className="pj-slide ach-slide" onClick={() => onOpen(k)} aria-label={`View photo ${k + 1} of ${photos.length}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} draggable={false} />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="pj-nav">
          <button className="pj-arrow" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous photo">‹</button>
          <div className="pj-dots">
            {photos.map((_, k) => (
              <button key={k} className={`pj-dot ${idx === k ? "on" : ""}`} onClick={() => go(k)} aria-label={`Go to photo ${k + 1}`} />
            ))}
          </div>
          <button className="pj-arrow" onClick={() => go(idx + 1)} disabled={idx === photos.length - 1} aria-label="Next photo">›</button>
        </div>
      )}
    </div>
  );
}

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

  /* photo viewer */
  const [lb, setLb] = useState<{ photos: Photo[]; i: number } | null>(null);
  const step = (d: number) => setLb((s) => (s ? { ...s, i: (s.i + d + s.photos.length) % s.photos.length } : s));
  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLb(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lb]);

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
                <motion.button className="ach-mhead" variants={slideR(0.1)} onClick={() => setPicked("list")} aria-label="Back to the achievements list">
                  <span className="mplanet">{stars(0)}</span>
                  <span>{mIt.title}</span>
                </motion.button>

                <div className="ach-mrole" key={`${mSel}-${cycle}`}>
                  <div className="r1"><TypingText text={mIt.role} delay={500} speed={65} /></div>
                  {mIt.org && <div className="r2"><TypingText text={mIt.org} delay={500 + mIt.role.length * 65 + 250} speed={55} /></div>}
                </div>

                {mIt.body && <motion.p variants={slideR(0.5)}>{mIt.body}</motion.p>}

                {mIt.photos && (
                  <motion.div className="ach-mphotos" variants={slideR(0.8)}>
                    <PhotoSlider photos={mIt.photos} onOpen={(i) => setLb({ photos: mIt.photos!, i })} />
                  </motion.div>
                )}

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

            {it.photos && (
              <motion.div className="ach-dphotos" variants={slideR(0.8)}>
                <PhotoSlider photos={it.photos} onOpen={(i) => setLb({ photos: it.photos!, i })} />
              </motion.div>
            )}

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

      {/* ================= PHOTO VIEWER ================= */}
      <AnimatePresence>
        {lb && (
          <motion.div className="ach-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={() => setLb(null)} role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button className="ach-lb-close" onClick={() => setLb(null)} aria-label="Close viewer">✕</button>
            {lb.photos.length > 1 && (
              <button className="ach-lb-arrow l" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">‹</button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ach-lb-img" src={lb.photos[lb.i].src} alt={lb.photos[lb.i].alt} onClick={(e) => e.stopPropagation()} draggable={false} />
            {lb.photos.length > 1 && (
              <button className="ach-lb-arrow r" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">›</button>
            )}
            {lb.photos.length > 1 && <div className="ach-lb-count">{lb.i + 1} / {lb.photos.length}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}