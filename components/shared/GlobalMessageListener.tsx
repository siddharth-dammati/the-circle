"use client";

import { useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function GlobalMessageListener({ userId }: { userId: string }) {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const q = query(
      collection(db, "matches"),
      where("users", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return; // Don't alert for existing messages when page loads
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const match = change.doc.data();
          const lastMsg = match.lastMessage;

          // Check if there is a new message, it's not from us, and we are not currently in that chat room
          if (
            lastMsg &&
            lastMsg.senderId !== userId &&
            lastMsg.isRead === false &&
            pathname !== `/chat/${change.doc.id}`
          ) {
            toast.custom((t) => (
              <div
                style={{
                  opacity: t.visible ? 1 : 0,
                  transform: t.visible ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "linear-gradient(135deg, #1E1B4B, #312E81)",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  padding: "16px 20px",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  color: "#F8FAFC",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  cursor: "pointer"
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                  window.location.href = `/chat/${change.doc.id}`;
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageCircle size={20} color="#A855F7" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>New Message</div>
                  <div style={{ fontSize: 14, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                    {lastMsg.content}
                  </div>
                </div>
              </div>
            ), { duration: 4000 });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [userId, pathname]);

  return null;
}
