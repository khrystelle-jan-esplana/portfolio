"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useFromMenu } from "./fromMenu";

const NAV: [string, string][] = [
  ["about me", "/about"],
  ["achievements", "/achievements"],
  ["certifications", "/certifications"],
  ["projects", "/projects"],
  ["tech stack", "/tech-stack"],
];
const norm = (s: string) => s.toLowerCase().replace(/[-_]/g, " ").trim();

export default function Navbar({ current }: { current: string }) {
  const fromMenu = useFromMenu(); // fade in from the right only when arriving from the menu
  return (
    <motion.nav className="nav" initial={fromMenu ? { opacity: 0, x: 140 } : false} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      {NAV.map(([n, h]) => (
        <Link key={n} href={h} className={norm(current) === n ? "on" : ""} aria-current={norm(current) === n ? "page" : undefined}>{n}</Link>
      ))}
    </motion.nav>
  );
}