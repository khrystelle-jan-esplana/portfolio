"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { clearFromMenu, useFromMenu } from "./fromMenu";

export default function Logo() {
  const fromMenu = useFromMenu();
  useEffect(() => { clearFromMenu(); }, []);
  return (
    <motion.div className="logo" initial={fromMenu ? { x: "80vw" } : false} animate={{ x: 0 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}>
      <Link href="/">khrystelle</Link>
    </motion.div>
  );
}