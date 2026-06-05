"use client";

import { motion } from "framer-motion";
import { Shield, Check } from "lucide-react";

export default function LandingInfo() {
  return (
    <section className="info-section" style={{ background: "#1A0710", color: "white", position: "relative", overflow: "hidden" }}>
      <style>{`
        .info-section { padding: 80px 24px; text-align: center; }
        .info-content { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        .features-list { display: flex; flex-direction: column; gap: 20px; text-align: left; margin-top: 40px; width: 100%; max-width: 500px; }
        @media (min-width: 1024px) {
          .info-section { padding: 120px 24px; }
        }
      `}</style>
      
      {/* Background Ambient Glow for Security Section */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw", height: "80%", background: "radial-gradient(circle at center, rgba(34,197,94,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Trust & Safety Text Only */}
        <div className="info-content">
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(34,197,94,0.05)", borderRadius: 100, border: "1px solid rgba(34,197,94,0.2)", marginBottom: 24, color: "#22C55E", fontSize: 13, fontWeight: 600 }}>
              <Shield size={14} />
              Exclusive Environment
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 24 }}>
              Uncompromising <br/>
              <span style={{ color: "white" }}>Trust & Safety.</span>
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 18, lineHeight: 1.6, maxWidth: 600 }}>
              Your peace of mind is our foundation. We employ rigorous verification and proactive moderation to maintain a pristine, highly curated campus environment.
            </p>
            
            <div className="features-list">
              {[
                { title: "Restricted Access", desc: "Exclusively for verified GITAM students. No exceptions." },
                { title: "Pristine Environment", desc: "Proactive moderation ensures a high-quality community." },
                { title: "Absolute Discretion", desc: "Your conversations and identity are strictly protected." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 + 0.4 }} viewport={{ once: true }}
                  style={{ display: "flex", gap: 16, alignItems: "center", background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={16} color="#22C55E" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: "#94A3B8" }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
