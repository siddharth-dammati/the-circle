import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import AdminReportsClient from "./AdminReportsClient";

export const metadata = { title: "Admin - Reports" };

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/dashboard");

  const reportsQuery = await adminDb.collection("reports").orderBy("createdAt", "desc").get();
  
  const reports = await Promise.all(reportsQuery.docs.map(async (doc) => {
    const data = doc.data();
    
    let reporterData = { id: data.reporterId || "", name: "Unknown", email: "" };
    if (data.reporterId) {
      const reporterDoc = await adminDb.collection("users").doc(data.reporterId).get();
      if (reporterDoc.exists) reporterData = { id: reporterDoc.id, ...reporterDoc.data() } as any;
    }
    
    let reportedData = { id: data.reportedId || "", name: "Unknown", email: "" };
    if (data.reportedId) {
      const reportedDoc = await adminDb.collection("users").doc(data.reportedId).get();
      if (reportedDoc.exists) reportedData = { id: reportedDoc.id, ...reportedDoc.data() } as any;
    }

    return {
      id: doc.id,
      ...data,
      reporter: reporterData,
      reported: reportedData,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
    };
  }));

  return <AdminReportsClient reports={reports as any[]} />;
}
