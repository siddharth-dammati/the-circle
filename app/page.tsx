"use client";

import SmoothScroller from "@/components/landing/SmoothScroller";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Hero3D from "@/components/landing/Hero3D";
import MagnetButton from "@/components/landing/MagnetButton";

const CHAT_MESSAGES = [
  "Hey! Want to prep for the midterms together?",
  "Are you going to the campus music fest tonight?",
  "I saw you're also a CSE major, want to connect?",
  "I have a huge secret crush on you! 🙈",
  "Let's grab a coffee at the cafeteria?",
];

// Import massive sections
import LandingStory from "@/components/landing/LandingStory";
import LandingNetwork from "@/components/landing/LandingNetwork";
import LandingInfo from "@/components/landing/LandingInfo";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingFooter from "@/components/landing/LandingFooter";

// ──────────────────────── NAVBAR ────────────────────────
function Navbar() {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 100], ["rgba(26, 7, 16, 0)", "rgba(26, 7, 16, 0.8)"]);
  const backdropFilter = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const borderBottom = useTransform(scrollY, [0, 100], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.05)"]);

  return (
    <motion.nav
      style={{ background, backdropFilter, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-1px", display: "flex" }}>
            <span style={{ color: "#22C55E" }}>GITA</span>
            <span style={{ background: "linear-gradient(90deg, #22C55E 50%, #EC4899 50%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>M</span>
            <span style={{ color: "#EC4899" }}>ate</span>
          </span>
        </div>
        <Link
          href="/login"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "10px 24px",
            borderRadius: 100,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
        >
          Sign In
        </Link>
      </div>
    </motion.nav>
  );
}

// ──────────────────────── MAIN HERO (ULTRA-CLEAN) ────────────────────────
function LandingHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CHAT_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ height: "130vh", position: "relative", background: "#1A0710", overflow: "hidden" }}>
      
      {/* ORGANIC AURORA BACKGROUND */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.15) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 80%)", filter: "blur(100px)", zIndex: 0, pointerEvents: "none" }} />

      <motion.div style={{ y, opacity, zIndex: 10, position: "relative", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        
        {/* FLOATING GLASS UI CARDS */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "15%", left: "10%", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24, width: 280, display: "none", md: { display: "block" } }}
          className="hidden md:block"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E, #16A34A)" }} />
            <div>
              <div style={{ height: 12, width: 80, background: "rgba(255,255,255,0.2)", borderRadius: 100, marginBottom: 8 }} />
              <div style={{ height: 10, width: 60, background: "rgba(255,255,255,0.1)", borderRadius: 100 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ padding: "6px 12px", background: "rgba(34, 197, 94, 0.1)", color: "#22C55E", fontSize: 12, borderRadius: 100, fontWeight: 700 }}>CSE 3rd Year</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", bottom: "15%", right: "10%", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24, width: 280, minHeight: 140 }}
          className="hidden md:block"
        >
          <div style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", padding: 16, borderRadius: "16px 16px 0px 16px", color: "white", fontSize: 14, fontWeight: 500, marginBottom: 12, position: "relative", overflow: "hidden", minHeight: 70 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute", top: 16, left: 16, right: 16 }}
              >
                {CHAT_MESSAGES[messageIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
            <div style={{ height: 10, width: 60, background: "rgba(255,255,255,0.1)", borderRadius: 100 }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 600,
            color: "#A1A1AA",
            letterSpacing: "0.5px"
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px #22C55E" }} />
          The Exclusive Campus Network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontSize: "clamp(56px, 10vw, 120px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-4px",
            marginBottom: 24,
            color: "white",
            textAlign: "center",
            maxWidth: 1000
          }}
        >
          Love, but <br />
          <span style={{ background: "linear-gradient(90deg, #22C55E, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>verified.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#A1A1AA", maxWidth: 600, textAlign: "center", lineHeight: 1.6, marginBottom: 48 }}
        >
          Step into GITAM's most exclusive circle. A highly curated community designed for meaningful interactions. No noise. Just the people who matter.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} style={{ display: "flex", gap: 16, pointerEvents: "auto" }}>
          <MagnetButton>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                background: "white",
                color: "black",
                padding: "16px 40px",
                borderRadius: 100,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 10px 30px rgba(255,255,255,0.1)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
            >
              Start Connecting
            </Link>
          </MagnetButton>
        </motion.div>

      </motion.div>
    </section>
  );
}

// ──────────────────────── AGGREGATOR ────────────────────────
export default function UltraPremiumLandingPage() {
  return (
    <SmoothScroller>
      <main style={{ background: "#1A0710", color: "#F8FAFC", overflowX: "clip" }}>
        <Navbar />
        <LandingHero />
        <LandingStory />
        <LandingNetwork />
        <LandingInfo />
        <LandingFAQ />
        <LandingFooter />
      </main>
    </SmoothScroller>
  );
}
