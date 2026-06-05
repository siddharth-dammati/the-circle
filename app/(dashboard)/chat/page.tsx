import { auth } from "@/lib/serverAuth";
import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const metadata = { title: "Chat" };

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const matchesSnap = await adminDb.collection("matches")
    .where("users", "array-contains", userId)
    .get();

  const matches = await Promise.all(
    matchesSnap.docs.map(async (doc) => {
      const matchData = doc.data();
      const otherUserId = matchData.userAId === userId ? matchData.userBId : matchData.userAId;
      
      const otherUserDoc = await adminDb.collection("users").doc(otherUserId).get();
      const otherUser = otherUserDoc.data() || {};
      
      const msgsSnap = await adminDb.collection("messages")
        .where("matchId", "==", doc.id)
        .get();
        
      const sortedMsgs = msgsSnap.docs.map(m => m.data()).sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() || 0;
        const tB = b.createdAt?.toMillis?.() || 0;
        return tB - tA; // desc
      });
      const lastMsg = sortedMsgs.length > 0 ? sortedMsgs[0] : null;

      return {
        id: doc.id,
        userAId: matchData.userAId,
        userBId: matchData.userBId,
        other: { id: otherUserDoc.id, name: otherUser.name, image: otherUser.image },
        lastMsg,
      };
    })
  );

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 6 }}>Messages</h1>
        <p style={{ color: "#94A3B8", fontSize: 16 }}>{matches.length} conversations</p>
      </div>
      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, backdropFilter: "blur(20px)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid rgba(236,72,153,0.2)" }}>
            <MessageCircle size={32} color="#EC4899" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 8 }}>No conversations yet</h3>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 24 }}>Match with someone first to start chatting!</p>
          <Link href="/discover" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, #EC4899, #F59E0B)", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 700 }}>Go Discover</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {matches.map((match: any) => {
            const other = match.other;
            const lastMsg = match.lastMsg;
            const isUnread = lastMsg && lastMsg.senderId !== userId && !lastMsg.isRead;
            
            return (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 20,
                  background: isUnread ? "rgba(236,72,153,0.05)" : "rgba(255,255,255,0.02)",
                  border: isUnread ? "1px solid rgba(236,72,153,0.2)" : "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                {other.image ? (
                  <img src={other.image} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E, #16A34A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white", flexShrink: 0 }}>{other.name?.[0] ?? "?"}</div>
                )}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4 }}>{other.name}</div>
                  <div style={{ fontSize: 14, color: isUnread ? "white" : "#94A3B8", fontWeight: isUnread ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lastMsg ? lastMsg.content : "Say hi! 👋"}
                  </div>
                </div>
                {isUnread ? (
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EC4899", flexShrink: 0, boxShadow: "0 0 10px #EC4899" }} />
                ) : (
                  <MessageCircle size={20} color="#94A3B8" style={{ flexShrink: 0 }} />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
