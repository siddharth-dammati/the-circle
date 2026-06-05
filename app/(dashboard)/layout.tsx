import { auth } from "@/lib/serverAuth";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import Sidebar from "@/components/shared/Sidebar";
import GlobalMessageListener from "@/components/shared/GlobalMessageListener";
import { Toaster } from "react-hot-toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.isBanned) redirect("/banned");
  
  // Check onboarding
  const userDoc = await adminDb.collection("users").doc(session.user.id).get();
  const user = userDoc.data();
  
  if (!user?.isOnboarded) redirect("/onboarding");

  return (
    <div style={{ minHeight: "100vh", background: "#1A0710", position: "relative", overflowX: "hidden", color: "white" }}>
      <style>{`
        .dashboard-main { padding: 24px; padding-bottom: 100px; min-height: 100vh; position: relative; z-index: 10; }
        @media (min-width: 768px) {
          .dashboard-main { margin-left: 260px; padding: 40px; padding-bottom: 40px; }
        }
      `}</style>
      
      {/* Deep space ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "100vw", height: "100vh", background: "radial-gradient(ellipse at center, rgba(236,72,153,0.05) 0%, rgba(34,197,94,0.02) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Toaster position="top-right" />
      <GlobalMessageListener userId={session.user.id} />
      
      <Sidebar user={session.user} />
      
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
