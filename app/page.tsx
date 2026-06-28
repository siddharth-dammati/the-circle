"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, Shield, Zap, MessageCircle } from "lucide-react";

// ─── SMOOTH CURSOR GLOW ───────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY, position: "fixed", top: -300, left: -300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 9999 }}
    />
  );
}

// ─── AMBIENT ORBS ─────────────────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -80, 40, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-15%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,80,192,0.18) 0%, transparent 65%)", filter: "blur(40px)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        style={{ position: "absolute", top: "40%", left: "40%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%)", filter: "blur(50px)" }}
      />
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ["rgba(5,0,18,0)", "rgba(5,0,18,0.9)"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(30px)"]);
  const borderOpacity = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);

  return (
    <motion.nav style={{ background: bg, backdropFilter: blur, borderBottom: `1px solid`, borderColor: borderOpacity, position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "18px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #EC4899, #C026D3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(236,72,153,0.4)",
          }}>
            <Heart size={17} fill="white" color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 19, color: "white", letterSpacing: "-0.3px" }}>The Circle</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 20px", letterSpacing: "0.2px", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
          >
            Sign in
          </Link>
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #EC4899, #C026D3)",
            color: "white", fontSize: 14, fontWeight: 700,
            textDecoration: "none", padding: "11px 26px", borderRadius: 100,
            boxShadow: "0 4px 24px rgba(236,72,153,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 36px rgba(236,72,153,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(236,72,153,0.3)"; }}
          >
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
  const y = useTransform(scrollY, [0, 700], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const rings = [420, 320, 240, 160, 100];

  return (
    <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#050012" }}>
      <AmbientOrbs />

      {/* Concentric rings — the "portal" */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 1 }}>
        {rings.map((size, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
            transition={{ rotate: { duration: 40 + i * 15, repeat: Infinity, ease: "linear" }, scale: { duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" } }}
            style={{
              position: "absolute",
              width: size * 2,
              height: size * 2,
              borderRadius: "50%",
              border: `1px solid rgba(236,72,153,${0.04 + i * 0.015})`,
              boxShadow: `0 0 ${20 + i * 10}px rgba(236,72,153,${0.02 + i * 0.01}) inset`,
            }}
          />
        ))}
        {/* Center glow */}
        <div style={{ width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(192,38,211,0.1) 50%, transparent 70%)", filter: "blur(20px)" }} />
      </div>

      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 100, padding: "8px 20px", marginBottom: 36 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: "#EC4899", boxShadow: "0 0 8px #EC4899", display: "block" }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#F9A8D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>Registration Open · Hyderabad Campus</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          style={{ fontSize: "clamp(52px, 9vw, 108px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-4px", color: "white", marginBottom: 24 }}
        >
          Some things are<br />
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              background: "linear-gradient(135deg, #F9A8D4, #EC4899, #C026D3, #818CF8, #EC4899, #F9A8D4)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            worth waiting for.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          style={{ fontSize: "clamp(16px, 2.2vw, 20px)", color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto 20px", lineHeight: 1.75, fontWeight: 400 }}
        >
          Register on The Circle today. Your matches are being calculated and will be revealed <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>live on August 28th</strong> — Freshers Day, Hyderabad.
        </motion.p>

        {/* Urgency note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: "inline-block", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 10, padding: "10px 20px", marginBottom: 44 }}
        >
          <span style={{ fontSize: 13, color: "#FCD34D", fontWeight: 600 }}>⏳ Registrations lock before Aug 28 — act now to be included in the matching.</span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #EC4899 0%, #C026D3 100%)",
            color: "white", fontSize: 16, fontWeight: 700,
            textDecoration: "none", padding: "18px 44px", borderRadius: 100,
            boxShadow: "0 0 0 1px rgba(236,72,153,0.3), 0 10px 40px rgba(236,72,153,0.35)",
            letterSpacing: "-0.2px",
            transition: "transform 0.25s, box-shadow 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.4), 0 16px 56px rgba(236,72,153,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.3), 0 10px 40px rgba(236,72,153,0.35)"; }}
          >
            <Sparkles size={17} /> Register Now — It's Free
          </Link>
        </motion.div>

        {/* How it works link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ marginTop: 28 }}
        >
          <button
            onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.5px", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "rgba(255,255,255,0.15)" }}
          >
            See how it works ↓
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 22, zIndex: 10 }}
      >
        ↓
      </motion.div>
    </section>
  );
}

// ─── PROCESS: HOW IT WORKS ───────────────────────────────────────────────────
function Process() {
  const steps = [
    {
      num: "01",
      label: "Register Now",
      title: "Build your profile",
      body: "Sign in with your campus Google account. Add your photos, your interests, and tell us who you're looking to meet. It takes under 5 minutes.",
      icon: "✍️",
      color: "#EC4899",
      urgency: "Do this today",
    },
    {
      num: "02",
      label: "We calculate",
      title: "Our algorithm works",
      body: "Behind the scenes, our matching engine scores compatibility across branch, year, shared interests, and your stated preference. No random swipes. Curated for you.",
      icon: "🧠",
      color: "#818CF8",
      urgency: "Happening now",
    },
    {
      num: "03",
      label: "August 28th",
      title: "Matches are revealed",
      body: "On Freshers Day, all matches go live simultaneously. You'll see exactly who liked you back. Start chatting in-app or walk up and say hello — it's up to you.",
      icon: "🎉",
      color: "#F59E0B",
      urgency: "The big day",
    },
  ];

  return (
    <section id="process" style={{ padding: "140px 24px", background: "#050012", position: "relative", overflow: "hidden" }}>
      {/* Faint grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 100 }}
        >
          <div style={{ display: "inline-block", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 8, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#818CF8", letterSpacing: "2px", textTransform: "uppercase" }}>The Process</span>
          </div>
          <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1.05, maxWidth: 620 }}>
            Three steps.<br />One unforgettable day.
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 48, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(236,72,153,0.3), rgba(129,140,248,0.3), rgba(245,158,11,0.3))", pointerEvents: "none" }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{ display: "flex", gap: 48, alignItems: "flex-start", paddingBottom: i < steps.length - 1 ? 72 : 0 }}
            >
              {/* Step node */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 96, height: 96,
                  borderRadius: "50%",
                  background: `rgba(${step.color === "#EC4899" ? "236,72,153" : step.color === "#818CF8" ? "129,140,248" : "245,158,11"},0.08)`,
                  border: `1px solid ${step.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38,
                  boxShadow: `0 0 40px ${step.color}15`,
                }}>
                  {step.icon}
                </div>
                <div style={{ position: "absolute", bottom: -2, right: -2, background: step.color, borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${step.color}80` }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>{i + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ paddingTop: 12, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: "2px", textTransform: "uppercase" }}>{step.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 100, padding: "3px 10px" }}>{step.urgency}</span>
                </div>
                <h3 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 800, color: "white", letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.1 }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 16, lineHeight: 1.8, maxWidth: 560 }}>{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── URGENCY BANNER ───────────────────────────────────────────────────────────
function UrgencyBanner() {
  return (
    <section style={{ padding: "0 24px", background: "#050012" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: "linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(192,38,211,0.08) 50%, rgba(129,140,248,0.08) 100%)",
            border: "1px solid rgba(236,72,153,0.2)",
            borderRadius: 24,
            padding: "40px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.5), transparent)" }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F9A8D4", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>⚠️ Act Now</div>
            <h3 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 8 }}>Registrations close before August 28.</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
              After the cutoff, the matching engine locks and no new profiles can enter. If you're not registered when the clock hits zero, your matches won't be in the reveal.
            </p>
          </div>
          <Link href="/login" style={{
            flexShrink: 0,
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #EC4899, #C026D3)",
            color: "white", fontSize: 15, fontWeight: 700,
            textDecoration: "none", padding: "16px 36px", borderRadius: 100,
            boxShadow: "0 8px 32px rgba(236,72,153,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 48px rgba(236,72,153,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(236,72,153,0.4)"; }}
          >
            <Heart size={16} fill="white" /> Register before it's too late
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function Countdown() {
  const target = new Date("2026-08-28T09:00:00+05:30");
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [{ label: "Days", value: t.d }, { label: "Hours", value: t.h }, { label: "Minutes", value: t.m }, { label: "Seconds", value: t.s }];

  return (
    <section style={{ padding: "160px 24px", background: "#050012", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,80,192,0.07) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#FCD34D", letterSpacing: "2px", textTransform: "uppercase" }}>The Countdown</span>
          </div>

          <h2 style={{ fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 16 }}>
            Everything changes on<br />
            <span style={{ background: "linear-gradient(135deg, #F9A8D4, #EC4899, #C026D3)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>August 28th.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 17, marginBottom: 72, lineHeight: 1.7 }}>
            This is the moment registrations seal and all matches are simultaneously revealed. Be in the room when it happens.
          </p>

          {/* Clock */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 72 }}>
            {units.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20,
                  padding: "36px 12px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.4), transparent)" }} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={value}
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900, color: "white", letterSpacing: "-3px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
                  >
                    {String(value).padStart(2, "0")}
                  </motion.div>
                </AnimatePresence>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "2px", marginTop: 12 }}>{label}</div>
              </motion.div>
            ))}
          </div>

          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #EC4899, #C026D3)",
            color: "white", fontSize: 16, fontWeight: 700,
            textDecoration: "none", padding: "18px 52px", borderRadius: 100,
            boxShadow: "0 0 0 1px rgba(236,72,153,0.3), 0 12px 48px rgba(236,72,153,0.4)",
            transition: "transform 0.25s, box-shadow 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.4), 0 20px 64px rgba(236,72,153,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.3), 0 12px 48px rgba(236,72,153,0.4)"; }}
          >
            <Sparkles size={17} /> Register Before Time Runs Out
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function Features() {
  const items = [
    { icon: <Shield size={22} color="#EC4899" />, title: "Campus Only", body: "Exclusively for Hyderabad campus students. Every profile is verified through your institutional Google account.", accent: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.15)" },
    { icon: <Zap size={22} color="#818CF8" />, title: "Intelligent Matching", body: "We don't rely on swipes. Our scoring engine considers branch, year, interests, and your dating preference for curated compatibility.", accent: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.15)" },
    { icon: <MessageCircle size={22} color="#34D399" />, title: "Chat After Match", body: "The moment your matches are revealed on Aug 28, in-app messaging opens. Reach out instantly — no awkward contact sharing.", accent: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.15)" },
    { icon: <Heart size={22} color="#F59E0B" fill="rgba(245,158,11,0.3)" />, title: "Secret Crush", body: "Send a secret signal to someone you have your eye on. If they register and match with you — it's revealed on the big day.", accent: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.15)" },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "#050012", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ marginBottom: 80 }}>
          <div style={{ display: "inline-block", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#34D399", letterSpacing: "2px", textTransform: "uppercase" }}>What we offer</span>
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1.05, maxWidth: 560 }}>
            Not just an app.<br />A moment.
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{ background: item.accent, border: `1px solid ${item.border}`, borderRadius: 20, padding: "36px 30px" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>{item.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.3px" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.75 }}>{item.body}</p>
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
    { q: "Who can register on The Circle?", a: "Only verified Hyderabad campus students can join. You need to sign in with your campus Google account — no external emails allowed." },
    { q: "Do I have to register before August 28?", a: "Yes — absolutely. Registrations are locked before matches are calculated and revealed. If you're not registered when the cutoff hits, you won't appear in anyone's matches and won't receive any." },
    { q: "What happens when matches are revealed?", a: "On August 28th — Freshers Day — all mutual matches are revealed simultaneously in-app. You can then see who you matched with, view their profile, and start chatting." },
    { q: "Is my profile visible to everyone?", a: "Your profile is only visible to other registered, onboarded students. We never share your data outside the platform. Your privacy is our priority." },
    { q: "Can I update my preferences after registering?", a: "Yes. You can edit your interests, dating preference, bio, and photos any time before the registration cutoff. We'll always use your most recent profile for matching." },
    { q: "Is The Circle free?", a: "Completely free. No subscriptions, no paid tiers. The Circle is a campus experience — not a product." },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "#050012", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 900, color: "white", letterSpacing: "-1.5px" }}>Questions?</h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, marginTop: 12 }}>Everything you need to know before you register.</p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", padding: "24px 0", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left", gap: 20 }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: open === i ? "white" : "rgba(255,255,255,0.7)", transition: "color 0.2s" }}>{faq.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 24, color: open === i ? "#EC4899" : "rgba(255,255,255,0.2)", flexShrink: 0, lineHeight: 1 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <p style={{ paddingBottom: 24, color: "rgba(255,255,255,0.35)", fontSize: 15, lineHeight: 1.8 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ padding: "160px 24px 100px", background: "#050012", position: "relative", overflow: "hidden" }}>
      {/* Big soft glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 1000, height: 800, background: "radial-gradient(ellipse, rgba(200,80,192,0.1) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}>

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 60, marginBottom: 32, display: "inline-block" }}
          >
            💌
          </motion.div>

          <h2 style={{ fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 900, color: "white", letterSpacing: "-3px", lineHeight: 0.95, marginBottom: 28 }}>
            Your match is<br />
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                background: "linear-gradient(135deg, #F9A8D4, #EC4899, #C026D3, #818CF8, #EC4899)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              already registered.
            </motion.span>
          </h2>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 18, lineHeight: 1.8, marginBottom: 48, maxWidth: 520, margin: "0 auto 48px" }}>
            They're waiting. You just don't know who yet. Build your profile today, and find out on August 28th — live, on Freshers Day.
          </p>

          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg, #EC4899 0%, #C026D3 100%)",
            color: "white", fontSize: 17, fontWeight: 700,
            textDecoration: "none", padding: "20px 56px", borderRadius: 100,
            boxShadow: "0 0 0 1px rgba(236,72,153,0.25), 0 20px 60px rgba(236,72,153,0.4)",
            letterSpacing: "-0.2px",
            transition: "transform 0.25s, box-shadow 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.35), 0 28px 80px rgba(236,72,153,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(236,72,153,0.25), 0 20px 60px rgba(236,72,153,0.4)"; }}
          >
            <Sparkles size={18} /> Create Your Profile — Free
          </Link>

          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, marginTop: 20 }}>No payment. Just your campus email. Takes 5 minutes.</p>
        </motion.div>

        {/* Footer */}
        <div style={{ marginTop: 100, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #EC4899, #C026D3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={13} fill="white" color="white" />
            </div>
            <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.25)", fontSize: 14 }}>The Circle · 2026</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Privacy", "/privacy-policy"], ["Terms", "/terms-of-service"], ["Guidelines", "/community-guidelines"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
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
      <CursorGlow />
      <main style={{ background: "#050012", color: "#F8FAFC", fontFamily: "Inter, -apple-system, sans-serif", overflowX: "hidden" }}>
        <Navbar />
        <Hero />
        <Process />
        <UrgencyBanner />
        <Countdown />
        <Features />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}
