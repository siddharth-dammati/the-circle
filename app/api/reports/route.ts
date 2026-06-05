import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { z } from "zod";

const schema = z.object({
  reportedId: z.string(),
  reason: z.string().min(5).max(200),
  details: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.reportedId === session.user.id) {
      return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
    }

    const reportRef = adminDb.collection("reports").doc();
    const reportData = {
      ...data,
      reporterId: session.user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await reportRef.set(reportData);

    return NextResponse.json({ report: { id: reportRef.id, ...reportData } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
