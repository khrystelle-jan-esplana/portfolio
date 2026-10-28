"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import StarField from "@/components/starField";
import ThemeToggle from "@/components/themeToggle";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";

const EMAIL = "khrystelle.jan@gmail.com";
const SUN = "/svg-icons/sun-icon.svg";

const LINKS = [
  { label: "Gmail", href: `mailto:${EMAIL}`, external: false,
    path: "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" },
  { label: "Github", href: "https://github.com/khrystelle-jan-esplana", external: true,
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/khrystelle-esplana", external: true,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

// animation helpers ("h" = hidden, "v" = visible)
const slideR = (d = 0) => ({ h: { opacity: 0, x: -60 }, v: { opacity: 1, x: 0, transition: { delay: d, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } } });
const fadeDown = (d = 0) => ({ h: { opacity: 0, y: -22 }, v: { opacity: 1, y: 0, transition: { delay: d, duration: 0.8 } } });
const pop = (d = 0) => ({ h: { scale: 0, opacity: 0 }, v: { scale: 1, opacity: 1, transition: { delay: d, type: "spring" as const, stiffness: 240, damping: 13 } } });
const inView = { initial: "h", whileInView: "v", viewport: { amount: 0.2 } } as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ReachOutPage() {
  const [status, setStatus] = useState<Status>("idle");

  // sends the message to your Gmail through FormSubmit (no server or API key needed)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("website")) return; // honeypot: bots fill this hidden field, people don't
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
          _subject: `New message from ${fd.get("name")} (portfolio)`, _template: "table", _replyto: fd.get("email"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error("send failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const label = status === "sending" ? "Sending…" : status === "sent" ? "Sent ♡" : "Submit";
  const note =
    status === "sent" ? "Thank you! Your message is on its way to my inbox ♡"
    : status === "error" ? `Something went wrong. Please try again, or email me directly at ${EMAIL}.`
    : "";

  return (
    <main className="stage about compact">
      <div className="bg" /><StarField count={200} />
      <ThemeToggle />
      <Logo />
      <Navbar current="reach out" />

      <div className="scroller ro-scroll">
        <div className="ro-page">
          <div className="ro-wrap">
            <div className="ro">
              <div className="ro-left">
                <motion.section className="ro-block" {...inView}>
                  <motion.h1 variants={slideR(0.1)}>A little hello goes a long way ♡</motion.h1>
                  <motion.p variants={slideR(0.35)}>
                    Every lovely thing starts somewhere, and maybe this is our little beginning! Whether it&rsquo;s a project, an opportunity, or a simple hello, my inbox is always happy to meet a new friend.
                  </motion.p>
                  <div className="ro-links">
                    {LINKS.map((l, i) => (
                      <motion.a key={l.label} className="ro-btn" href={l.href} variants={pop(0.7 + i * 0.15)}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        <svg viewBox="0 0 24 24" aria-hidden><path d={l.path} /></svg>
                        <span>{l.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.section>

                <motion.section className="ro-block" {...inView}>
                  <motion.h2 variants={slideR(0.1)}>P.S. Write me sometime! 🖋️</motion.h2>
                  <motion.p variants={slideR(0.35)}>
                    Consider this your handwritten invitation to connect. For opportunities, creative projects, or a friendly hello, I&rsquo;d be delighted to hear from you.
                  </motion.p>
                </motion.section>
              </div>

              <motion.form className="ro-card" onSubmit={onSubmit} variants={fadeDown(0)} {...inView}
                onChange={() => { if (status === "sent" || status === "error") setStatus("idle"); }}>
                <motion.div className="ro-field" variants={fadeDown(0.3)}>
                  <label htmlFor="ro-name">Name:</label>
                  <input id="ro-name" name="name" type="text" placeholder="Enter your name" required maxLength={80} autoComplete="name" />
                </motion.div>
                <motion.div className="ro-field" variants={fadeDown(0.5)}>
                  <label htmlFor="ro-email">Email address:</label>
                  <input id="ro-email" name="email" type="email" placeholder="Enter your email address" required maxLength={120} autoComplete="email" />
                </motion.div>
                <motion.div className="ro-field" variants={fadeDown(0.7)}>
                  <label htmlFor="ro-msg">Message:</label>
                  <textarea id="ro-msg" name="message" placeholder="Type your message here" required maxLength={2000} />
                </motion.div>
                <input className="ro-hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden />
                <motion.div variants={fadeDown(0.9)}>
                  <button className="ro-submit" type="submit" disabled={status === "sending"}>{label}</button>
                  <p className="ro-status" role="status" aria-live="polite" data-state={status}>{note}</p>
                </motion.div>
              </motion.form>
            </div>
          </div>

          {/* suns in the bottom corners, still circling */}
          <div className="ro-sun l" aria-hidden><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
          <div className="ro-sun r" aria-hidden><span className="mask" style={{ "--m": `url(${SUN})` } as React.CSSProperties} /></div>
        </div>
      </div>
    </main>
  );
}