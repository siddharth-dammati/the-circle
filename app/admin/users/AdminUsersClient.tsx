"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ban, CheckCircle, Shield, Search } from "lucide-react";

const campusLabel: Record<string, string> = { HYDERABAD: "Hyderabad", BENGALURU: "Bengaluru", VIZAG: "Vizag" };

export default function AdminUsersClient({ users: initial }: { users: any[] }) {
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = async (userId: string, isBanned: boolean) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !isBanned }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBanned: !isBanned } : u));
      }
    } catch (e) { console.error(e); }
    setLoading(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", marginBottom: 8 }}>All Users ({users.length})</h2>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <Search size={16} color="#64748B" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ width: "100%", padding: "10px 14px 10px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#F8FAFC", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["User", "Branch / Campus", "Status", "Matches", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                onMouseEnter={(e: any) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {u.image ? (
                      <img src={u.image} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>{u.name?.[0] ?? "?"}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>{u.name ?? "Unnamed"}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, color: "#94A3B8" }}>{u.branch ?? "—"}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{campusLabel[u.campus] ?? "—"}</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {u.isAdmin && <span style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 6 }}>Admin</span>}
                    {u.isBanned && <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 6 }}>Banned</span>}
                    {!u.isOnboarded && <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", background: "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: 6 }}>Setup Pending</span>}
                    {u.isOnboarded && !u.isBanned && <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 6 }}>Active</span>}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#94A3B8" }}>
                  {(u._count?.matchesA ?? 0) + (u._count?.matchesB ?? 0)}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {!u.isAdmin && (
                    <button
                      onClick={() => toggleBan(u.id, u.isBanned)}
                      disabled={loading === u.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 14px",
                        borderRadius: 8,
                        border: `1px solid ${u.isBanned ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                        background: u.isBanned ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                        color: u.isBanned ? "#10B981" : "#EF4444",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {loading === u.id ? "..." : u.isBanned ? <><CheckCircle size={14} /> Unban</> : <><Ban size={14} /> Ban</>}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
