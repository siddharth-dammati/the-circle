import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 2026">
      
      <p>
        Your privacy is not a feature—it is a fundamental human right. At GITAMate, we have architected our entire infrastructure from the ground up to protect your personal data, your private conversations, and your campus identity.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>Zero Tracking. Zero Ads.</h3>
      <p>
        We do not sell your data. We do not run third-party trackers. We do not profile you for advertisers. GITAMate is an ad-free ecosystem supported entirely by the community. Your interactions, your matches, and your browsing habits are entirely your own business.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>End-to-End Encrypted Messaging</h3>
      <p>
        Every single message you send on GITAMate is secured using military-grade End-to-End Encryption (E2EE). The cryptographic keys are stored exclusively on your device. This means that neither we, nor your university, nor any third party can intercept or read your private chats.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>Data Retention & Right to be Forgotten</h3>
      <p>
        You have absolute control over your digital footprint. If you choose to delete your account, your data is not "deactivated" or "archived"—it is completely and irrevocably purged from our servers within 24 hours. We retain zero residual data.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>What Data We Do Collect</h3>
      <p>
        To make the platform function, we securely store:
      </p>
      <ul style={{ paddingLeft: 40, display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        <li>Your verified @gitam.edu email address (hashed)</li>
        <li>Your public profile information (Name, Branch, Year, Bio)</li>
        <li>Your matchmaking preferences (Study, Network, Date)</li>
        <li>Aggregated, anonymized telemetry for server health monitoring</li>
      </ul>

    </LegalPageLayout>
  );
}
