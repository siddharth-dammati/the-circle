"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";
import MagnetButton from "@/components/landing/MagnetButton";

function BigFinalHeart() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = [];
    const colors = [];
    const colorA = new THREE.Color("#22C55E");
    const colorB = new THREE.Color("#EC4899");

    let i = 0;
    while (i < 10000) {
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;

      const val = Math.pow(x * x + (9 / 4) * (z * z) + y * y - 1, 3) - (x * x) * (y * y * y) - (9 / 80) * (z * z) * (y * y * y);

      if (val < 0) {
        positions.push(x * 5, y * 5, z * 5); // Massive scale

        const mixRatio = Math.max(0, Math.min(1, (x + 1) / 2));
        const mixedColor = colorA.clone().lerp(colorB, mixRatio);
        colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
        i++;
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial transparent vertexColors size={0.04} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} />
    </Points>
  );
}

export default function LandingFooter() {
  return (
    <section style={{ position: "relative", background: "#1A0710", overflow: "hidden" }}>
      
      {/* FINAL CTA SECTION */}
      <div className="footer-cta">
        <style>{`
          .footer-cta { height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
          .footer-sub { color: #94A3B8; font-size: 18px; margin-bottom: 40px; }
          .footer-btn { display: inline-block; background: white; color: black; padding: 16px 32px; border-radius: 100px; font-weight: 800; font-size: 18px; text-decoration: none; box-shadow: 0 0 40px rgba(255,255,255,0.2); transition: transform 0.3s; }
          @media (min-width: 768px) {
            .footer-cta { height: 120vh; }
            .footer-sub { font-size: 24px; margin-bottom: 56px; }
            .footer-btn { padding: 24px 64px; font-size: 24px; }
          }
        `}</style>
        
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.5 }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <BigFinalHeart />
          </Canvas>
        </div>
        
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, transparent, #1A0710)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 1000, padding: 24 }}>
          <h2 style={{ fontSize: "clamp(40px, 8vw, 120px)", fontWeight: 900, color: "white", lineHeight: 0.9, letterSpacing: "-4px", marginBottom: 32 }}>
            Your Next Connection Could Be <span style={{ background: "linear-gradient(90deg, #22C55E, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One Click Away.</span>
          </h2>
          <p className="footer-sub">Join the most trusted and exclusive student community at GITAM.</p>
          
          <MagnetButton>
            <Link
              href="/login"
              className="footer-btn"
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Create Your Profile
            </Link>
          </MagnetButton>
        </div>
      </div>

      {/* ACTUAL FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px", position: "relative", zIndex: 10, background: "#1A0710" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 64 }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 24 }}>
              <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-1px", display: "flex" }}>
                <span style={{ color: "#22C55E" }}>GITA</span>
                <span style={{ background: "linear-gradient(90deg, #22C55E 50%, #EC4899 50%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>M</span>
                <span style={{ color: "#EC4899" }}>ate</span>
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.6 }}>An exclusive university social platform where students find meaningful connections.</p>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: "white", marginBottom: 24, fontSize: 18 }}>Experience</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Study Partners", "Campus Events", "Secret Crush", "Networking"].map(link => (
                <a key={link} href="#" style={{ color: "#94A3B8", textDecoration: "none" }}>{link}</a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: "white", marginBottom: 24, fontSize: 18 }}>Trust & Safety</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Link href="/verification-process" style={{ color: "#94A3B8", textDecoration: "none" }}>Verification Process</Link>
              <Link href="/privacy-policy" style={{ color: "#94A3B8", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/terms-of-service" style={{ color: "#94A3B8", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="/community-guidelines" style={{ color: "#94A3B8", textDecoration: "none" }}>Community Guidelines</Link>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 80, paddingTop: 32, display: "flex", flexDirection: "column", gap: 16, color: "#64748B", fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>© 2026 GITAMate. For the love of campus life.</div>
            <div>Made with ❤️ for GITAM students.</div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, maxWidth: 600 }}>
            GITAMate is an independent student platform and is not affiliated with, endorsed by, or officially connected to GITAM (Gandhi Institute of Technology and Management) University.
          </div>
        </div>
      </footer>
    </section>
  );
}
