"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";

const campusLabel: Record<string, string> = { HYDERABAD: "Hyderabad", BENGALURU: "Bengaluru", VIZAG: "Vizag" };
const yearLabel: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th" };

export default function MatchesClient({ matches, secretCrushes, currentUserId }: { matches: any[]; secretCrushes: any[]; currentUserId: string }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-1px", marginBottom: 6 }}>Your Matches</h1>
        <p style={{ color: "#94A3B8", fontSize: 16 }}>{matches.length} {matches.length === 1 ? "match" : "matches"} found</p>
      </motion.div>

      {/* Secret Crush Section */}
      {secretCrushes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={24} color="#EC4899" /> Secret Crushes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {secretCrushes.map((crush) => (
              <div key={crush.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 20,
                  background: crush.isRevealed ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.02)",
                  border: crush.isRevealed ? "1px solid rgba(236,72,153,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)"
                }}
              >
                {crush.toUser.image ? (
                  <img src={crush.toUser.image} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", filter: crush.isRevealed ? "none" : "blur(12px)", border: "2px solid rgba(255,255,255,0.1)" }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white", filter: crush.isRevealed ? "none" : "blur(8px)" }}>?</div>
                )}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: crush.isRevealed ? "white" : "#94A3B8", filter: crush.isRevealed ? "none" : "blur(6px)", marginBottom: 4 }}>
                    {crush.isRevealed ? crush.toUser.name : "Hidden"}
                  </div>
                  <div style={{ fontSize: 13, color: crush.isRevealed ? "#F59E0B" : "#64748B", fontWeight: crush.isRevealed ? 700 : 500 }}>
                    {crush.isRevealed ? "🔥 Mutual Crush!" : "Secret crush sent"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, backdropFilter: "blur(20px)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(236,72,153,0.2)" }}>
            <Heart size={40} color="#EC4899" />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 12 }}>No matches yet</h3>
          <p style={{ color: "#94A3B8", fontSize: 16, marginBottom: 32 }}>Keep exploring and swiping to find your perfect match.</p>
          <Link href="/discover" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 100, background: "linear-gradient(135deg, #EC4899, #F59E0B)", color: "white", textDecoration: "none", fontSize: 16, fontWeight: 800, boxShadow: "0 10px 20px rgba(236,72,153,0.3)" }}>
            <Sparkles size={20} /> Go Discover
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {matches.map((match, i) => {
            const other = match.userAId === currentUserId ? match.userB : match.userA;
            if (!other) return null; // Safe guard
            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 24,
                  overflow: "hidden",
                  backdropFilter: "blur(20px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column"
                }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(236,72,153,0.1)" }}
              >
                <div style={{ height: 220, position: "relative" }}>
                  {other.image ? (
                    <img src={other.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1A0710, #310d20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 900, color: "rgba(236,72,153,0.2)" }}>{other.name?.[0] ?? "?"}</div>
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,7,16,1) 0%, transparent 100%)" }} />
                  
                  {/* Glowing match badge */}
                  <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(26,7,16,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 100, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EC4899", boxShadow: "0 0 10px #EC4899" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "1px" }}>MATCHED</span>
                  </div>
                </div>
                
                <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", flex: 1, marginTop: -30, position: "relative", zIndex: 2 }}>
                  <Link href={`/profile/${other.id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.5px", marginBottom: 4 }}>{other.name}</h3>
                  </Link>
                  <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{other.branch || "Branch not specified"}</p>
                  <p style={{ color: "#64748B", fontSize: 13, marginBottom: 16 }}>{campusLabel[other.campus] ?? "Unknown"} Campus {other.year ? `• ${yearLabel[other.year]} Yr` : ""}</p>
                  
                  {other.interests && other.interests.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, marginTop: "auto" }}>
                      {other.interests.slice(0, 3).map((interest: string) => (
                        <span key={interest} style={{ padding: "6px 12px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", fontSize: 12, fontWeight: 600 }}>{interest}</span>
                      ))}
                      {other.interests.length > 3 && (
                        <span style={{ padding: "6px 12px", borderRadius: 100, background: "transparent", color: "#64748B", fontSize: 12, fontWeight: 600 }}>+{other.interests.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <Link
                    href={`/chat/${match.id}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 16, background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 800, transition: "all 0.2s", boxShadow: "0 10px 20px rgba(34,197,94,0.2)", marginTop: "auto" }}
                  >
                    <MessageCircle size={18} /> Send a Message
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
