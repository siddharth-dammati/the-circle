"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, MoreVertical, Flag, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatTime } from "@/lib/utils";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string | Date;
  isRead: boolean;
  sender: { id: string; name: string | null; image: string | null };
}

interface User {
  id: string;
  name: string | null;
  image: string | null;
  branch: string | null;
}

export default function ChatWindow({
  matchId,
  currentUserId,
  otherUser,
  initialMessages,
}: {
  matchId: string;
  currentUserId: string;
  otherUser: User;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Real-time listener using Firebase onSnapshot
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("matchId", "==", matchId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages = await Promise.all(
        snapshot.docs.map(async (msgDoc) => {
          const data = msgDoc.data();
          let sender: { id: string; name: string; image: string | null } = { id: data.senderId, name: "Unknown", image: null };
          
          if (data.senderId === otherUser.id) {
            sender = { id: otherUser.id, name: otherUser.name || "Unknown", image: otherUser.image || null };
          } else if (data.senderId === currentUserId) {
            sender = { id: currentUserId, name: "You", image: null };
          } else {
            const senderDoc = await getDoc(doc(db, "users", data.senderId));
            if (senderDoc.exists()) {
              const sData = senderDoc.data();
              sender = { id: senderDoc.id, name: sData.name, image: sData.image };
            }
          }

          return {
            id: msgDoc.id,
            content: data.content,
            senderId: data.senderId,
            createdAt: data.createdAt?.toDate() || new Date(),
            isRead: data.isRead,
            sender,
          } as Message;
        })
      );
      newMessages.sort((a, b) => {
        const tA = (a.createdAt as Date).getTime();
        const tB = (b.createdAt as Date).getTime();
        return tA - tB;
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [matchId, currentUserId, otherUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, content }),
      });
    } catch (e) {
      setInput(content);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleBlock = async () => {
    if (!confirm(`Are you sure you want to block ${otherUser.name}? This cannot be undone.`)) return;
    setIsBlocking(true);
    try {
      const res = await fetch(`/api/users/${otherUser.id}/block`, { method: "POST" });
      if (res.ok) {
        toast.success("User blocked");
        router.push("/chat");
      } else throw new Error();
    } catch {
      toast.error("Failed to block user");
      setIsBlocking(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    try {
      const res = await fetch(`/api/users/${otherUser.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (res.ok) {
        toast.success("Report submitted successfully");
        setShowReportModal(false);
      } else throw new Error();
    } catch {
      toast.error("Failed to submit report");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", maxWidth: 720, position: "relative" }}>
      
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 20px",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 24,
          marginBottom: 16,
          flexShrink: 0,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
      >
        <Link href="/chat" style={{ color: "#94A3B8", display: "flex", alignItems: "center", marginRight: 16 }}><ArrowLeft size={20} /></Link>
        
        {/* Profile Link Area */}
        <Link href={`/profile/${otherUser.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flex: 1 }}>
          {otherUser.image ? (
            <img src={otherUser.image} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white" }}>{otherUser.name?.[0] ?? "?"}</div>
          )}
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{otherUser.name}</div>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>{otherUser.branch}</div>
          </div>
        </Link>

        {/* Options Menu */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowOptions(!showOptions)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 8 }}>
            <MoreVertical size={20} />
          </button>
          
          <AnimatePresence>
            {showOptions && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowOptions(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  style={{
                    position: "absolute", right: 0, top: "100%", marginTop: 8,
                    background: "rgba(26,7,16,0.95)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
                    padding: 8, minWidth: 160, zIndex: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                  }}
                >
                  <button onClick={() => { setShowOptions(false); setShowReportModal(true); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "none", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 10, textAlign: "left" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                    <Flag size={16} color="#F59E0B" /> Report User
                  </button>
                  <button onClick={() => { setShowOptions(false); handleBlock(); }} disabled={isBlocking} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "none", border: "none", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 10, textAlign: "left", marginTop: 4 }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                    <ShieldAlert size={16} /> Block User
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "4px 0" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 15 }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🎉</span>
            You matched! Say hello to <strong style={{ color: "white" }}>{otherUser.name}</strong>!
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUserId;
            
            // Message Grouping Logic
            const prevMsg = messages[idx - 1];
            const nextMsg = messages[idx + 1];
            
            const isSameAsPrev = prevMsg && prevMsg.senderId === msg.senderId && (msg.createdAt as Date).getTime() - (prevMsg.createdAt as Date).getTime() < 5 * 60 * 1000;
            const isSameAsNext = nextMsg && nextMsg.senderId === msg.senderId && (nextMsg.createdAt as Date).getTime() - (msg.createdAt as Date).getTime() < 5 * 60 * 1000;

            const radiusTop = isSameAsPrev ? "4px" : "18px";
            const radiusBottom = isSameAsNext ? "4px" : "18px";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  justifyContent: isOwn ? "flex-end" : "flex-start",
                  padding: "0 4px",
                  marginBottom: isSameAsNext ? 2 : 12,
                }}
              >
                {!isOwn && (
                  <div style={{ width: 30, marginRight: 8, display: "flex", alignItems: "flex-end" }}>
                    {!isSameAsNext && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
                        {msg.sender.image ? <img src={msg.sender.image} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} /> : msg.sender.name?.[0] ?? "?"}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: isOwn ? `18px ${radiusTop} ${radiusBottom} 18px` : `${radiusTop} 18px 18px ${radiusBottom}`,
                      background: isOwn ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)",
                      backdropFilter: isOwn ? "none" : "blur(10px)",
                      border: isOwn ? "none" : "1px solid rgba(255,255,255,0.05)",
                      color: "white",
                      fontSize: 15,
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      boxShadow: isOwn ? "0 4px 15px rgba(34,197,94,0.2)" : "none"
                    }}
                  >
                    {msg.content}
                  </div>
                  {!isSameAsNext && (
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, textAlign: isOwn ? "right" : "left", paddingLeft: isOwn ? 0 : 4, paddingRight: isOwn ? 4 : 0 }}>
                      {formatTime(msg.createdAt)}
                      {isOwn && (
                        <span style={{ color: msg.isRead ? "#3B82F6" : "#64748B", marginLeft: 4 }}>
                          {msg.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: 12,
          padding: "16px 0 0",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${otherUser.name}...`}
            maxLength={2000}
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 30,
              color: "white",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
              outline: "none",
              transition: "all 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.5)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.02)"; }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || sending}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: input.trim() ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.05)",
            border: input.trim() ? "none" : "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "all 0.2s",
            boxShadow: input.trim() ? "0 10px 20px rgba(34,197,94,0.3)" : "none"
          }}
        >
          <Send size={20} color={input.trim() ? "white" : "#64748B"} style={{ marginLeft: 2 }} />
        </motion.button>
      </form>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} onClick={() => setShowReportModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: "relative", width: "100%", maxWidth: 400, background: "rgba(26,7,16,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 8 }}>Report User</h3>
              <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 20 }}>Please specify why you are reporting {otherUser.name}.</p>
              <form onSubmit={handleReport}>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for report..."
                  required
                  style={{ width: "100%", height: 100, padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontFamily: "Inter, sans-serif", resize: "none", outline: "none", marginBottom: 20 }}
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={!reportReason.trim()} style={{ flex: 1, padding: "12px", borderRadius: 12, background: reportReason.trim() ? "#F59E0B" : "rgba(255,255,255,0.1)", border: "none", color: "white", fontWeight: 700, cursor: reportReason.trim() ? "pointer" : "not-allowed" }}>Submit Report</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
