"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Zap, GraduationCap, MapPin, RefreshCw, Info } from "lucide-react";
import Link from "next/link";

const campusLabel: Record<string, string> = { HYDERABAD: "Hyderabad", BENGALURU: "Bengaluru", VIZAG: "Vizag" };
const yearLabel: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year", 5: "5th Year" };

interface Profile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  branch: string | null;
  year: number | null;
  campus: string | null;
  interests: string[];
  datingPreference: string;
  gender: string | null;
}

function SwipeCard({
  profile,
  onSwipe,
  isTop,
}: {
  profile: Profile;
  onSwipe: (id: string, direction: "like" | "pass" | "superlike") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe(profile.id, "like");
    else if (info.offset.x < -100) onSwipe(profile.id, "pass");
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: 420,
        x,
        rotate,
        cursor: isTop ? "grab" : "default",
        zIndex: isTop ? 10 : 1,
        userSelect: "none",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing", scale: 1.02 }}
    >
      <div
        style={{
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", height: 380, background: "linear-gradient(135deg, #1E1B4B, #312E81)" }}>
          {profile.image ? (
            <img src={profile.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 800, color: "rgba(168,85,247,0.3)" }}>
              {profile.name?.[0] ?? "?"}
            </div>
          )}
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)" }} />

          {/* Like / Pass overlays */}
          {isTop && (
            <>
              <motion.div style={{ position: "absolute", top: 24, right: 24, opacity: likeOpacity, background: "rgba(16,185,129,0.9)", border: "3px solid #10B981", borderRadius: 12, padding: "8px 16px", fontSize: 20, fontWeight: 800, color: "white", transform: "rotate(15deg)" }}>LIKE 💚</motion.div>
              <motion.div style={{ position: "absolute", top: 24, left: 24, opacity: passOpacity, background: "rgba(239,68,68,0.9)", border: "3px solid #EF4444", borderRadius: 12, padding: "8px 16px", fontSize: 20, fontWeight: 800, color: "white", transform: "rotate(-15deg)" }}>PASS ✗</motion.div>
            </>
          )}

          {/* Info overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
              <Link 
                href={`/profile/${profile.id}`} 
                target="_blank" 
                style={{ textDecoration: "none" }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  {profile.name}
                  <Info size={20} color="rgba(255,255,255,0.7)" />
                </h2>
              </Link>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {profile.branch && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94A3B8", fontSize: 13 }}>
                  <GraduationCap size={14} /> {profile.branch}{profile.year ? ` • ${yearLabel[profile.year]}` : ""}
                </span>
              )}
              {profile.campus && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94A3B8", fontSize: 13 }}>
                  <MapPin size={14} /> {campusLabel[profile.campus] ?? profile.campus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: "20px 24px 24px" }}>
          {profile.bio && (
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{profile.bio}</p>
          )}
          {profile.interests.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.interests.slice(0, 6).map((interest) => (
                <span key={interest} style={{ padding: "5px 12px", borderRadius: 100, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#A855F7", fontSize: 12, fontWeight: 600 }}>
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function DiscoverClient({ profiles: initial, currentUserId }: { profiles: Profile[]; currentUserId: string }) {
  const [profiles, setProfiles] = useState(initial);
  const [celebrating, setCelebrating] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSwipe = useCallback(async (id: string, direction: "like" | "pass" | "superlike") => {
    setLoading(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: id, isSuperLike: direction === "superlike" }),
      });
      const data = await res.json();
      if (data.isMatch) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
      }
    } catch (e) { console.error(e); }
    setLoading(null);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "calc(100vh - 96px)" }}>
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC", marginBottom: 6 }}>Discover</h1>
        <p style={{ color: "#64748B", fontSize: 15 }}>Swipe right to like, left to pass</p>
      </div>

      {/* Match Celebration */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setCelebrating(false)}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                borderRadius: 32,
                padding: "48px 64px",
                textAlign: "center",
                boxShadow: "0 32px 80px rgba(124,58,237,0.5)",
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "white", marginBottom: 8 }}>It&apos;s a Match!</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>You can now chat with each other!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div style={{ position: "relative", width: "100%", maxWidth: 420, height: 620, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {profiles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: 40 }}>
            <RefreshCw size={56} color="#334155" style={{ margin: "0 auto 20px" }} />
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>You&apos;ve seen everyone!</h3>
            <p style={{ color: "#64748B", fontSize: 15 }}>Come back later for new profiles.</p>
          </motion.div>
        ) : (
          [...profiles].reverse().map((profile, i) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              isTop={i === profiles.length - 1}
              onSwipe={handleSwipe}
            />
          ))
        )}
      </div>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <div style={{ display: "flex", gap: 32, marginTop: 32, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(profiles[profiles.length - 1].id, "pass")}
              style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
            >
              <X size={28} color="#EF4444" />
            </motion.button>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: "1px" }}>Pass</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(profiles[profiles.length - 1].id, "superlike")}
              style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Zap size={22} color="#F59E0B" />
            </motion.button>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "1px" }}>Crush</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(profiles[profiles.length - 1].id, "like")}
              style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Heart size={28} color="#10B981" />
            </motion.button>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "1px" }}>Like</span>
          </div>
        </div>
      )}
    </div>
  );
}
