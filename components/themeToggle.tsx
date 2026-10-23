"use client";
import { useSyncExternalStore } from "react";
import { Icon } from "./icons";

const subscribe = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => o.disconnect();
};
const getTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const);
  const dark = theme === "dark";

  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = dark ? "light" : "dark";
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch {}
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition) return apply();
    // circular reveal that grows out of the toggle
    doc.startViewTransition(apply).ready.then(() => {
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button className="toggle" onClick={flip} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
      <span className="t-ring" />
      <span className="t-rot" style={{ "--r": dark ? "90deg" : "0deg" } as React.CSSProperties}>
        <span className={`t-slot sun ${!dark ? "show" : ""}`}><Icon name="toggleLight" /></span>
        <span className={`t-slot moon ${dark ? "show" : ""}`}><Icon name="toggleDark" /></span>
      </span>
    </button>
  );
}