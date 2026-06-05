import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import * as admin from "firebase-admin";

const schema = z.object({
  toUserId: z.string(),
  isSuperLike: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fromUserId = session.user.id;

  try {
    const body = await req.json();
    const { toUserId, isSuperLike } = schema.parse(body);

    if (fromUserId === toUserId) {
      return NextResponse.json({ error: "Cannot like yourself" }, { status: 400 });
    }

    const likeId = `${fromUserId}_${toUserId}`;
    
    // Create like (upsert to handle retries)
    await adminDb.collection("likes").doc(likeId).set({
      fromUserId,
      toUserId,
      isSuperLike,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Check if mutual like exists (they already liked us)
    const mutualLikeId = `${toUserId}_${fromUserId}`;
    const mutualLikeSnap = await adminDb.collection("likes").doc(mutualLikeId).get();

    let isMatch = false;
    let match = null;

    if (mutualLikeSnap.exists) {
      // Create match (sort IDs to ensure uniqueness)
      const [userAId, userBId] = [fromUserId, toUserId].sort();
      const matchId = `${userAId}_${userBId}`;
      
      const matchRef = adminDb.collection("matches").doc(matchId);
      await matchRef.set({
        userAId,
        userBId,
        users: [userAId, userBId],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      isMatch = true;
      match = (await matchRef.get()).data();

      // Create notifications for both users
      const batch = adminDb.batch();
      batch.set(adminDb.collection("notifications").doc(), { userId: fromUserId, type: "MATCH", title: "New Match! 🎉", body: "You have a new match!", link: "/matches", isRead: false, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      batch.set(adminDb.collection("notifications").doc(), { userId: toUserId, type: "MATCH", title: "New Match! 🎉", body: "You have a new match!", link: "/matches", isRead: false, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      await batch.commit();
    } else {
      // Notify them they have a like
      await adminDb.collection("notifications").doc().set({
        userId: toUserId, type: "LIKE", title: "Someone liked you! 💜", body: "Go discover to find out who!", link: "/discover", isRead: false, createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ isMatch, match });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
