import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export async function getServerAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Fetch full user data from Firestore
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return {
        user: {
          id: decodedClaims.uid,
          email: decodedClaims.email,
          name: decodedClaims.name,
          image: decodedClaims.picture,
          isAdmin: false,
          isOnboarded: false,
          isBanned: false,
        }
      };
    }

    return {
      user: {
        id: decodedClaims.uid,
        email: decodedClaims.email,
        name: userData.name || decodedClaims.name,
        image: userData.image || decodedClaims.picture,
        isAdmin: userData.isAdmin ?? false,
        isOnboarded: userData.isOnboarded ?? false,
        isBanned: userData.isBanned ?? false,
      }
    };
  } catch (error) {
    return null;
  }
}

export const auth = getServerAuth;
