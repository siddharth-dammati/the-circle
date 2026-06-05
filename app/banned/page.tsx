import Link from "next/link";


export default function BannedPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🚫</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#F8FAFC", marginBottom: 12 }}>Account Suspended</h1>
        <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          Your account has been suspended for violating GITAMate&apos;s community guidelines. If you believe this is a mistake, please contact support.
        </p>
        <a
          href="mailto:support@gitamate.in"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            color: "white",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}
