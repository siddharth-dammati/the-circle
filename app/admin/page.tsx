import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Flag, Calendar, Heart } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/dashboard");

  const [userCountSnap, reportCountSnap, eventCountSnap, matchCountSnap, pendingReportsQuery, recentUsersQuery] = await Promise.all([
    adminDb.collection("users").where("isBanned", "==", false).count().get(),
    adminDb.collection("reports").where("status", "==", "PENDING").count().get(),
    adminDb.collection("events").count().get(),
    adminDb.collection("matches").count().get(),
    adminDb.collection("reports").where("status", "==", "PENDING").orderBy("createdAt", "desc").limit(5).get(),
    adminDb.collection("users").orderBy("createdAt", "desc").limit(10).get(),
  ]);

  const userCount = userCountSnap.data().count;
  const reportCount = reportCountSnap.data().count;
  const eventCount = eventCountSnap.data().count;
  const matchCount = matchCountSnap.data().count;

  const pendingReportsDocs = pendingReportsQuery.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  const pendingReports = await Promise.all(
    pendingReportsDocs.map(async (r: any) => {
      let reporterData = { name: "Unknown", email: "" };
      let reportedData = { name: "Unknown", email: "" };
      
      if (r.reporterId) {
        const reporterDoc = await adminDb.collection("users").doc(r.reporterId).get();
        if (reporterDoc.exists) reporterData = reporterDoc.data() as any;
      }
      
      if (r.reportedId) {
        const reportedDoc = await adminDb.collection("users").doc(r.reportedId).get();
        if (reportedDoc.exists) reportedData = reportedDoc.data() as any;
      }

      return {
        ...r,
        reporter: reporterData,
        reported: reportedData,
        createdAt: r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || Date.now()),
      };
    })
  );

  const recentUsers = recentUsersQuery.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      image: data.image,
      branch: data.branch,
      campus: data.campus,
      isOnboarded: data.isOnboarded,
      isBanned: data.isBanned,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    };
  });

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "#3B82F6" },
    { label: "Pending Reports", value: reportCount, icon: Flag, color: "#EF4444" },
    { label: "Events", value: eventCount, icon: Calendar, color: "#10B981" },
    { label: "Total Matches", value: matchCount, icon: Heart, color: "#A855F7" },
  ];

  const formatDate = (d: Date) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: "#64748B", fontSize: 13 }}>{s.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Pending Reports */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>Pending Reports</h2>
            <Link href="/admin/reports" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all</Link>
          </div>
          {pendingReports.length === 0 ? (
            <p style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No pending reports ✅</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingReports.map((r: any) => (
                <div key={r.id} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#FCA5A5", marginBottom: 4 }}>{r.reason}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{r.reporter.name} reported {r.reported.name} • {formatDate(r.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>Recent Users</h2>
            <Link href="/admin/users" style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentUsers.map((u: any) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {u.image ? (
                  <img src={u.image} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>{u.name?.[0] ?? "?"}</div>
                )}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name ?? "Unnamed"}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{u.email}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {u.isBanned && <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 6 }}>Banned</span>}
                  {!u.isOnboarded && <span style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 6 }}>Setup</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
