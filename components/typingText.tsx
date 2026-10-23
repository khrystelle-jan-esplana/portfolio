"use client";
import { useEffect, useState } from "react";

export default function TypingText({ text, delay = 0, speed = 90, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => setN((c) => (c >= text.length ? (clearInterval(iv), c) : c + 1)), speed);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay, speed]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="caret" style={{ opacity: n < text.length ? 1 : 0 }} />
    </span>
  );
}
