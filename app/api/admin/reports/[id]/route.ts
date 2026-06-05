import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { status } = schema.parse(body);

  await adminDb.collection("reports").doc(id).update({ status });
  const docSnap = await adminDb.collection("reports").doc(id).get();

  return NextResponse.json({ report: { id: docSnap.id, ...docSnap.data() } });
}
