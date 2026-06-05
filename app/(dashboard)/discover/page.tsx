import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import DiscoverClient from "./DiscoverClient";

export const metadata = { title: "Discover" };

export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  // 1. Fetch current user and exclusions in parallel
  const [userDoc, likesSnapshot, blockerBlocks, blockedBlocks] = await Promise.all([
    adminDb.collection("users").doc(userId).get(),
    adminDb.collection("likes").where("fromUserId", "==", userId).get(),
    adminDb.collection("blocks").where("blockerId", "==", userId).get(),
    adminDb.collection("blocks").where("blockedId", "==", userId).get(),
  ]);

  const currentUser = userDoc.data();

  const excludeIds = new Set([
    userId,
    ...likesSnapshot.docs.map(doc => doc.data().toUserId),
    ...blockerBlocks.docs.map(doc => doc.data().blockedId),
    ...blockedBlocks.docs.map(doc => doc.data().blockerId),
  ]);

  // 2. Fetch a pool of users to score (fetch up to 200 to give the algorithm room to work)
  const profilesSnapshot = await adminDb.collection("users")
    .where("isOnboarded", "==", true)
    .limit(200)
    .get();

  let profiles = profilesSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(profile => !excludeIds.has(profile.id) && profile.isBanned !== true);

  // 3. Smart Matching Algorithm
  if (currentUser) {
    // Filter opposite gender if looking for a relationship
    if (currentUser.connectionType === "RELATIONSHIP" && currentUser.gender) {
      profiles = profiles.filter(profile => {
        if (profile.connectionType !== "RELATIONSHIP") return false;
        if (!profile.gender || profile.gender === "PREFER_NOT_TO_SAY" || profile.gender === "OTHER") return false;
        if (currentUser.gender === "MALE" && profile.gender !== "FEMALE") return false;
        if (currentUser.gender === "FEMALE" && profile.gender !== "MALE") return false;
        return true;
      });
    }

    profiles = profiles.map(profile => {
      let score = 0;
      
      if (profile.campus === currentUser.campus) score += 30;
      if (profile.branch === currentUser.branch) score += 20;
      if (profile.connectionType === currentUser.connectionType) score += 15;
      if (profile.year === currentUser.year) score += 10;
      
      const sharedInterests = (profile.interests || []).filter((i: string) => (currentUser.interests || []).includes(i));
      score += sharedInterests.length * 5;
      
      return { ...profile, _matchScore: score };
    }).sort((a, b) => b._matchScore - a._matchScore); // Descending sort
  }

  // 4. Return top 20 matches
  profiles = profiles.slice(0, 20);

  return <DiscoverClient profiles={profiles as any[]} currentUserId={userId} />;
}
