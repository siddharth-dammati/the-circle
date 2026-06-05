import * as admin from "firebase-admin";

const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "demo",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "demo@demo.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    });

    return admin.initializeApp({ 
      credential,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gitamate.firebasestorage.app"
    });
  } catch (error) {
    console.warn("Firebase Admin init failed (likely missing/invalid credentials during build).");
    return null;
  }
};

export const adminApp = initFirebaseAdmin();
export const adminDb = adminApp ? admin.firestore() : ({} as admin.firestore.Firestore);
export const adminAuth = adminApp ? admin.auth() : ({} as admin.auth.Auth);
export const adminStorage = adminApp ? admin.storage() : ({} as admin.storage.Storage);
