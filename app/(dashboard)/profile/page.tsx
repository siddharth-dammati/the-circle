import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [userDoc, matchesSnapshot, likesReceivedSnapshot] = await Promise.all([
    adminDb.collection("users").doc(userId).get(),
    adminDb.collection("matches").where("users", "array-contains", userId).get(),
    adminDb.collection("likes").where("toUserId", "==", userId).count().get()
  ]);

  if (!userDoc.exists) redirect("/login");

  const data = userDoc.data()!;
  
  const matches = matchesSnapshot.docs.map(d => d.data());
  const matchesA = matches.filter(m => m.userAId === userId || (m.users && m.users[0] === userId)).length;
  const matchesB = matches.filter(m => m.userBId === userId || (m.users && m.users[1] === userId)).length;

  const user = {
    id: userDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    _count: {
      matchesA,
      matchesB,
      likesReceived: likesReceivedSnapshot.data().count
    }
  };

  return <ProfileClient user={user as any} />;
}
