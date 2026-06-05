import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  if (id === session.user.id) redirect("/profile");

  const userDoc = await adminDb.collection("users").doc(id).get();
  if (!userDoc.exists) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 16 }}>User Not Found</h1>
        <p style={{ color: "#94A3B8", marginBottom: 32 }}>This profile doesn't exist or has been removed.</p>
        <Link href="/dashboard" style={{ padding: "12px 24px", background: "rgba(255,255,255,0.05)", borderRadius: 12, color: "white", textDecoration: "none", fontWeight: 700 }}>Go Back</Link>
      </div>
    );
  }

  // Check if they are matched
  const matchesSnap = await adminDb.collection("matches")
    .where("users", "array-contains", session.user.id)
    .get();
  
  let existingMatchId = null;
  for (const m of matchesSnap.docs) {
    if (m.data().users?.includes(id)) {
      existingMatchId = m.id;
      break;
    }
  }

  const profileUser = { id: userDoc.id, ...userDoc.data() };

  return <PublicProfileClient user={profileUser} currentUserId={session.user.id} matchId={existingMatchId} />;
}
