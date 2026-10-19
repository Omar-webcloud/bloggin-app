import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap" 
});

const newsreader = Newsreader({ 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap" 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "Bloggin' — Modern Text-Based Publishing",
  description: "A modern, text-based publishing platform by Omar. Share thoughtful reflections, life notes, travel stories, and creative essays.",
  icons: {
    icon: "/bloggin-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col selection:bg-sage-300/30 selection:text-sage-700 dark:selection:text-sage-300`}>
        {/* Ambient Top Glow */}
        <div className="fixed inset-x-0 top-0 h-96 ambient-glow pointer-events-none z-0" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
