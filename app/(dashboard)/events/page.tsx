import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import EventsClient from "./EventsClient";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const eventsSnapshot = await adminDb.collection("events").orderBy("date", "asc").get();
  
  const events = await Promise.all(eventsSnapshot.docs.map(async doc => {
    const data = doc.data();
    let createdBy = null;
    if (data.createdById) {
      const creatorDoc = await adminDb.collection("users").doc(data.createdById).get();
      if (creatorDoc.exists) {
        createdBy = { id: creatorDoc.id, name: creatorDoc.data()?.name };
      }
    }

    const participantsList = Array.isArray(data.participants) ? data.participants : [];
    
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || data.date,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      createdBy,
      participants: participantsList.map((p: any) => ({ userId: typeof p === 'string' ? p : p.userId || p })),
      _count: { participants: participantsList.length }
    };
  }));

  return <EventsClient events={events as any[]} currentUserId={userId} />;
}
