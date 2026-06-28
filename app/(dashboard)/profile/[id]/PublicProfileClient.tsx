"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MapPin, GraduationCap, Link2, MessageCircle, Flag, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const yearLabel: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th" };

interface Props {
  user: any;
  currentUserId: string;
  matchId: string | null;
}

export default function PublicProfileClient({ user, currentUserId, matchId }: Props) {
  const router = useRouter();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    if (!confirm(`Are you sure you want to block ${user.name}? This will remove any matches and they won't be able to contact you.`)) return;
    setIsBlocking(true);
    try {
      const res = await fetch(`/api/users/${user.id}/block`, { method: "POST" });
      if (res.ok) {
        toast.success("User blocked");
        router.push("/discover");
      } else throw new Error();
    } catch {
      toast.error("Failed to block user");
      setIsBlocking(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    try {
      const res = await fetch(`/api/users/${user.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (res.ok) {
        toast.success("Report submitted successfully");
        setShowReportModal(false);
      } else throw new Error();
    } catch {
      toast.error("Failed to submit report");
    }
  };

  return (
    <>
      <style>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 16px;
          padding-bottom: 120px;
        }
        .profile-avatar {
          width: 140px;
          height: 140px;
          font-size: 48px;
        }
        .profile-name {
          font-size: 36px;
        }
        .profile-card {
          padding: 32px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .action-bar {
          width: calc(100% - 48px);
          max-width: 600px;
          padding: 8px;
        }
        @media (max-width: 768px) {
          .profile-container {
            padding: 12px;
            padding-bottom: 100px;
          }
          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 36px;
          }
          .profile-name {
            font-size: 28px;
          }
          .profile-card {
            padding: 20px;
          }
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .action-bar {
            width: calc(100% - 24px);
            padding: 6px;
          }
        }
      `}</style>
      <div className="profile-container">
        {/* Header Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", color: "white", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", marginBottom: 20 }}>
            {user.image ? (
              <img src={user.image} alt="" className="profile-avatar" style={{ borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(236,72,153,0.3)", boxShadow: "0 0 40px rgba(236,72,153,0.2)" }} />
            ) : (
              <div className="profile-avatar" style={{ borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", border: "4px solid rgba(236,72,153,0.3)", boxShadow: "0 0 40px rgba(236,72,153,0.2)" }}>
                {user.name?.[0] ?? "?"}
              </div>
            )}
            {user.isVerified && (
              <div style={{ position: "absolute", bottom: 0, right: 0, background: "#1A0710", borderRadius: "50%", padding: 4 }}>
                <ShieldCheck size={24} color="#22C55E" />
              </div>
            )}
          </div>
          
          <h1 className="profile-name" style={{ fontWeight: 900, color: "white", letterSpacing: "-1px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            {user.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#94A3B8", fontSize: 14, fontWeight: 500, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={16} /> {user.campus ? `${user.campus.charAt(0)}${user.campus.slice(1).toLowerCase()}` : "Unknown"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><GraduationCap size={16} /> {user.year ? `${yearLabel[user.year] || user.year} Year` : "Unknown Year"}</span>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          
          {/* Bio & Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="profile-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, backdropFilter: "blur(20px)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 12 }}>About</h2>
            <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{user.bio || "This user hasn't written a bio yet."}</p>
            
            <div className="profile-grid">
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Branch</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{user.branch || "Not specified"}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Looking For</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{user.datingPreference ? user.datingPreference.toLowerCase() : "everyone"}</div>
              </div>
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="profile-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, backdropFilter: "blur(20px)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 12 }}>Interests</h2>
            {user.interests && user.interests.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {user.interests.map((interest: string) => (
                  <span key={interest} style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", color: "#EC4899", padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748B", fontSize: 14 }}>No interests listed.</p>
            )}
          </motion.div>

          {/* Socials */}
          {(user.instagramUrl || user.linkedinUrl) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="profile-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, backdropFilter: "blur(20px)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 16 }}>Social Links</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {user.instagramUrl && (
                  <a href={user.instagramUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 16, color: "white", textDecoration: "none", fontWeight: 600, flex: "1 1 140px", justifyContent: "center" }}>
                    <Link2 size={18} color="#EC4899" /> Instagram
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 16, color: "white", textDecoration: "none", fontWeight: 600, flex: "1 1 140px", justifyContent: "center" }}>
                    <Link2 size={18} color="#3B82F6" /> LinkedIn
                  </a>
                )}
              </div>
            </motion.div>
          )}

        </div>

        {/* Floating Action Bar */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="action-bar" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(26,7,16,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, backdropFilter: "blur(40px)", display: "flex", gap: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 50 }}>
          {matchId ? (
            <Link href={`/chat/${matchId}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "white", padding: "14px 24px", borderRadius: 100, textDecoration: "none", fontWeight: 700, fontSize: 15, boxShadow: "0 10px 20px rgba(34,197,94,0.3)" }}>
              <MessageCircle size={18} /> Message
            </Link>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 13, fontWeight: 600, padding: "0 16px", textAlign: "center" }}>
              Match to message.
            </div>
          )}
          <button onClick={() => setShowReportModal(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F59E0B", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(245,158,11,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
            <Flag size={18} />
          </button>
          <button onClick={handleBlock} disabled={isBlocking} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#EF4444", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(239,68,68,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
            <ShieldAlert size={18} />
          </button>
        </motion.div>

        {/* Report Modal */}
        <AnimatePresence>
          {showReportModal && (
            <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} onClick={() => setShowReportModal(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: "relative", width: "100%", maxWidth: 400, background: "rgba(26,7,16,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 8 }}>Report User</h3>
                <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 20 }}>Please specify why you are reporting {user.name}.</p>
                <form onSubmit={handleReport}>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Reason for report..."
                    required
                    style={{ width: "100%", height: 100, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontFamily: "Inter, sans-serif", resize: "none", outline: "none", marginBottom: 20 }}
                  />
                  <div style={{ display: "flex", gap: 12 }}>
                    <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                    <button type="submit" disabled={!reportReason.trim()} style={{ flex: 1, padding: "12px", borderRadius: 12, background: reportReason.trim() ? "#F59E0B" : "rgba(255,255,255,0.1)", border: "none", color: "white", fontWeight: 700, cursor: reportReason.trim() ? "pointer" : "not-allowed" }}>Submit</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
