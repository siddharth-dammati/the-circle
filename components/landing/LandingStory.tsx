"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Sparkles, MessageCircle, Camera, Heart } from "lucide-react";

// Invisible block that tracks scroll position
function ScrollTrigger({ index, setIndex }: { index: number; setIndex: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) setIndex(index);
  }, [isInView, index, setIndex]);

  return <div ref={ref} style={{ height: "100vh", width: "100%" }} />;
}

// Reusable text block that crossfades in place
function TextReveal({ activeIndex, index, step, color, title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ position: "absolute", maxWidth: 500, pointerEvents: activeIndex === index ? "auto" : "none" }}
      className="story-text-inner"
    >
      <div style={{ color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontSize: 14 }}>{step}</div>
      <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 16 }}>{title}</h2>
      <p style={{ color: "#94A3B8", fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}

export default function LandingStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section style={{ position: "relative", height: "400vh", background: "#1A0710" }}>
      <style>{`
        .story-container { display: flex; flex-direction: column; }
        .story-visuals { width: 100%; height: 50vh; display: flex; align-items: center; justify-content: center; position: relative; padding-top: 40px; }
        .story-text { width: 100%; height: 50vh; position: relative; display: flex; padding: 40px 24px; align-items: flex-start; justify-content: center; }
        .story-text-inner { text-align: center; padding: 0 24px; }
        .visual-scale-1 { transform: scale(0.8); }
        .visual-scale-2 { transform: scale(0.8); }
        .visual-scale-3 { transform: scale(0.7); }
        .visual-scale-4 { transform: scale(0.7); }
        
        @media (min-width: 768px) {
          .story-container { flex-direction: row; }
          .story-visuals { width: 50%; height: 100vh; padding-top: 0; }
          .story-text { width: 50%; height: 100vh; padding-right: 5%; align-items: center; justify-content: flex-start; }
          .story-text-inner { text-align: left; padding: 0; }
          .visual-scale-1 { transform: scale(1); }
          .visual-scale-2 { transform: scale(1); }
          .visual-scale-3 { transform: scale(1); }
          .visual-scale-4 { transform: scale(1); }
        }
      `}</style>
      
      {/* 1. Invisible Scroll Track (400vh total) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }}>
        <ScrollTrigger index={0} setIndex={setActiveIndex} />
        <ScrollTrigger index={1} setIndex={setActiveIndex} />
        <ScrollTrigger index={2} setIndex={setActiveIndex} />
        <ScrollTrigger index={3} setIndex={setActiveIndex} />
      </div>

      {/* 2. The Cinematic Screen (Sticky 100vh) */}
      <div className="story-container" style={{ position: "sticky", top: 0, height: "100vh", width: "100%", maxWidth: 1200, margin: "0 auto", overflow: "hidden" }}>
        
        {/* LEFT COLUMN: STICKY VISUALS */}
        <div className="story-visuals">
          
          {/* Visual 1: Verified Profile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: activeIndex === 0 ? 1 : 0, scale: activeIndex === 0 ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}
            className="visual-scale-1"
          >
            <div style={{ width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34, 197, 94, 0.3)", boxShadow: "0 0 80px rgba(34, 197, 94, 0.2)" }}>
              <ShieldCheck size={80} color="#22C55E" />
            </div>
            <div style={{ marginTop: 32, background: "rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: 100, color: "white", fontWeight: 700, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              @gitam.edu Verified
            </div>
          </motion.div>

          {/* Visual 2: The Discovery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: activeIndex === 1 ? 1 : 0, scale: activeIndex === 1 ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}
            className="visual-scale-2"
          >
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 0, border: "2px dashed rgba(236, 72, 153, 0.3)", borderRadius: "50%" }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 20, border: "2px dashed rgba(34, 197, 94, 0.3)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #FB7185)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(236, 72, 153, 0.4)" }}>
                <Sparkles size={40} color="white" />
              </div>
            </div>
          </motion.div>

          {/* Visual 3: The Connection */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: activeIndex === 2 ? 1 : 0, scale: activeIndex === 2 ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}
            className="visual-scale-3"
          >
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 40, borderRadius: 32, border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", marginBottom: 24 }}>
                <div style={{ background: "rgba(34, 197, 94, 0.1)", padding: 20, borderRadius: "20px 20px 20px 4px", color: "#22C55E", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <MessageCircle size={32} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", justifyContent: "flex-end" }}>
                <div style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", padding: 20, borderRadius: "20px 20px 4px 20px", color: "white", boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)" }}>
                  <MessageCircle size={32} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual 4: The Memories */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: activeIndex === 3 ? 1 : 0, scale: activeIndex === 3 ? 1 : 0.9 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}
            className="visual-scale-4"
          >
            <div style={{ position: "relative", width: 300, height: 400 }}>
              <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: 0, left: -20, background: "rgba(255,255,255,0.05)", width: 200, height: 260, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera size={48} color="rgba(255,255,255,0.2)" />
              </motion.div>
              <motion.div animate={{ rotate: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", bottom: 20, right: -20, background: "rgba(255,255,255,0.08)", width: 220, height: 280, borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(20px)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={48} color="#EC4899" />
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: STICKY TEXT REVEALS */}
        <div className="story-text">
          
          <TextReveal activeIndex={activeIndex} index={0} step="Step 01" color="#22C55E" title="The Spark." desc="It all starts with a verified @gitam.edu email. Create your profile, set your intentions (Study, Friendship, or Dating), and enter the exclusive ecosystem." />
          <TextReveal activeIndex={activeIndex} index={1} step="Step 02" color="#EC4899" title="The Discovery." desc="Serendipity meets design. We surface the paths that already cross yours on campus, introducing you to highly curated connections you actually want to meet." />
          <TextReveal activeIndex={activeIndex} index={2} step="Step 03" color="#3B82F6" title="The Connection." desc="Match and start talking. Our zero-tolerance moderation ensures your late-night conversations and study sessions remain within a respectful, entirely exclusive environment." />
          <TextReveal activeIndex={activeIndex} index={3} step="Step 04" color="#F59E0B" title="The Memories." desc="Move offline. Attend exclusive campus events together, ace your midterms, and turn digital matches into lifelong university memories." />

        </div>

      </div>
    </section>
  );
}
