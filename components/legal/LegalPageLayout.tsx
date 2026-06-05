"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import SmoothScroller from "@/components/landing/SmoothScroller";

export default function LegalPageLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <SmoothScroller>
      <main style={{ background: "#1A0710", color: "#F8FAFC", minHeight: "100vh", paddingBottom: 160 }}>
        
        {/* Navigation */}
        <nav style={{ padding: "40px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "#94A3B8", textDecoration: "none", fontSize: 18, fontWeight: 600, transition: "color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.color = "white"} onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}>
            <ArrowLeft size={24} />
            Back to Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={20} color="#22C55E" />
            <span style={{ color: "#22C55E", fontWeight: 700, fontSize: 16 }}>GITAMate Trust & Safety</span>
          </div>
        </nav>

        {/* Ambient Glow */}
        <div style={{ position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "100vw", height: "50vh", background: "radial-gradient(ellipse at center, rgba(34,197,94,0.1) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0, pointerEvents: "none" }} />

        {/* Content Container */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 0", position: "relative", zIndex: 10 }}>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 24 }}>
              {title}
            </h1>
            <div style={{ fontSize: 18, color: "#94A3B8", marginBottom: 80, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>
              Last Updated: {lastUpdated}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              fontSize: 22, 
              lineHeight: 1.8, 
              color: "#CBD5E1",
              display: "flex",
              flexDirection: "column",
              gap: 40
            }}
          >
            {children}
          </motion.div>

        </div>
      </main>
    </SmoothScroller>
  );
}
