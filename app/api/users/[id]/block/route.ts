import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blockerId = session.user.id;
  // Next.js 15 params must be awaited in app router API
  const { id: blockedId } = await params;

  if (blockerId === blockedId) {
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });
  }

  try {
    // 1. Create Block record
    await adminDb.collection("blocks").add({
      blockerId,
      blockedId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Find and delete the match
    const matchesSnap = await adminDb.collection("matches")
      .where("users", "array-contains", blockerId)
      .get();

    for (const doc of matchesSnap.docs) {
      const match = doc.data();
      if (match.users.includes(blockedId)) {
        await doc.ref.delete();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
