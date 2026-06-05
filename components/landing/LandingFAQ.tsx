"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "Do I need a GITAM email to join?", a: "Yes, GITAMate is an exclusive community. You must verify an active @gitam.edu email address to gain access." },
  { q: "Is this just a dating app?", a: "Not at all. While you can find romantic relationships, GITAMate is equally focused on finding study partners, forming friendships, and networking." },
  { q: "How does the Secret Crush feature work?", a: "You can anonymously select someone you have a crush on. They will never know unless they also secretly select you, at which point both of you are notified!" },
  { q: "Is my data secure?", a: "Absolutely. We use end-to-end encryption for messaging and never share or sell your data to third parties." }
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: "160px 24px", background: "#1A0710" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>
            Got Questions?
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, i) => (
            <div 
              key={i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 24,
                padding: "24px 32px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "white" }}>{faq.q}</h3>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                  <ChevronDown color="#94A3B8" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ color: "#94A3B8", marginTop: 16, lineHeight: 1.6 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
