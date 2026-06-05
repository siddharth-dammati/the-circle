import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [
    userDoc,
    matchesSnapshot,
    upcomingEventsSnapshot,
    notificationsSnapshot,
    likesReceivedSnapshot
  ] = await Promise.all([
    adminDb.collection("users").doc(userId).get(),
    adminDb.collection("matches").where("users", "array-contains", userId).get(),
    adminDb.collection("events").where("date", ">=", new Date()).orderBy("date", "asc").limit(3).get(),
    adminDb.collection("notifications").where("userId", "==", userId).get(),
    adminDb.collection("likes").where("toUserId", "==", userId).count().get()
  ]);

  const rawUser = userDoc.data() || {};
  const user = {
    id: userDoc.id,
    ...rawUser,
    _count: {
      likesReceived: likesReceivedSnapshot.data().count
    }
  };

  const matches = matchesSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data, 
      userAId: data.userAId,
      userBId: data.userBId,
      users: data.users,
      createdAt: data.createdAt?.toDate?.() || data.createdAt 
    };
  });
  const matchCount = matches.length;
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newMatchCount = matches.filter(m => {
    const d = m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt);
    return d >= sevenDaysAgo;
  }).length;

  const upcomingEvents = upcomingEventsSnapshot.docs.map(doc => {
    const data = doc.data();
    const participantsList = Array.isArray(data.participants) ? data.participants : [];
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || data.date,
      _count: { participants: participantsList.length }
    };
  });

  const rawNotifications = notificationsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
  }));
  
  const notifications = rawNotifications
    .filter(n => !(n as any).isRead)
    .sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 5);

  const recentMatchesDocs = matches.sort((a, b) => {
    const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime();
    const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  }).slice(0, 6);
  
  const recentMatches = await Promise.all(recentMatchesDocs.map(async match => {
    const userAId = match.userAId || (match.users && match.users[0]);
    const userBId = match.userBId || (match.users && match.users[1]);
    
    const [userADoc, userBDoc] = await Promise.all([
      userAId ? adminDb.collection("users").doc(userAId).get() : Promise.resolve(null),
      userBId ? adminDb.collection("users").doc(userBId).get() : Promise.resolve(null)
    ]);
    return {
      ...match,
      userA: userADoc?.exists ? { id: userADoc.id, ...userADoc.data() } : null,
      userB: userBDoc?.exists ? { id: userBDoc.id, ...userBDoc.data() } : null
    };
  }));

  return (
    <DashboardClient
      user={user as any}
      matchCount={matchCount}
      newMatchCount={newMatchCount}
      upcomingEvents={upcomingEvents as any[]}
      notifications={notifications as any[]}
      recentMatches={recentMatches as any[]}
      currentUserId={userId}
    />
  );
}
