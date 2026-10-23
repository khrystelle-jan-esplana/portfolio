"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const NAV: [string, string][] = [
  ["about me", "/about"],
  ["achievements", "/achievements"],
  ["certifications", "/certifications"],
  ["projects", "/menu"],
  ["tech stack", "/menu"]
];

export default function Navbar({ current }: { current: string }) {
  return (
    <motion.nav 
      className="nav" 
      initial={{ opacity: 0, x: 140 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {NAV.map(([n, h]) => (
        <Link key={n} href={h} className={n === current ? "on" : ""}>
          {n}
        </Link>
      ))}
    </motion.nav>
  );
}