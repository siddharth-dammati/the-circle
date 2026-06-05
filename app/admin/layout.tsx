import { auth } from "@/lib/serverAuth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.isAdmin) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #EF4444, #DC2626)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2L13.09 8.26L22 9L15.5 14.74L17.18 22L12 18.5L6.82 22L8.5 14.74L2 9L10.91 8.26L12 2Z"/></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>GITAMate Admin</h1>
              <p style={{ fontSize: 12, color: "#64748B" }}>Moderation Dashboard</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
