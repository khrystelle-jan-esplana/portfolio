"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import Navbar from "@/components/navbar";

const CERTS = [
  { src: "/certifications/dsdap-cert.png", title: "DSDAP Certificate" },
  { src: "/certifications/egov-cert.png", title: "eGov Certificate" },
  { src: "/certifications/globalcr-day1-cert.png", title: "Global Career Day 1" },
  { src: "/certifications/html-css-cert.png", title: "HTML & CSS Certificate" },
  { src: "/certifications/msppt-cert.png", title: "Microsoft PowerPoint Specialist" },
  { src: "/certifications/msword-cert.png", title: "Microsoft Word Specialist" },
  { src: "/certifications/stardom-cert.png", title: "Stardom Certificate" },
  { src: "/certifications/stardom-day2-cert.png", title: "Stardom Day 2" },
  { src: "/certifications/stardom-day3-cert.png", title: "Stardom Day 3" },
];

const SUN = "/svg-icons/sun-icon.svg";
const FRAME_IMG = "/certifications/celestial-card-landscape.png";

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCert) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedCert]);

  return (
    <main className="stage about compact cert-page">
      <div className="bg" />
      <StarField count={200} />
      <ThemeToggle />

      <motion.div className="logo" initial={{ x: "80vw" }} animate={{ x: 0 }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/">khrystelle</Link>
      </motion.div>
      <Navbar current="certifications" />

      <div className="cert-container">
        <div className="cert-drag-viewport">
          <motion.div
            className="cert-track"
            drag="x"
            dragConstraints={{ left: -2500, right: 0 }}
            dragElastic={0.15}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
          >
            {CERTS.map((cert, i) => (
              <motion.div 
                key={i} 
                className="cert-frame-wrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              >
                <div className="cert-frame" onClick={() => setSelectedCert(cert.src)}>
                  <Image src={FRAME_IMG} alt="frame background" className="frame-bg" fill draggable={false} />
                  <div className="cert-img-clip">
                    <Image src={cert.src} alt={cert.title} className="cert-img" fill draggable={false} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Text & Sun Combined */}
        <div className="cert-bottom-label">
          <div className="cert-sun">
             <span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} />
          </div>
          <div className="cert-text-wrap">
            <svg viewBox="0 0 600 250" className="cert-curved-svg" aria-hidden>
              {/* Much steeper curve */}
              <path id="curvePath" d="M 50 200 Q 300 -30 550 200" fill="none" />
              <text>
                <textPath href="#curvePath" startOffset="50%" textAnchor="middle">
                  certifications
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className="cert-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              className="cert-modal-content"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedCert} alt="Certificate Overview" className="cert-modal-img" width={1200} height={800} style={{ objectFit: "contain", width: "auto", height: "auto", maxHeight: "90vh" }} />
              <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}