import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import AdminUsersClient from "./AdminUsersClient";

export const metadata = { title: "Admin - Users" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/dashboard");

  const [usersQuery, matchesQuery] = await Promise.all([
    adminDb.collection("users").orderBy("createdAt", "desc").get(),
    adminDb.collection("matches").get(),
  ]);

  const matchCountsA: Record<string, number> = {};
  const matchCountsB: Record<string, number> = {};

  matchesQuery.docs.forEach(doc => {
    const data = doc.data();
    if (data.user1Id) matchCountsA[data.user1Id] = (matchCountsA[data.user1Id] || 0) + 1;
    if (data.user2Id) matchCountsB[data.user2Id] = (matchCountsB[data.user2Id] || 0) + 1;
  });

  const users = usersQuery.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      image: data.image,
      branch: data.branch,
      campus: data.campus,
      year: data.year,
      isOnboarded: data.isOnboarded,
      isBanned: data.isBanned,
      isAdmin: data.isAdmin,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
      datingPreference: data.datingPreference,
      _count: {
        matchesA: matchCountsA[doc.id] || 0,
        matchesB: matchCountsB[doc.id] || 0,
      },
    };
  });

  return <AdminUsersClient users={users as any[]} />;
}
