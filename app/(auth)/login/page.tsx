"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const ALLOWED_DOMAIN = "student.gitam.edu";

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const errorParam = params.get("error");
  const [error, setError] = useState(errorParam);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const email = result.user.email || "";
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await auth.signOut();
        setError("domain");
        setLoading(false);
        return;
      }

      // Get ID token to send to server for session cookie
      const idToken = await result.user.getIdToken();
      
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err) {
      console.error(err);
      setError("auth");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1A0710",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: -200,
          left: -200,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          bottom: -150,
          right: -100,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 32,
          padding: 48,
          position: "relative",
          zIndex: 1,
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.05))",
              border: "1px solid rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 12px 40px rgba(34,197,94,0.2)",
            }}
          >
            <ShieldCheck size={32} color="#22C55E" />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Enter The Circle
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.6 }}>
            Sign in with your official GITAM email to get verified.
          </p>
        </div>

        {/* Error messages */}
        {error === "domain" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 24,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ color: "#FCA5A5", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Access Denied</div>
              <div style={{ color: "#FCA5A5", fontSize: 13, opacity: 0.8 }}>
                Only @student.gitam.edu email addresses are allowed. Please use your university Google account.
              </div>
            </div>
          </motion.div>
        )}

        {error && error !== "domain" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle size={18} color="#EF4444" />
            <span style={{ color: "#FCA5A5", fontSize: 13 }}>Authentication failed. Please try again.</span>
          </motion.div>
        )}

        {/* Google Sign In Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: "white",
            border: "none",
            borderRadius: 14,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#1a1a1a",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            marginBottom: 28,
            transition: "box-shadow 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={22} color="#1a1a1a" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </motion.button>

        {/* Divider note */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 16,
            padding: "16px 20px",
          }}
        >
          <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", lineHeight: 1.6 }}>
            <strong style={{ color: "#22C55E" }}>Strict Verification:</strong> You must sign in using your official{" "}
            <strong style={{ color: "white" }}>@student.gitam.edu</strong> Google account to join.
          </p>
        </div>

        {/* Footer */}
        <p style={{ color: "#334155", fontSize: 12, textAlign: "center", marginTop: 28, lineHeight: 1.6 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#1A0710", minHeight: "100vh" }} />}>
      <LoginContent />
    </Suspense>
  );
}
