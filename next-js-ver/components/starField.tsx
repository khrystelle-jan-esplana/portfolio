"use client";
import { useEffect, useRef } from "react";

// Twinkling, slowly drifting stars. Colour follows --star from globals.css.
export default function StarField({ count = 150 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, color = "#fff";
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.4,
      p: Math.random() * 6.28, s: Math.random() * 0.02 + 0.006, v: (Math.random() - 0.5) * 0.00006,
    }));
    const resize = () => { const d = devicePixelRatio || 1; w = c.width = innerWidth * d; h = c.height = innerHeight * d; };
    const draw = (t: number) => {
      if (!(t % 60 < 17)) {} color = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "#fff";
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = color;
      for (const s of stars) {
        s.p += s.s; s.x = (s.x + s.v + 1) % 1;
        ctx.globalAlpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(s.p));
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * (devicePixelRatio || 1), 0, 6.283); ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    resize(); addEventListener("resize", resize); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} className="starfield" aria-hidden />;
}
