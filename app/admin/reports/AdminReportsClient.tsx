"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "#F59E0B",
  REVIEWED: "#3B82F6",
  RESOLVED: "#10B981",
  DISMISSED: "#64748B",
};
const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={12} />,
  REVIEWED: <Clock size={12} />,
  RESOLVED: <CheckCircle size={12} />,
  DISMISSED: <XCircle size={12} />,
};

export default function AdminReportsClient({ reports: initial }: { reports: any[] }) {
  const [reports, setReports] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      }
    } catch (e) { console.error(e); }
    setLoading(null);
  };

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", marginBottom: 24 }}>Reports ({reports.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reports.map((r) => (
          <div key={r.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: statusColors[r.status], background: `${statusColors[r.status]}15`, padding: "3px 10px", borderRadius: 8 }}>
                    {statusIcons[r.status]} {r.status}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginBottom: 6 }}>{r.reason}</div>
                {r.details && <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>{r.details}</div>}
                <div style={{ fontSize: 13, color: "#64748B" }}>
                  <span style={{ color: "#A855F7" }}>{r.reporter.name}</span> reported <span style={{ color: "#EF4444" }}>{r.reported.name}</span>
                  {" • "}{new Date(r.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>
              {r.status === "PENDING" && (
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={() => updateStatus(r.id, "RESOLVED")}
                    disabled={loading === r.id}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "DISMISSED")}
                    disabled={loading === r.id}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(100,116,139,0.3)", background: "rgba(100,116,139,0.08)", color: "#64748B", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
