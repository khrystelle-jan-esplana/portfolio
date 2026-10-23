"use client";
import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; p: number; sp: number; v: number; sparkle: boolean };

// Stars that breathe (slow fade + size swell) and some that sparkle with a glint now and then.
// Colour follows --star from globals.css.
export default function StarField({ count = 150 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, frame = 0, color = "#fff";
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.5,
      p: Math.random() * Math.PI * 2,
      sp: (Math.PI * 2) / (3 + Math.random() * 6),          // one breath every 3-9 seconds
      v: (Math.random() - 0.5) * 0.00005,
      sparkle: Math.random() < 0.2,
    }));
    const resize = () => {
      const d = devicePixelRatio || 1;
      w = innerWidth; h = innerHeight;
      c.width = w * d; c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const glint = (x: number, y: number, len: number, th: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - len);
      ctx.quadraticCurveTo(x + th, y - th, x + len, y);
      ctx.quadraticCurveTo(x + th, y + th, x, y + len);
      ctx.quadraticCurveTo(x - th, y + th, x - len, y);
      ctx.quadraticCurveTo(x - th, y - th, x, y - len);
      ctx.fill();
    };
    const draw = (ms: number) => {
      const t = ms / 1000;
      if (frame++ % 30 === 0) color = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "#fff";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const s of stars) {
        s.x = (s.x + s.v + 1) % 1;
        const b = 0.5 + 0.5 * Math.sin(t * s.sp + s.p);
        const e = b * b * (3 - 2 * b);                       // smooth in/out breathing
        const x = s.x * w, y = s.y * h;
        ctx.globalAlpha = 0.15 + 0.75 * e;
        ctx.beginPath(); ctx.arc(x, y, s.r * (0.75 + 0.5 * e), 0, Math.PI * 2); ctx.fill();
        if (s.sparkle) {
          const g = Math.pow(Math.max(0, Math.sin(t * s.sp * 0.7 + s.p * 2)), 8); // short, occasional glint
          if (g > 0.02) { ctx.globalAlpha = g * 0.9; glint(x, y, s.r * (2 + 7 * g), s.r * 0.35); }
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    resize(); addEventListener("resize", resize); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} className="starfield" aria-hidden />;
}