import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await adminDb.collection("secretCrushes")
    .where("fromUserId", "==", session.user.id)
    .get();

  const crushes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ crushes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const toUserId = z.string().parse(body.toUserId);
  const fromUserId = session.user.id;

  if (fromUserId === toUserId) {
    return NextResponse.json({ error: "Cannot crush on yourself" }, { status: 400 });
  }

  const mutualCrushId = `${toUserId}_${fromUserId}`;
  const mutualCrushRef = adminDb.collection("secretCrushes").doc(mutualCrushId);
  const mutualCrushDoc = await mutualCrushRef.get();

  const crushId = `${fromUserId}_${toUserId}`;
  const crushRef = adminDb.collection("secretCrushes").doc(crushId);
  
  await crushRef.set({
    fromUserId,
    toUserId,
    isRevealed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  let isMutual = false;
  if (mutualCrushDoc.exists) {
    // Reveal both!
    await crushRef.update({ isRevealed: true });
    await mutualCrushRef.update({ isRevealed: true });
    isMutual = true;

    // Create notifications
    const notif1Ref = adminDb.collection("notifications").doc();
    const notif2Ref = adminDb.collection("notifications").doc();

    const notifData = {
      type: "CRUSH",
      title: "Secret Crush Revealed! 💛",
      body: "Your crush feels the same way!",
      link: "/matches",
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await notif1Ref.set({ ...notifData, userId: fromUserId });
    await notif2Ref.set({ ...notifData, userId: toUserId });
  }

  const crushDoc = await crushRef.get();
  return NextResponse.json({ crush: { id: crushDoc.id, ...crushDoc.data() }, isMutual });
}
