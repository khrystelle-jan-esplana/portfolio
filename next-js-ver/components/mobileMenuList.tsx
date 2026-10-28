"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ICONS } from "./icons";
import { menu, subHref } from "./menuData";

export default function MobileMenuList({ delay = 2.3, onNavigate }: { delay?: number; onNavigate?: () => void }) {
  const router = useRouter();
  const [sel, setSel] = useState<number | null>(null);
  const item = sel === null ? null : menu[sel];

  // no dropdown -> go straight to the page; otherwise open / close the dropdown
  const tap = (i: number) => {
    const m = menu[i];
    if (m.links.length === 0) { onNavigate?.(); router.push(m.href); return; }
    setSel(sel === i ? null : i);
  };

  return (
    <div className="m-wrap" style={{ "--m": `url(${ICONS.menuStar.light})` } as React.CSSProperties}>
      <ul className="m-list">
        {menu.map((m, i) => (
          <li
            key={m.title}
            className={`m-item ${sel === i ? "on" : ""} ${sel !== null && sel !== i ? "away" : ""}`}
            style={{ "--i": i, "--d": `${delay + i * 0.14}s` } as React.CSSProperties}
          >
            <button onClick={() => tap(i)} aria-expanded={m.links.length ? sel === i : undefined}>
              <span className="m-star" />
              <span>{m.title}</span>
              <span className="m-star" />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence mode="wait">
        {item && item.links.length > 0 && (
          <motion.ul
            key={item.title}
            className="m-sub"
            aria-label={`${item.title} sections`}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {item.links.map((l, i) => (
              <motion.li
                key={l.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.18, duration: 0.8, ease: "easeOut" }}
              >
                <Link href={subHref(item, l)} onClick={onNavigate}>{l.label}</Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}