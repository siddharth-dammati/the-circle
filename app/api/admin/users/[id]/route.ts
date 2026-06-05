import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const schema = z.object({
  isBanned: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  isApproved: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const data = schema.parse(body);

  if (Object.keys(data).length > 0) {
    await adminDb.collection("users").doc(id).update(data);
  }
  
  const docSnap = await adminDb.collection("users").doc(id).get();

  return NextResponse.json({ user: { id: docSnap.id, ...docSnap.data() } });
}
