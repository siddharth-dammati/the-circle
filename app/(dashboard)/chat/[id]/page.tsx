import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect, notFound } from "next/navigation";
import ChatWindow from "./ChatWindow";

export const metadata = { title: "Chat" };

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  const { id: matchId } = await params;

  const matchDoc = await adminDb.collection("matches").doc(matchId).get();
  if (!matchDoc.exists) notFound();
  
  const matchData = matchDoc.data();
  if (!matchData?.users?.includes(userId)) notFound();

  const otherUserId = matchData.userAId === userId ? matchData.userBId : matchData.userAId;
  const otherUserDoc = await adminDb.collection("users").doc(otherUserId).get();
  const otherUser = otherUserDoc.data() || {};

  const msgsSnap = await adminDb.collection("messages")
    .where("matchId", "==", matchId)
    .get();

  let sortedDocs = [...msgsSnap.docs];
  sortedDocs.sort((a, b) => {
    const tA = a.data().createdAt?.toMillis?.() || 0;
    const tB = b.data().createdAt?.toMillis?.() || 0;
    return tA - tB; // asc
  });

  const messages = await Promise.all(
    sortedDocs.map(async (doc) => {
      const msgData = doc.data();
      const senderDoc = await adminDb.collection("users").doc(msgData.senderId).get();
      const senderData = senderDoc.data() || {};
      
      return {
        id: doc.id,
        ...msgData,
        createdAt: msgData.createdAt?.toDate(),
        sender: { id: msgData.senderId, name: senderData.name, image: senderData.image },
      };
    })
  );

  return (
    <ChatWindow
      matchId={matchId}
      currentUserId={userId}
      otherUser={{ id: otherUserId, name: otherUser.name, image: otherUser.image, branch: otherUser.branch }}
      initialMessages={messages as any[]}
    />
  );
}
