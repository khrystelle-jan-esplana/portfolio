"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/next-js-ver/components/icons";
import TypingText from "@/next-js-ver/components/typingText";
import StarField from "@/next-js-ver/components/starField";
import ThemeToggle from "@/next-js-ver/components/themeToggle";

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

      <section className="hero">
        <div className="line">
          <Icon name="lineStar" className="l-a" />
          <Icon name="lineStar" className="l-b" />
          <Icon name="lineStar" className="l-c" />
        </div>
        <div className="portfolio"><TypingText text="portfolio" delay={900} /></div>
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