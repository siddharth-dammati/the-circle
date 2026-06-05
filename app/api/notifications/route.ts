import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await adminDb.collection("notifications")
    .where("userId", "==", session.user.id)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ notifications });
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await adminDb.collection("notifications")
    .where("userId", "==", session.user.id)
    .where("isRead", "==", false)
    .get();

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isRead: true });
  });

  await batch.commit();

  return NextResponse.json({ success: true });
}
