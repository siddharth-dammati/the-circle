import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import * as admin from "firebase-admin";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) return NextResponse.json({ error: "matchId required" }, { status: 400 });

  const matchDoc = await adminDb.collection("matches").doc(matchId).get();
  if (!matchDoc.exists) return NextResponse.json({ error: "Match not found" }, { status: 404 });
  const match = matchDoc.data();
  if (!match?.users?.includes(session.user.id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const messagesSnap = await adminDb.collection("messages")
    .where("matchId", "==", matchId)
    .orderBy("createdAt", "asc")
    .get();

  const messages = await Promise.all(messagesSnap.docs.map(async (doc) => {
    const data = doc.data();
    const senderDoc = await adminDb.collection("users").doc(data.senderId).get();
    const senderData = senderDoc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      sender: senderData ? { id: senderDoc.id, name: senderData.name, image: senderData.image } : null,
    };
  }));

  // Mark messages as read
  const unreadMessages = messagesSnap.docs.filter((doc) => doc.data().senderId !== session.user.id && !doc.data().isRead);
  if (unreadMessages.length > 0) {
    const batch = adminDb.batch();
    unreadMessages.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();
  }

  return NextResponse.json({ messages });
}

const sendSchema = z.object({
  matchId: z.string(),
  content: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { matchId, content } = sendSchema.parse(body);

    const matchDoc = await adminDb.collection("matches").doc(matchId).get();
    if (!matchDoc.exists) return NextResponse.json({ error: "Match not found" }, { status: 404 });
    const match = matchDoc.data();
    if (!match?.users?.includes(session.user.id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const messageRef = adminDb.collection("messages").doc();
    const messageData = {
      matchId,
      senderId: session.user.id,
      content,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await messageRef.set(messageData);

    await adminDb.collection("matches").doc(matchId).update({
      lastMessage: {
        content,
        senderId: session.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const senderDoc = await adminDb.collection("users").doc(session.user.id).get();
    const senderData = senderDoc.data();

    return NextResponse.json({
      message: {
        id: messageRef.id,
        ...messageData,
        createdAt: new Date(),
        sender: senderData ? { id: senderDoc.id, name: senderData.name, image: senderData.image } : null,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
