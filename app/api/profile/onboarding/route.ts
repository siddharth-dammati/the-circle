import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const schema = z.object({
  branch: z.string().min(1),
  year: z.string(),
  campus: z.enum(["HYDERABAD", "BENGALURU", "VIZAG"]),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  bio: z.string().max(200).optional(),
  interests: z.array(z.string()).max(10),
  connectionType: z.enum(["FRIENDS", "STUDY_PARTNER", "NETWORKING", "RELATIONSHIP"]),
  image: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const updateData = {
      name: session.user.name || null,
      email: session.user.email || null,
      image: data.image || session.user.image || null,
      branch: data.branch,
      year: parseInt(data.year),
      campus: data.campus,
      gender: data.gender,
      bio: data.bio,
      interests: data.interests,
      connectionType: data.connectionType,
      instagramUrl: data.instagramUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      isOnboarded: true,
    };

    await adminDb.collection("users").doc(session.user.id).set(updateData, { merge: true });
    const updatedDoc = await adminDb.collection("users").doc(session.user.id).get();

    return NextResponse.json({ success: true, user: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
