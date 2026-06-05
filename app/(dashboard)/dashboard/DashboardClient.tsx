"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Compass, MessageCircle, Calendar, Bell, ArrowRight, Users, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  user: any;
  matchCount: number;
  newMatchCount: number;
  upcomingEvents: any[];
  notifications: any[];
  recentMatches: any[];
  currentUserId: string;
}

const campusLabel: Record<string, string> = { HYDERABAD: "Hyderabad", BENGALURU: "Bengaluru", VIZAG: "Vizag" };
const categoryColors: Record<string, string> = {
  TECHNICAL: "#3B82F6", CULTURAL: "#F59E0B", SPORTS: "#10B981", CLUBS: "#A855F7", WORKSHOPS: "#F97316",
};

export default function DashboardClient({ user, matchCount, newMatchCount, upcomingEvents, notifications, recentMatches, currentUserId }: Props) {
  const stats = [
    { icon: Heart, label: "Total Matches", value: matchCount, color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
    { icon: Users, label: "New This Week", value: newMatchCount, color: "#A855F7", bg: "rgba(168,85,247,0.1)" },
    { icon: Eye, label: "Profile Views", value: user?._count?.likesReceived ?? 0, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    { icon: Bell, label: "Notifications", value: notifications.length, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 6 }}>
          Hey, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>
          {user?.branch ? `${user.branch} • ${campusLabel[user?.campus] ?? ""} Campus` : "Welcome to GITAMate!"}
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 24, backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>{s.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${s.color}40`, boxShadow: `0 0 20px ${s.color}20` }}>
                <s.icon size={16} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-1px" }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* Recent Matches */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: "white" }}>Recent Matches</h2>
            <Link href="/matches" style={{ color: "#EC4899", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>See all <ArrowRight size={14} /></Link>
          </div>
          {recentMatches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(236,72,153,0.2)" }}>
                <Heart size={32} color="#EC4899" />
              </div>
              <p style={{ color: "#94A3B8", fontSize: 15 }}>No matches yet.</p>
              <Link href="/discover" style={{ color: "#EC4899", fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 12, display: "inline-block" }}>Start discovering →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentMatches.map((match) => {
                const other = match.userAId === currentUserId ? match.userB : match.userA;
                return (
                  <Link key={match.id} href={`/chat/${match.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", padding: "12px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)"; e.currentTarget.style.background = "rgba(236,72,153,0.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  >
                    {other.image ? (
                      <img src={other.image} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }}>{other.name?.[0] ?? "?"}</div>
                    )}
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{other.name}</div>
                      <div style={{ fontSize: 13, color: "#94A3B8" }}>{other.branch}</div>
                    </div>
                    <MessageCircle size={18} color="#94A3B8" style={{ marginLeft: "auto", flexShrink: 0 }} />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: "white" }}>Upcoming Events</h2>
            <Link href="/events" style={{ color: "#22C55E", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>See all <ArrowRight size={14} /></Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(34,197,94,0.2)" }}>
                <Calendar size={32} color="#22C55E" />
              </div>
              <p style={{ color: "#94A3B8", fontSize: 15 }}>No events yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingEvents.map((event) => (
                <Link key={event.id} href="/events" style={{ display: "block", padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.background = "rgba(34,197,94,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "white", flex: 1, marginRight: 8 }}>{event.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: categoryColors[event.category] ?? "#22C55E", background: `${categoryColors[event.category] ?? "#22C55E"}15`, padding: "4px 10px", borderRadius: 100, flexShrink: 0, border: `1px solid ${categoryColors[event.category] ?? "#22C55E"}30` }}>{event.category}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94A3B8", display: "flex", gap: 8 }}>
                    <span>{formatDate(event.date)}</span>
                    <span>•</span>
                    <span style={{ color: "white" }}>{event.venue}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { href: "/discover", icon: Compass, label: "Discover People", color: "#EC4899" },
            { href: "/matches", icon: Heart, label: "View Matches", color: "#3B82F6" },
            { href: "/chat", icon: MessageCircle, label: "Open Chat", color: "#22C55E" },
            { href: "/events", icon: Calendar, label: "Browse Events", color: "#F59E0B" },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: "24px 20px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(255,255,255,0.05)`,
                textDecoration: "none",
                transition: "all 0.2s",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.borderColor = `${action.color}40`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${action.color}20`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${action.color}40` }}>
                <action.icon size={22} color={action.color} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "white", textAlign: "center" }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
