import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageLayout title="Community Guidelines" lastUpdated="June 2026">
      
      <div style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(219,39,119,0.02))", padding: 40, borderRadius: 24, border: "1px solid rgba(236,72,153,0.2)", marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 16 }}>Respect the Vibe</h2>
        <p style={{ color: "#EC4899", fontWeight: 600 }}>We are building a premium, safe, and wildly fun ecosystem. Don't be the reason we can't have nice things.</p>
      </div>

      <p>
        GITAMate is a reflection of the best parts of campus life. We want you to flirt, network, debate, and connect freely. However, freedom requires boundaries. Our community guidelines are strictly enforced to ensure the platform remains a safe harbor for every student.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>Zero Tolerance Policy</h3>
      <p>
        Any violation of the following will result in an immediate, permanent ban from the platform. There is no appeal process for:
      </p>
      <ul style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        <li><strong>Harassment or Bullying:</strong> Targeting, shaming, or repeatedly messaging someone who has indicated they are not interested.</li>
        <li><strong>Hate Speech:</strong> Slurs, discrimination, or attacks based on race, religion, gender, sexual orientation, or disability.</li>
        <li><strong>Non-Consensual Media:</strong> Sharing or threatening to share intimate images.</li>
        <li><strong>Predatory Behavior:</strong> Any attempt to extort, blackmail, or groom users.</li>
      </ul>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>Keep it Authentic</h3>
      <p>
        Do not impersonate other students, faculty, or staff. Do not use AI-generated profile pictures. The magic of GITAMate is that everyone here is exactly who they say they are. Catfishing is an instant ban.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>Reporting Bad Actors</h3>
      <p>
        If you see something, say something. Every profile and message thread has a one-tap report button. Our moderation team reviews all reports within 15 minutes. We have your back.
      </p>

    </LegalPageLayout>
  );
}
