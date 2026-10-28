"use client";
import { useEffect, useState } from "react";

export const TOPICS: Record<"interests" | "hobbies", [string, string][]> = {
  interests: [
    ["volunteering", "Recently, I have taken interest in volunteering. With what is happening around the country right now, as a citizen, I want to help as I can even just a little bit."],
    ["hiking", "I’ve always been to the beach when it comes to going on vacation which is why now, I have an interest in hiking especially as it encourages being physically active."],
    ["learning new languages", "I believe that learning new languages can be a good advantage especially when travelling. To add, I also think it would be great to interact with people with different languages. ♡"],
    ["stargazing", "As a kid, I have always been fascinated by the stars much more knowing their names. It feels like I'm closer to them which is why I’m interested in knowing more about constellations."],
  ],
  hobbies: [
    ["listening to music", "Listening to music has always been relaxing which is why it became a hobby of mine to create playlist and learn new songs."],
    ["cleaning the house", "It has become a hobby of mine to clean the house even though I am tired. I can’t stand seeing my house not cleaned especially if we have visitors."],
    ["cooking", "As the eldest daughter, my parents taught me to cook our meals that it became a hobby of mine to cook meals as well as learning to cook something new to me."],
    ["swimming", "Ever since I was a child, we have been going to the beach every summer which is why every now and then, it became a hobby to always swim in the ocean and the pool."],
  ],
};

export const SKILLS = ["attention to detail", "teamwork & collaboration", "communication", "adaptable", "visual design awareness", "continuous learning"];

export type Item = { name: string; x: number; y: number; below?: boolean };
export type Cat = { title: string; side: "left" | "right"; stars: number; ar: number; items: Item[] };

// x / y are percentages of each box. Items appear and connect in the order listed.
export const CATS: Cat[] = [
  { title: "Programming Tools", side: "left", stars: 1, ar: 0.42, items: [
    { name: "Visual Studio Code", x: 53, y: 6 }, { name: "Apache NetBeans", x: 33, y: 30 }, { name: "Android Studio", x: 8, y: 24 },
    { name: "Oracle APEX", x: 21, y: 94 }, { name: "Git", x: 44, y: 54 }, { name: "GitHub", x: 55, y: 80 },
    { name: "Postman", x: 67, y: 26 }, { name: "Node.js", x: 70, y: 56 }, { name: "Render", x: 88, y: 42 }, { name: "Figma", x: 80, y: 84 },
  ] },
  { title: "Programming Languages", side: "right", stars: 2, ar: 0.36, items: [
    { name: "Java", x: 47, y: 8 }, { name: "C", x: 18, y: 14 }, { name: "JavaScript", x: 11, y: 76 }, { name: "TypeScript", x: 35, y: 50 },
    { name: "HTML", x: 69, y: 31 }, { name: "CSS", x: 81, y: 64 }, { name: "Dart", x: 61, y: 93 },
  ] },
  { title: "Frameworks and Libraries", side: "left", stars: 3, ar: 0.26, items: [
    { name: "React", x: 16, y: 10 }, { name: "Next.js", x: 27, y: 83 }, { name: "Flutter", x: 44, y: 12 },
    { name: "Tailwind CSS", x: 59, y: 89 }, { name: "Bootstrap", x: 71, y: 12 },
  ] },
  { title: "Databases", side: "right", stars: 4, ar: 0.17, items: [
    { name: "Mongo DB", x: 78, y: 20, below: true }, { name: "Firebase", x: 60, y: 55, below: true },
  ] },
];

export const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

// ---- animation helpers (variants "h" = hidden, "v" = visible) ----
export const spring = { type: "spring" as const, stiffness: 240, damping: 13 };
export const pop = (d = 0) => ({ h: { scale: 0, opacity: 0 }, v: { scale: 1, opacity: 1, transition: { delay: d, ...spring } } });
export const fadeDown = (d = 0) => ({ h: { opacity: 0, y: -26 }, v: { opacity: 1, y: 0, transition: { delay: d, duration: 0.8 } } });
export const rise = (d = 0) => ({ h: { opacity: 0, y: 12 }, v: { opacity: 1, y: 0, transition: { delay: d, duration: 0.6 } } });
export const gx = (d = 0, t = 0.7) => ({ h: { scaleX: 0 }, v: { scaleX: 1, transition: { delay: d, duration: t, ease: "linear" as const } } });
export const gy = (d = 0, t = 0.7) => ({ h: { scaleY: 0 }, v: { scaleY: 1, transition: { delay: d, duration: t, ease: "linear" as const } } });
export const inView = { initial: "h", whileInView: "v", viewport: { amount: 0.2 } } as const;

export const Spark = () => (
  <svg className="spark" viewBox="-10 -10 20 20" aria-hidden><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10Z" fill="currentColor" /></svg>
);

// true / false once known (null on the very first render, so nothing flashes)
export function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}