import { NextResponse } from "next/server";
import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";
import { z } from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const campus = searchParams.get("campus");

  let eventsRef: admin.firestore.Query = adminDb.collection("events");

  if (category) {
    eventsRef = eventsRef.where("category", "==", category);
  }
  if (campus) {
    eventsRef = eventsRef.where("campus", "==", campus);
  }

  const snapshot = await eventsRef.orderBy("date", "asc").get();
  
  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ events });
}

const createSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  category: z.enum(["TECHNICAL", "CULTURAL", "SPORTS", "CLUBS", "WORKSHOPS"]),
  date: z.string(),
  venue: z.string().min(2).max(200),
  campus: z.enum(["HYDERABAD", "BENGALURU", "VIZAG"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const eventRef = adminDb.collection("events").doc();
    const eventData = {
      ...data,
      date: new Date(data.date).toISOString(),
      createdById: session.user.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await eventRef.set(eventData);

    return NextResponse.json({ event: { id: eventRef.id, ...eventData } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
