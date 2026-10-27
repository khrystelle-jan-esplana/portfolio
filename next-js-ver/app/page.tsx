"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import TypingText from "@/components/typingText";
import { Icon } from "@/components/icons";

const PHOTO = "/photos/landing_photo-1.png"; // change .png if your file is .jpg / .webp
const STARS = 5;
const STEP_MS = 700; // time per star; total wait = STARS * STEP_MS

export default function Landing() {
  const router = useRouter();
  const [going, setGoing] = useState(false);
  const [lit, setLit] = useState(0);
  const tick = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(tick.current), []);

  const explore = () => {
    if (going) return;
    setGoing(true);
    let step = 0;
    tick.current = window.setInterval(() => {
      step += 1;
      setLit(step);
      if (step >= STARS) {
        window.clearInterval(tick.current);
        window.setTimeout(() => {
          router.push("/menu");
          // reset after leaving, so coming back home starts fresh
          window.setTimeout(() => { setGoing(false); setLit(0); }, 1200);
        }, 400);
      }
    }, STEP_MS);
  };

  return (
    <main className="stage">
      <div className="bg" /><StarField /><div className="frame" />
      <ThemeToggle />

      <Icon name="starCombo" className="pos combo slide-lr" />
      <Icon name="rayDown" className="pos ray slide-up" />

      {/* photo with glow + cloud behind it */}
      <div className="photo-wrap" aria-hidden>
        <div className="photo-cloud" />
        <div
          className="photo-fig"
          style={{ "--photo": `url(${PHOTO})` } as React.CSSProperties}
        >
          <div className="photo-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-img" src={PHOTO} alt="" draggable={false} />
        </div>
      </div>
      <div className="pf"><TypingText text="portfolio" delay={900} /></div>

      <section className="hero">
        <div className="line">
          <Icon name="lineStar" className="l-a" />
          <Icon name="lineStar" className="l-b" />
          <Icon name="lineStar" className="l-c" />
        </div>
        <h1 className="name">
          <span className="first from-right">khrystelle</span>
          <span className="second from-left">jan</span>
        </h1>
        <Icon name="crossStar" className="cross" />
      </section>

      <div className="explore">
        <button className="explore-btn" onClick={explore} disabled={going}>
          {going ? "entering" : <TypingText text="explore" delay={1400} />}
        </button>
        <div className="loader" role="progressbar" aria-valuemax={STARS} aria-valuenow={lit}>
          {Array.from({ length: STARS }, (_, i) => (
            <Icon key={i} name="filledCircle" className={`dot ${i < lit ? "on" : ""}`} />
          ))}
        </div>
      </div>
    </main>
  );
}