import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { z } from "zod";

const reportSchema = z.object({
  reason: z.string().min(1),
  details: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reporterId = session.user.id;
  const { id: reportedId } = await params;

  if (reporterId === reportedId) {
    return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { reason, details } = reportSchema.parse(body);

    await adminDb.collection("reports").add({
      reporterId,
      reportedId,
      reason,
      details: details || null,
      status: "PENDING",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
