import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function VerificationProcessPage() {
  return (
    <LegalPageLayout title="Verification Process" lastUpdated="June 2026">
      
      <div style={{ background: "rgba(34,197,94,0.05)", padding: 40, borderRadius: 24, border: "1px solid rgba(34,197,94,0.2)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 16 }}>The Gold Standard of Campus Safety</h2>
        <p style={{ color: "#22C55E", fontWeight: 600 }}>We do not allow fake profiles. We do not allow outsiders. Period.</p>
      </div>

      <p>
        At GITAMate, trust is the absolute foundation of our community. Unlike other platforms where anyone can create an account, GITAMate employs a rigorous, multi-step verification pipeline to ensure every single user is a currently enrolled student.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>1. Institutional Email Verification</h3>
      <p>
        Your journey begins with your official <strong>@gitam.edu</strong> email address. We do not accept Gmail, Yahoo, or any other public domain. When you register, a highly secure, time-sensitive cryptographic token is sent to your university inbox. This ensures you actively have access to official university infrastructure.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>2. Live Identity Validation</h3>
      <p>
        An email address isn't enough. During onboarding, our automated AI engine performs a secure, on-device liveness check. You will be asked to take a quick selfie, which is immediately cross-referenced against your uploaded profile pictures to ensure you are who you claim to be. 
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>3. Behavioral Monitoring</h3>
      <p>
        Verification is an ongoing process. Our proprietary security algorithms constantly monitor network activity for anomalous behavior, bot-like patterns, or signs of account compromise. If an account is flagged, it is immediately quarantined and submitted for manual human review within 15 minutes.
      </p>

      <div style={{ marginTop: 64, textAlign: "center", padding: 64, background: "rgba(255,255,255,0.02)", borderRadius: 32, border: "1px dashed rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 16 }}>Have issues getting verified?</div>
        <p style={{ fontSize: 18, marginBottom: 24 }}>If you are a legitimate student facing issues with our automated system, our support team is ready to assist you via manual ID review.</p>
        <a href="mailto:support@gitamate.com" style={{ display: "inline-block", background: "white", color: "black", padding: "16px 32px", borderRadius: 100, fontWeight: 700, textDecoration: "none" }}>Contact Support</a>
      </div>

    </LegalPageLayout>
  );
}
