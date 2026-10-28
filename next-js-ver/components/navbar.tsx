"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useFromMenu } from "./fromMenu";
import { Icon } from "./icons";
import { menu } from "./menuData";
import MobileMenuList from "./mobileMenuList";

const NAV: [string, string][] = menu.map((m) => [m.title, m.href]);
const norm = (s: string) => s.toLowerCase().replace(/[-_]/g, " ").trim();

export default function Navbar({ current }: { current: string }) {
  const fromMenu = useFromMenu(); // fade in from the right only when arriving from the menu
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close when the page changes or Esc is pressed
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // lets the CSS hide the page logo while the menu is open
  useEffect(() => {
    document.documentElement.dataset.menu = open ? "open" : "";
    return () => { document.documentElement.dataset.menu = ""; };
  }, [open]);

  return (
    <>
      {/* desktop pills */}
      <motion.nav className="nav" initial={fromMenu ? { opacity: 0, x: 140 } : false} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        {NAV.map(([n, h]) => (
          <Link key={n} href={h} className={norm(current) === n ? "on" : ""} aria-current={norm(current) === n ? "page" : undefined}>{n}</Link>
        ))}
      </motion.nav>

      {/* phone: "about me ⊕" button + full-screen menu */}
      <motion.button
        className="m-nav-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        initial={fromMenu ? { opacity: 0 } : false} animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span>{current}</span>
        <Icon name="filledCircle" className={`m-nav-ic ${open ? "open" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="m-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg" />
            <div className="m-menu">
              <MobileMenuList delay={0.4} onNavigate={() => setOpen(false)} />
            </div>
            <Link href="/" className="m-logo" onClick={() => setOpen(false)}>khrystelle</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}