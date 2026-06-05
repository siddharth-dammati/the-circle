import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import MatchesClient from "./MatchesClient";

export const metadata = { title: "Matches" };

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const matchesSnapshot = await adminDb.collection("matches").where("users", "array-contains", userId).get();
  
  const matches = await Promise.all(matchesSnapshot.docs.map(async doc => {
    const data = doc.data();
    const userAId = data.userAId || (data.users && data.users[0]);
    const userBId = data.userBId || (data.users && data.users[1]);

    const [userADoc, userBDoc] = await Promise.all([
      userAId ? adminDb.collection("users").doc(userAId).get() : Promise.resolve(null),
      userBId ? adminDb.collection("users").doc(userBId).get() : Promise.resolve(null)
    ]);
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      userA: userADoc?.exists ? { id: userADoc.id, ...userADoc.data() } : null,
      userB: userBDoc?.exists ? { id: userBDoc.id, ...userBDoc.data() } : null
    };
  }));

  matches.sort((a, b) => {
    const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const secretCrushesSnapshot = await adminDb.collection("secretCrushes").where("fromUserId", "==", userId).get();
  
  const secretCrushes = await Promise.all(secretCrushesSnapshot.docs.map(async doc => {
    const data = doc.data();
    let toUser = null;
    if (data.toUserId) {
      const toUserDoc = await adminDb.collection("users").doc(data.toUserId).get();
      if (toUserDoc.exists) {
        toUser = { id: toUserDoc.id, ...toUserDoc.data() };
      }
    }
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      toUser
    };
  }));

  return <MatchesClient matches={matches as any[]} secretCrushes={secretCrushes as any[]} currentUserId={userId} />;
}
