"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, BookOpen, Users, Activity, Sparkles, Book, Network, Heart, ShieldCheck } from "lucide-react";

export default function LandingNetwork() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} style={{ padding: "100px 0", background: "#1A0710", position: "relative", overflow: "hidden" }}>
      <style>{`
        .orbit-section { padding: 80px 24px; text-align: center; }
        .orbit-container { position: relative; width: 100%; height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 40px; }
        
        .ring-1 { width: 220px; height: 220px; border-radius: 50%; border: 1px dashed rgba(34,197,94,0.4); position: absolute; }
        .ring-2 { width: 340px; height: 340px; border-radius: 50%; border: 1px solid rgba(236,72,153,0.2); position: absolute; }
        .ring-3 { width: 480px; height: 480px; border-radius: 50%; border: 1px dashed rgba(59,130,246,0.3); position: absolute; }
        
        .node-pill { background: rgba(26,7,16,0.9); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 100px; color: white; font-weight: 600; font-size: 12px; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); white-space: nowrap; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
        .node-glow { box-shadow: 0 0 20px currentColor; }

        @media (min-width: 768px) {
          .orbit-section { padding: 120px 24px; }
          .orbit-container { height: 800px; margin-top: 80px; }
          .ring-1 { width: 350px; height: 350px; border: 2px dashed rgba(34,197,94,0.3); }
          .ring-2 { width: 600px; height: 600px; border: 1px solid rgba(236,72,153,0.2); }
          .ring-3 { width: 900px; height: 900px; border: 2px dashed rgba(59,130,246,0.2); }
          .node-pill { padding: 12px 24px; font-size: 15px; }
        }
      `}</style>
      
      {/* Massive Background Ambient Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120vw", height: "120%", background: "radial-gradient(circle at center, rgba(236,72,153,0.06) 0%, rgba(34,197,94,0.02) 40%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Header Text */}
        <motion.div style={{ opacity, y, textAlign: "center", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20, color: "#94A3B8", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <Activity size={14} color="#EC4899" />
            The Campus Ecosystem
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Find your people.<br />
            <span style={{ background: "linear-gradient(90deg, #EC4899, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Zero algorithms required.</span>
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "clamp(16px, 1.5vw, 18px)", maxWidth: 600, margin: "16px auto 0", lineHeight: 1.6 }}>
            Connect organically through shared contexts. We surface the paths that already cross yours every day on campus.
          </p>
        </motion.div>

        {/* MASSIVE ORBITAL VISUALIZATION */}
        <div className="orbit-container">

          {/* Central Glowing Core */}
          <div style={{ position: "absolute", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "absolute", width: 250, height: 250, background: "rgba(34,197,94,0.15)", filter: "blur(60px)", borderRadius: "50%" }} />
            <motion.div 
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 40px rgba(34,197,94,0.3)", "0 0 80px rgba(34,197,94,0.6)", "0 0 40px rgba(34,197,94,0.3)"] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.1))", border: "2px solid rgba(34,197,94,0.5)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)", position: "relative" }}
            >
              <ShieldCheck size={40} color="#22C55E" />
            </motion.div>
            <div style={{ marginTop: 16, background: "rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: 100, color: "white", fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", textTransform: "uppercase", letterSpacing: 1 }}>
              You
            </div>
          </div>

          {/* INNER RING: Close Proximity */}
          <motion.div className="ring-1" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
            {/* Node: Mutual Friends */}
            <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(34,197,94,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                <Users size={16} color="#22C55E" /> Mutual Friends
              </motion.div>
            </div>
            {/* Node: Same Hostel */}
            <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(34,197,94,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                <MapPin size={16} color="#22C55E" /> Same Hostel
              </motion.div>
            </div>
          </motion.div>

          {/* MIDDLE RING: Academics */}
          <motion.div className="ring-2" animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            {/* Node: Shared Elective */}
            <div style={{ position: "absolute", top: "50%", right: -60, transform: "translateY(-50%)" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(236,72,153,0.4)" }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                <BookOpen size={16} color="#EC4899" /> Shared Elective
              </motion.div>
            </div>
            {/* Node: Same Branch */}
            <div style={{ position: "absolute", top: "50%", left: -40, transform: "translateY(-50%)" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(236,72,153,0.4)" }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                <Activity size={16} color="#EC4899" /> Same Branch
              </motion.div>
            </div>
          </motion.div>

          {/* OUTER RING: Interests */}
          <motion.div className="ring-3" animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
            {/* Node: Study Partner */}
            <div style={{ position: "absolute", bottom: "15%", left: "10%" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(59,130,246,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
                <Book size={16} color="#3B82F6" /> Study Partner
              </motion.div>
            </div>
            {/* Node: Hackathon */}
            <div style={{ position: "absolute", top: "15%", right: "10%" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(245,158,11,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
                <Sparkles size={16} color="#F59E0B" /> Hackathon Team
              </motion.div>
            </div>
            {/* Node: Dating */}
            <div style={{ position: "absolute", top: -25, left: "50%", transform: "translateX(-50%)" }}>
              <motion.div className="node-pill" style={{ borderColor: "rgba(236,72,153,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
                <Heart size={16} color="#EC4899" /> Dating Intentions
              </motion.div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
