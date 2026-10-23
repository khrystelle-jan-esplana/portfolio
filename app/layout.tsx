import type { Metadata } from "next";
import { Italiana, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-name" });
const cormorant = Cormorant_Garamond({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--font-text" });

export const metadata: Metadata = { title: "khrystelle jan | portfolio" };

// Sets the saved theme before first paint (no flash)
const themeInit = `try{document.documentElement.dataset.theme=localStorage.getItem("theme")||"light"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${italiana.variable} ${cormorant.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body>{children}</body>
    </html>
  );
}
