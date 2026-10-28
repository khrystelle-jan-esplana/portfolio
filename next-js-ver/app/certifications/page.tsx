"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";

type Cert = { src: string; title: string };

// Newest year first. Edit freely: add a year or move a cert and the page follows.
const GROUPS: { year: number; certs: Cert[] }[] = [
  { year: 2026, certs: [
    { src: "/certifications/html-css-cert.png", title: "HTML & CSS Certificate" },
  ] },
  { year: 2025, certs: [
    { src: "/certifications/stardom-cert.png", title: "Stardom Certificate" },
  ] },
  { year: 2024, certs: [
    { src: "/certifications/msword-cert.png", title: "Microsoft Word Specialist" },
    { src: "/certifications/msppt-cert.png", title: "Microsoft PowerPoint Specialist" },
    { src: "/certifications/dsdap-cert.png", title: "DSDAP Certificate" },
    { src: "/certifications/egov-cert.png", title: "eGov Certificate" },
    { src: "/certifications/globalcr-day1-cert.png", title: "Global Career Day 1" },
    { src: "/certifications/stardom-day2-cert.png", title: "Stardom Day 2" },
    { src: "/certifications/stardom-day3-cert.png", title: "Stardom Day 3" },
  ] },
];

const SUN = "/svg-icons/sun-icon.svg";
const FRAME_IMG = "/certifications/celestial-card-landscape.png";
const SORT_ICON = "/certifications/sort-icon.svg";

const Spark = () => (
  <svg viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

function SortButton({ asc, onClick, className }: { asc: boolean; onClick: () => void; className: string }) {
  return (
    <button className={`cp-sort ${className}`} data-asc={asc} onClick={onClick}
      aria-label={asc ? "Oldest first. Switch to newest first" : "Newest first. Switch to oldest first"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SORT_ICON} alt="" draggable={false} />
    </button>
  );
}

export default function CertificationsPage() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const [asc, setAsc] = useState(false); // false = 2026 -> 2024
  const groups = asc ? [...GROUPS].reverse() : GROUPS;
  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((s, g) => s + g.certs.length, 0));

  const scRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  // desktop: mouse wheel scrolls the photos sideways
  useEffect(() => {
    const el = scRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!matchMedia("(min-width: 701px)").matches) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Escape closes the overview
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [selected]);

  // desktop: click-and-drag with the mouse (touch uses normal scrolling)
  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scRef.current;
    if (!el) return;
    drag.current = { down: true, x: e.pageX, left: el.scrollLeft, moved: false };
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const d = drag.current, el = scRef.current;
    if (!d.down || !el) return;
    const dx = e.pageX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const onUp = () => { drag.current.down = false; };
  const open = (c: Cert) => { if (!drag.current.moved) setSelected(c); }; // a drag is not a click

  return (
    <main className="stage about compact cert-page">
      <div className="bg" />
      <StarField count={200} />
      <ThemeToggle />
      <Logo />
      <Navbar current="certifications" />

      {/* desktop: sort icon stays put while the photos slide */}
      <SortButton className="cp-fixed" asc={asc} onClick={() => setAsc(!asc)} />

      <div className="cp-scroll" ref={scRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        <div className="cp-track" key={asc ? "asc" : "desc"}>
          {groups.map((g, gi) => (
            <section className="cp-group" key={g.year}>
              <motion.div className="cp-year" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 + gi * 0.1 }}>
                <motion.span className="cp-planet" initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 13, delay: 0.3 + gi * 0.1 }}>
                  <span className="pstar" style={{ "--x": 0.6, "--y": -0.8 } as React.CSSProperties}><Spark /></span>
                </motion.span>
                <h2>{g.year}</h2>
                {/* phone: sort icon sits at the end of the first year row */}
                {gi === 0 && <SortButton className="cp-in" asc={asc} onClick={() => setAsc(!asc)} />}
              </motion.div>

              <div className="cp-row">
                {g.certs.map((c, ci) => (
                  <motion.div key={c.src} className="cp-item" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + Math.min(offsets[gi] + ci, 8) * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="cert-frame" role="button" tabIndex={0} aria-label={`Open ${c.title}`}
                      onClick={() => open(c)} onKeyDown={(e) => { if (e.key === "Enter") setSelected(c); }}>
                      <Image src={FRAME_IMG} alt="" className="frame-bg" fill sizes="(max-width: 700px) 80vw, 29vw" draggable={false} />
                      <div className="cert-img-clip">
                        <Image src={c.src} alt={c.title} className="cert-img" fill sizes="(max-width: 700px) 80vw, 29vw" draggable={false} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* desktop: curved label + sun at the bottom */}
      <div className="cert-bottom-label">
        <div className="cert-sun">
          <span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} />
        </div>
        <div className="cert-text-wrap">
          <svg viewBox="0 0 600 250" className="cert-curved-svg" aria-hidden>
            <path id="curvePath" d="M 50 200 Q 300 -30 550 200" fill="none" />
            <text><textPath href="#curvePath" startOffset="50%" textAnchor="middle">certifications</textPath></text>
          </svg>
        </div>
      </div>

      {/* phone: sun in the bottom-left corner */}
      <div className="ach-msun cp-msun" aria-hidden>
        <span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} />
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="cert-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="cert-modal-content"
              initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }} onClick={(e) => e.stopPropagation()}>
              <Image src={selected.src} alt={selected.title} className="cert-modal-img" width={1200} height={800}
                style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "90vh" }} />
              <button className="cert-modal-close" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}