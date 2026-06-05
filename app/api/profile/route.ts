import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(200).optional(),
  branch: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
  campus: z.enum(["HYDERABAD", "BENGALURU", "VIZAG"]).optional(),
  interests: z.array(z.string()).max(10).optional(),
  connectionType: z.enum(["FRIENDS", "STUDY_PARTNER", "NETWORKING", "RELATIONSHIP"]).optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userDoc = await adminDb.collection("users").doc(session.user.id).get();
  if (!userDoc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: { id: userDoc.id, ...userDoc.data() } });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    await adminDb.collection("users").doc(session.user.id).update(data);
    const updatedDoc = await adminDb.collection("users").doc(session.user.id).get();

    return NextResponse.json({ user: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userId = session.user.id;
    
    // 1. Delete all matches involving this user
    const matchesSnap = await adminDb.collection("matches").where("users", "array-contains", userId).get();
    const batch = adminDb.batch();
    
    matchesSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 2. Delete secret crushes sent or received
    const crushesFromSnap = await adminDb.collection("secretCrushes").where("fromUserId", "==", userId).get();
    crushesFromSnap.docs.forEach(doc => batch.delete(doc.ref));
    
    const crushesToSnap = await adminDb.collection("secretCrushes").where("toUserId", "==", userId).get();
    crushesToSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 3. Delete messages sent by user (Note: deleting matches doesn't automatically delete messages in our schema)
    const messagesSnap = await adminDb.collection("messages").where("senderId", "==", userId).get();
    messagesSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 4. Delete notifications for this user
    const notifsSnap = await adminDb.collection("notifications").where("userId", "==", userId).get();
    notifsSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 5. Delete blocks
    const blocksFromSnap = await adminDb.collection("blocks").where("blockerId", "==", userId).get();
    blocksFromSnap.docs.forEach(doc => batch.delete(doc.ref));
    const blocksToSnap = await adminDb.collection("blocks").where("blockedId", "==", userId).get();
    blocksToSnap.docs.forEach(doc => batch.delete(doc.ref));

    // 6. Delete reports
    const reportsFromSnap = await adminDb.collection("reports").where("reporterId", "==", userId).get();
    reportsFromSnap.docs.forEach(doc => batch.delete(doc.ref));
    const reportsToSnap = await adminDb.collection("reports").where("reportedId", "==", userId).get();
    reportsToSnap.docs.forEach(doc => batch.delete(doc.ref));

    // Execute all batched deletes (Note: Firestore batch limit is 500 operations. For a large app, we'd chunk this)
    await batch.commit();

    // 7. Delete the user document itself
    await adminDb.collection("users").doc(userId).delete();
    
    // 8. Delete from Firebase Auth
    const { getAuth } = await import("firebase-admin/auth");
    await getAuth().deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
