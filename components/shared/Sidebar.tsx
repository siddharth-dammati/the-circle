"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, Compass, Heart, MessageCircle,
  Calendar, User, Settings, LogOut, ShieldCheck, Shield
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null; isAdmin: boolean };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .app-sidebar {
          position: fixed; bottom: 0; left: 0; right: 0; top: auto;
          width: 100%; height: 70px;
          background: rgba(26,7,16,0.95); backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.05); border-right: none;
          display: flex; flex-direction: row; align-items: center; justify-content: space-around;
          padding: 0 16px; z-index: 100;
        }
        .sidebar-header, .sidebar-footer { display: none; }
        .nav-container { display: flex; flex-direction: row; gap: 4px; flex: 1; justify-content: space-between; }
        .nav-link { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 12px; font-size: 10px; border-radius: 12px; justify-content: center; position: relative; text-decoration: none; transition: all 0.2s; }
        .nav-link-text { display: none; }
        .nav-active-bar { position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 16px; height: 3px; border-radius: 2px; background: linear-gradient(135deg, #EC4899, #F59E0B); }
        
        @media (min-width: 768px) {
          .app-sidebar {
            top: 0; bottom: 0; left: 0; right: auto;
            width: 260px; height: 100vh;
            border-top: none; border-right: 1px solid rgba(255,255,255,0.05);
            flex-direction: column; justify-content: flex-start;
            padding: 24px 16px;
          }
          .sidebar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; padding-left: 8px; }
          .sidebar-footer { display: block; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin-top: auto; }
          .nav-container { flex-direction: column; gap: 4px; justify-content: flex-start; flex: none; width: 100%; }
          .nav-link { flex-direction: row; gap: 12px; padding: 11px 14px; font-size: 14px; justify-content: flex-start; }
          .nav-link-text { display: block; }
          .nav-active-bar { left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; bottom: auto; background: linear-gradient(135deg, #EC4899, #F59E0B); }
        }
      `}</style>
      
      <aside className="app-sidebar">
        {/* Logo (Desktop Only) */}
        <div className="sidebar-header">
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.05))", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={20} color="#22C55E" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "white" }}>
            The<span style={{ background: "linear-gradient(135deg, #EC4899, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Circle</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="nav-container">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{
                  background: active ? "rgba(236,72,153,0.1)" : "transparent",
                  color: active ? "#EC4899" : "#94A3B8",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {active && <motion.div layoutId="activeNav" className="nav-active-bar" />}
                <item.icon size={20} />
                <span className="nav-link-text">{item.label}</span>
              </Link>
            );
          })}
          
          {user.isAdmin && (
            <Link
              href="/admin"
              className="nav-link"
              style={{
                background: pathname.startsWith("/admin") ? "rgba(239,68,68,0.1)" : "transparent",
                color: pathname.startsWith("/admin") ? "#F87171" : "#94A3B8",
                fontWeight: 600,
                marginTop: "auto"
              }}
            >
              <Shield size={20} />
              <span className="nav-link-text">Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* User Footer (Desktop Only) */}
        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "0 4px" }}>
            {user.image ? (
              <img src={user.image} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>
                {user.name?.[0] ?? "U"}
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              await auth.signOut();
              await fetch("/api/session", { method: "DELETE" });
              window.location.href = "/login";
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <LogOut size={16} /> <span className="nav-link-text">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
