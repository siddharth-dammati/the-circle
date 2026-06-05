import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 2026">
      
      <p>
        Welcome to GITAMate. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree with any part of these terms, you may not use the service.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>1. Eligibility</h3>
      <p>
        GITAMate is exclusively for current students of GITAM University. To use this service, you must possess a valid, active `@gitam.edu` email address. If you graduate, withdraw, or are expelled from the university, your access to the platform may be revoked to maintain the integrity of the student network.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>2. User Conduct</h3>
      <p>
        You are solely responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials that you submit, post or display on or via the Service.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>3. Account Termination</h3>
      <p>
        We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you. Violation of these Terms of Service may, in our sole discretion, result in termination of your GITAMate account.
      </p>

      <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", marginTop: 40, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>4. Limitation of Liability</h3>
      <p>
        In no event will GITAMate, or its suppliers or licensors, be liable with respect to any subject matter of this agreement under any contract, negligence, strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute products or services.
      </p>

    </LegalPageLayout>
  );
}
