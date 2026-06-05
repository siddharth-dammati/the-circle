import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: eventId } = await params;
  
  const rsvpRef = adminDb.collection("eventParticipants").doc(`${eventId}_${session.user.id}`);
  
  const existing = await rsvpRef.get();

  if (existing.exists) {
    await rsvpRef.delete();
    return NextResponse.json({ rsvped: false });
  }

  await rsvpRef.set({
    eventId,
    userId: session.user.id,
  });

  return NextResponse.json({ rsvped: true });
}
