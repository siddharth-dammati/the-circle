"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, Shield, Zap, MessageCircle, Star } from "lucide-react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #030009;
    color: #F8FAFC;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #030009; }
  ::-webkit-scrollbar-thumb { background: #E879F9; border-radius: 99px; }

  /* Noise texture overlay */
  .noise::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.35;
  }

  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.04); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.4; }
  }

  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @keyframes float-up { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes twinkle {
    0%,100% { opacity: 0.1; transform: scale(0.8); }
    50% { opacity: 0.9; transform: scale(1.2); }
  }
  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
  }
  @keyframes orbit2 {
    0% { transform: rotate(180deg) translateX(200px) rotate(-180deg); }
    100% { transform: rotate(540deg) translateX(200px) rotate(-540deg); }
  }

  .star-field {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .star {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: twinkle var(--d, 3s) ease-in-out var(--delay, 0s) infinite;
  }

  .gradient-text {
    background: linear-gradient(135deg, #F9A8D4, #E879F9, #A855F7, #818CF8, #E879F9, #F9A8D4);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 5s ease infinite;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #E879F9, #C026D3, #7C3AED);
    color: white;
    font-weight: 700;
    text-decoration: none;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    box-shadow: 0 0 0 1px rgba(232,121,249,0.2), 0 8px 32px rgba(232,121,249,0.3), 0 2px 8px rgba(0,0,0,0.4);
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: shimmer 3s ease infinite;
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 0 1px rgba(232,121,249,0.4), 0 16px 48px rgba(232,121,249,0.45), 0 4px 12px rgba(0,0,0,0.5);
  }

  .glass-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,121,249,0.3), transparent);
  }

  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    border-radius: 4px;
    padding: 7px 14px;
    margin-bottom: 28px;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,121,249,0.15), rgba(129,140,248,0.15), transparent);
  }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .hero-h1 { font-size: 52px !important; letter-spacing: -2px !important; }
    .countdown-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`;

// ─── STAR FIELD ───────────────────────────────────────────────────────────────
function StarField() {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    setStars(Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: (Math.random() * 4 + 2).toFixed(1),
      delay: (Math.random() * 5).toFixed(1),
    })));
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="star-field" style={{ pointerEvents: "none", zIndex: 1 }}>
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          "--d": `${s.duration}s`, "--delay": `${s.delay}s`,
        } as any} />
      ))}
    </div>
  );
}

// ─── CURSOR GLOW ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-500); const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  const sy = useSpring(y, { stiffness: 60, damping: 18 });
  useEffect(() => {
    const fn = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <motion.div style={{
      x: sx, y: sy, position: "fixed", top: -250, left: -250,
      width: 500, height: 500, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(232,121,249,0.07) 0%, transparent 70%)",
      pointerEvents: "none", zIndex: 9998,
    }} />
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(3,0,9,0)", "rgba(3,0,9,0.92)"]);
  const bdr = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);
  return (
    <motion.nav style={{
      background: bg, borderBottom: `1px solid`, borderColor: bdr,
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, padding: "16px 32px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #E879F9, #C026D3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 1px rgba(232,121,249,0.3), 0 4px 20px rgba(232,121,249,0.35)",
          }}>
            <Heart size={16} fill="white" color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.3px" }}>The Circle</span>
        </motion.div>

        {/* Nav right */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 18px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >Sign in</Link>
          <Link href="/login" className="btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>
            Register Free <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 160]);
  const opacity = useTransform(scrollY, [0, 550], [1, 0]);

  return (
    <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#030009" }}>
      <StarField />

      {/* Background gradient blobs */}
      <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "70vw", height: "70vh", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(192,38,211,0.18) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)", filter: "blur(60px)", zIndex: 2, pointerEvents: "none" }}
      />

      {/* Orbital rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, pointerEvents: "none" }}>
        {[560, 420, 300, 200].map((d, i) => (
          <div key={i} style={{
            position: "absolute", width: d, height: d, borderRadius: "50%",
            border: `1px solid rgba(232,121,249,${0.04 + i * 0.025})`,
            animation: `${i % 2 === 0 ? "spin-slow" : "spin-reverse"} ${50 + i * 12}s linear infinite`,
            boxShadow: `0 0 ${30 + i * 15}px rgba(232,121,249,${0.02}) inset`,
          }} />
        ))}
        {/* Center orb */}
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,121,249,0.6) 0%, rgba(192,38,211,0.3) 50%, transparent 70%)", filter: "blur(8px)" }}
        />
        {/* Orbiting dots */}
        <div style={{ position: "absolute", width: 300, height: 300 }}>
          <div style={{ position: "absolute", inset: 0, animation: "orbit 12s linear infinite" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E879F9", boxShadow: "0 0 12px #E879F9", marginTop: -4, marginLeft: -4 }} />
          </div>
        </div>
        <div style={{ position: "absolute", width: 420, height: 420 }}>
          <div style={{ position: "absolute", inset: 0, animation: "orbit2 18s linear infinite" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#818CF8", boxShadow: "0 0 10px #818CF8", marginTop: -3, marginLeft: -3 }} />
          </div>
        </div>
      </div>

      {/* Hero content */}
      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, textAlign: "center", maxWidth: 900, padding: "120px 24px 60px" }}>

        {/* Live badge */}
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,121,249,0.07)", border: "1px solid rgba(232,121,249,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 40 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E879F9", boxShadow: "0 0 6px #E879F9", animation: "blink 1.5s ease infinite", display: "block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F0ABFC", letterSpacing: "2px", textTransform: "uppercase" }}>Registration Open · Hyderabad Campus</span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <h1 className="hero-h1" style={{ fontSize: "clamp(56px, 9vw, 112px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-4px", marginBottom: 28 }}>
            <span style={{ display: "block", color: "white" }}>Some things are</span>
            <span className="gradient-text" style={{ display: "block" }}>worth waiting for.</span>
          </h1>
        </motion.div>

        {/* Sub */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
          style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto 16px", lineHeight: 1.8, fontWeight: 400 }}
        >
          Register today. Your matches are calculated in secret and revealed <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>live on August 28th</strong> — Freshers Day, Hyderabad.
        </motion.p>

        {/* Urgency line */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: 8, padding: "9px 18px", marginBottom: 48 }}
        >
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 13, color: "#FDE68A", fontWeight: 600 }}>Registration closes before Aug 28 — don't miss the reveal</span>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/login" className="btn-primary" style={{ fontSize: 16, padding: "17px 44px" }}>
            <Sparkles size={16} /> Create Your Profile — Free
          </Link>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", fontSize: 15, fontWeight: 600, padding: "17px 36px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; }}
          >
            How it works
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 48, flexWrap: "wrap" }}
        >
          {["Campus verified only", "Completely free", "Matches reveal Aug 28"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#4ADE80", fontSize: 12 }}>✓</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(232,121,249,0.4))" }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#E879F9", boxShadow: "0 0 8px #E879F9" }} />
      </motion.div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", icon: "✍️", title: "Register today", body: "Sign in with your campus Google account and build your profile. Add photos, interests, and select your preferences. Takes under 5 minutes.", tag: "Do this now", color: "#E879F9", glow: "rgba(232,121,249,0.12)" },
    { n: "02", icon: "🧠", title: "We match in secret", body: "The algorithm runs quietly behind the scenes — scoring compatibility across branch, year, interests, and stated preference. You won't know your matches until the day.", tag: "Happening now", color: "#818CF8", glow: "rgba(129,140,248,0.1)" },
    { n: "03", icon: "🎉", title: "August 28th — revealed", body: "On Freshers Day, all matches are revealed simultaneously. You'll see exactly who you matched with. Walk up, say hello, or start chatting in-app.", tag: "The big day", color: "#FB923C", glow: "rgba(251,146,60,0.1)" },
  ];

  return (
    <section id="how" style={{ padding: "160px 24px", background: "#030009", position: "relative", overflow: "hidden" }}>
      {/* Subtle dot grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none", opacity: 0.5 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ marginBottom: 100 }}>
          <div className="section-tag" style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", color: "#818CF8" }}>
            <Sparkles size={12} /> The Process
          </div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.95, color: "white", maxWidth: 700 }}>
            Three steps.<br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>One unforgettable</span><br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>moment.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              {/* Connector line from previous step */}
              {i > 0 && (
                <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${step.color}30)`, marginLeft: 39, marginBottom: 0 }} />
              )}
              <div style={{
                display: "grid", gridTemplateColumns: "80px 1fr", gap: 40, alignItems: "flex-start",
                background: step.glow, border: `1px solid ${step.color}18`,
                borderRadius: 24, padding: "40px 44px", marginBottom: i < steps.length - 1 ? 0 : 0,
              }}>
                {/* Left: icon circle */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${step.color}10`, border: `1.5px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, position: "relative" }}>
                    {step.icon}
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "white", boxShadow: `0 0 10px ${step.color}80` }}>{i + 1}</div>
                  </div>
                </div>

                {/* Right: text */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: step.color, letterSpacing: "2.5px", textTransform: "uppercase" }}>{step.n} — {step.tag}</span>
                  </div>
                  <h3 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, color: "white", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>{step.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 16, lineHeight: 1.8, maxWidth: 560 }}>{step.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── URGENCY STRIP ───────────────────────────────────────────────────────────
function UrgencyStrip() {
  return (
    <section style={{ padding: "0 24px 80px", background: "#030009" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", overflow: "hidden", borderRadius: 24 }}
        >
          {/* Background */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(232,121,249,0.07) 0%, rgba(192,38,211,0.05) 50%, rgba(129,140,248,0.07) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(232,121,249,0.18)", borderRadius: 24 }} />
          {/* Top shimmer line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(232,121,249,0.6), transparent)" }} />

          <div style={{ position: "relative", padding: "48px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#FCD34D", letterSpacing: "2.5px", textTransform: "uppercase" }}>Registration Deadline</span>
              </div>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "white", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>
                Miss registration = miss the reveal.
              </h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, lineHeight: 1.75 }}>
                Once registrations close before August 28, the matching engine locks. There is no late entry. Every profile currently registered will receive their matches — unregistered students won't exist in the system.
              </p>
            </div>
            <Link href="/login" className="btn-primary" style={{ fontSize: 15, padding: "16px 36px", flexShrink: 0 }}>
              <Heart size={15} fill="white" /> Register Now — Free
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COUNTDOWN ─────────────────────────────────────────────────────────────────
function Countdown() {
  const target = new Date("2026-08-28T09:00:00+05:30");
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  const units = [{ l: "Days", v: t.d }, { l: "Hours", v: t.h }, { l: "Mins", v: t.m }, { l: "Secs", v: t.s }];

  return (
    <section style={{ padding: "160px 24px", background: "#030009", position: "relative", overflow: "hidden" }}>
      {/* Giant ghost text behind */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", fontSize: "clamp(120px, 20vw, 280px)", fontWeight: 900, color: "rgba(232,121,249,0.025)", letterSpacing: "-10px", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
        AUG 28
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,38,211,0.06) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="section-tag" style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)", color: "#FB923C", margin: "0 auto 28px" }}>
            The Countdown
          </div>
          <h2 style={{ fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-2.5px", color: "white", lineHeight: 1.0, marginBottom: 14 }}>
            Everything changes on<br />
            <span className="gradient-text">August 28th.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 17, marginBottom: 72 }}>
            This is the moment. Matches are revealed. Be registered before the clock hits zero.
          </p>

          {/* Clock */}
          <div className="countdown-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 72 }}>
            {units.map(({ l, v }, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card"
                style={{ padding: "36px 8px 28px", textAlign: "center" }}
              >
                {/* Glow bar at bottom */}
                <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, transparent, ${i === 3 ? "#E879F9" : "rgba(232,121,249,0.4)"}, transparent)` }} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={v}
                    initial={{ y: -14, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 14, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 900, color: "white", letterSpacing: "-3px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(v).padStart(2, "0")}
                  </motion.div>
                </AnimatePresence>
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "2.5px", marginTop: 12 }}>{l}</div>
              </motion.div>
            ))}
          </div>

          <Link href="/login" className="btn-primary" style={{ fontSize: 16, padding: "18px 52px" }}>
            <Sparkles size={16} /> Register Before Time Runs Out
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURES BENTO ──────────────────────────────────────────────────────────
function Features() {
  const items = [
    { icon: <Shield size={24} color="#E879F9" />, title: "Campus Verified", body: "Every profile is validated through your institutional Google account. No outsiders, no catfishing.", accent: "rgba(232,121,249,0.08)", border: "rgba(232,121,249,0.15)", span: 1 },
    { icon: <Zap size={24} color="#818CF8" />, title: "Intelligent Matching", body: "Not random swipes. Our algorithm scores branch, year, interests, and preferences for deep compatibility.", accent: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.15)", span: 1 },
    { icon: <MessageCircle size={24} color="#34D399" />, title: "Chat After Match", body: "The moment matches are revealed on Aug 28, chat opens between mutual matches. No awkward number exchanges.", accent: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)", span: 2 },
    { icon: <Star size={24} color="#FB923C" fill="rgba(251,146,60,0.2)" />, title: "Secret Crush", body: "Send a silent signal to someone you're interested in. If they register and you match — it's revealed live.", accent: "rgba(251,146,60,0.07)", border: "rgba(251,146,60,0.15)", span: 1 },
    { icon: <Heart size={24} color="#F472B6" fill="rgba(244,114,182,0.2)" />, title: "Privacy First", body: "Your data never leaves the platform. Your profile is only visible to other registered campus students.", accent: "rgba(244,114,182,0.07)", border: "rgba(244,114,182,0.15)", span: 1 },
  ];

  return (
    <section style={{ padding: "120px 24px 160px", background: "#030009" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ marginBottom: 72 }}>
          <div className="section-tag" style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}>
            <Sparkles size={12} /> What makes us different
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: "white", maxWidth: 560 }}>
            Not just an app.<br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>A shared moment.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: item.accent,
                border: `1px solid ${item.border}`,
                borderRadius: 20, padding: "36px 32px",
                gridColumn: `span ${item.span}`,
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${item.border}, transparent)` }} />
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>{item.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "white", marginBottom: 10, letterSpacing: "-0.3px" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1.8 }}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Who can register on The Circle?", a: "Only Hyderabad campus students. You sign in with your campus Google account — no external emails accepted." },
    { q: "Do I have to register before August 28?", a: "Yes, absolutely. Registrations are locked before matches are calculated and revealed. If you're not registered at the cutoff, you won't appear in anyone's matches and won't receive any." },
    { q: "What happens when matches are revealed?", a: "On August 28th — Freshers Day — all mutual matches are simultaneously revealed in-app. You can view profiles and instantly start chatting with your matches." },
    { q: "Is my profile visible to everyone?", a: "Only to other registered, onboarded campus students. We never share your data externally." },
    { q: "Can I update my preferences after registering?", a: "Yes — edit any time before the cutoff. We'll always use your latest profile for matching." },
    { q: "Is it free?", a: "Completely free. No subscriptions, no paid tiers. This is a campus experience, not a product." },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "#030009", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(38px, 5vw, 60px)", fontWeight: 900, letterSpacing: "-2px", color: "white" }}>Questions.</h2>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 16, marginTop: 10 }}>Everything you need to know before you register.</p>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", padding: "26px 0", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 24 }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: open === i ? "white" : "rgba(255,255,255,0.6)", transition: "color 0.2s", letterSpacing: "-0.2px" }}>{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.22 }}
                    style={{ width: 28, height: 28, borderRadius: "50%", background: open === i ? "rgba(232,121,249,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${open === i ? "rgba(232,121,249,0.3)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s, border 0.2s" }}
                  >
                    <span style={{ color: open === i ? "#E879F9" : "rgba(255,255,255,0.3)", fontSize: 16, lineHeight: 1 }}>+</span>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }}>
                      <p style={{ paddingBottom: 26, color: "rgba(255,255,255,0.3)", fontSize: 15, lineHeight: 1.85 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ padding: "160px 24px 100px", background: "#030009", position: "relative", overflow: "hidden" }}>
      <StarField />
      {/* Massive glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(192,38,211,0.14) 0%, rgba(232,121,249,0.07) 50%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }}
      />

      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 5 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}>

          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ fontSize: 64, marginBottom: 40, display: "inline-block", filter: "drop-shadow(0 0 20px rgba(232,121,249,0.4))" }}
          >
            💌
          </motion.div>

          <h2 style={{ fontSize: "clamp(46px, 8vw, 100px)", fontWeight: 900, letterSpacing: "-4px", lineHeight: 0.92, marginBottom: 28, color: "white" }}>
            Your match is<br />
            <span className="gradient-text">already here.</span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, lineHeight: 1.85, marginBottom: 52, maxWidth: 480, margin: "0 auto 52px" }}>
            They're already registered. Build your profile today — and find out exactly who, live on August 28th.
          </p>

          <Link href="/login" className="btn-primary" style={{ fontSize: 17, padding: "20px 56px" }}>
            <Sparkles size={18} /> Create Your Profile — It's Free
          </Link>

          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 13, marginTop: 18, letterSpacing: "0.2px" }}>
            Campus Google account required · No payment · 5 minutes
          </p>
        </motion.div>

        {/* Footer */}
        <div style={{ marginTop: 100, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #E879F9, #C026D3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(232,121,249,0.3)" }}>
              <Heart size={12} fill="white" color="white" />
            </div>
            <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.2)", fontSize: 14 }}>The Circle · 2026</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Privacy", "/privacy-policy"], ["Terms", "/terms-of-service"], ["Guidelines", "/community-guidelines"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.18)", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.18)"}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="noise">
        <CursorGlow />
        <main style={{ background: "#030009", color: "#F8FAFC", overflowX: "hidden" }}>
          <Navbar />
          <Hero />
          <HowItWorks />
          <UrgencyStrip />
          <Countdown />
          <Features />
          <FAQ />
          <FinalCTA />
        </main>
      </div>
    </>
  );
}
