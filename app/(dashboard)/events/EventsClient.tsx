"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Filter, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["ALL", "TECHNICAL", "CULTURAL", "SPORTS", "CLUBS", "WORKSHOPS"];
const categoryColors: Record<string, string> = {
  TECHNICAL: "#3B82F6",
  CULTURAL: "#F59E0B",
  SPORTS: "#10B981",
  CLUBS: "#A855F7",
  WORKSHOPS: "#F97316",
};
const categoryEmoji: Record<string, string> = {
  TECHNICAL: "💻",
  CULTURAL: "🎭",
  SPORTS: "⚽",
  CLUBS: "🎯",
  WORKSHOPS: "🔧",
};

export default function EventsClient({ events: initial, currentUserId }: { events: any[]; currentUserId: string }) {
  const [filter, setFilter] = useState("ALL");
  const [rsvped, setRsvped] = useState<Set<string>>(new Set(
    initial.filter((e) => e.participants.some((p: any) => p.userId === currentUserId)).map((e) => e.id)
  ));
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === "ALL" ? initial : initial.filter((e) => e.category === filter);

  const handleRsvp = async (eventId: string) => {
    setLoading(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
      const data = await res.json();
      setRsvped((prev) => {
        const next = new Set(prev);
        if (data.rsvped) next.add(eventId);
        else next.delete(eventId);
        return next;
      });
    } catch (e) { console.error(e); }
    setLoading(null);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 6 }}>Campus Events</h1>
        <p style={{ color: "#64748B", fontSize: 16 }}>Discover and RSVP to events happening across GITAM campuses</p>
      </motion.div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: 100,
              border: `1px solid ${filter === cat ? (categoryColors[cat] ?? "#7C3AED") : "rgba(255,255,255,0.1)"}`,
              background: filter === cat ? `${categoryColors[cat] ?? "#7C3AED"}20` : "rgba(255,255,255,0.04)",
              color: filter === cat ? (categoryColors[cat] ?? "#A855F7") : "#64748B",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {cat !== "ALL" && categoryEmoji[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}
        >
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
              <Calendar size={56} color="#334155" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#64748B", fontSize: 16 }}>No events in this category yet.</p>
            </div>
          ) : (
            filtered.map((event, i) => {
              const isRsvped = rsvped.has(event.id);
              const color = categoryColors[event.category] ?? "#A855F7";
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${isRsvped ? color + "40" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "20px 20px 0",
                      background: `linear-gradient(135deg, ${color}10, transparent)`,
                      borderBottom: `1px solid ${color}15`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <span style={{ fontSize: 24 }}>{categoryEmoji[event.category]}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: "3px 10px", borderRadius: 8 }}>{event.category}</span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", marginBottom: 16, lineHeight: 1.4 }}>{event.title}</h3>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "16px 20px 20px" }}>
                    <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{event.description}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
                        <Calendar size={14} color={color} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
                        <MapPin size={14} color={color} />
                        <span>{event.venue} • {event.campus}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
                        <Users size={14} color={color} />
                        <span>{event._count.participants} attending</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRsvp(event.id)}
                      disabled={loading === event.id}
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: 12,
                        border: `1px solid ${isRsvped ? color + "50" : "transparent"}`,
                        background: isRsvped ? "transparent" : `linear-gradient(135deg, ${color}, ${color}CC)`,
                        color: isRsvped ? color : "white",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {loading === event.id ? "..." : isRsvped ? "✓ RSVP'd" : "RSVP Now"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
