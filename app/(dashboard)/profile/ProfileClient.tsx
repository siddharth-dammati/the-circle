"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Save, X, Link2, GraduationCap, MapPin, Camera, Loader2, Check, Trash2 } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { BRANCHES, INTERESTS, CAMPUSES } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

const connectionLabel: Record<string, string> = { FRIENDS: "👥 Friends", STUDY_PARTNER: "📚 Study Partner", NETWORKING: "🚀 Networking", RELATIONSHIP: "❤️ Relationship" };
const campusLabel: Record<string, string> = { HYDERABAD: "Hyderabad", BENGALURU: "Bengaluru", VIZAG: "Vizag" };
const yearLabel: Record<number, string> = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year", 5: "5th Year" };

export default function ProfileClient({ user }: { user: any }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Crop state
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        await auth.signOut();
        window.location.href = "/login";
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const [form, setForm] = useState({
    bio: user.bio ?? "",
    branch: user.branch ?? "",
    year: user.year ?? 1,
    campus: user.campus ?? "",
    interests: user.interests ?? [],
    connectionType: user.connectionType ?? "FRIENDS",
    instagramUrl: user.instagramUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    image: user.image ?? "",
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const uploadCroppedImage = async () => {
    if (!selectedFileUrl || !croppedAreaPixels) return;

    setUploadingImage(true);
    try {
      const croppedBlob = await getCroppedImg(selectedFileUrl, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Crop failed");

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("ImgBB API key is missing");

      const formData = new FormData();
      formData.append("image", croppedBlob, "profile.jpg");

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Upload failed");

      const imageUrl = data.data.url;

      // Update local state
      setForm((prev) => ({ ...prev, image: imageUrl }));
      
      // Save directly to backend so they don't have to hit save just for the image
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      toast.success("Profile picture updated!");
      setSelectedFileUrl(null);
      if (!editing) window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : prev.interests.length < 10 ? [...prev.interests, interest] : prev.interests,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, year: Number(form.year) }),
      });
      setEditing(false);
      window.location.reload();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#F8FAFC",
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 720 }}>
      
      {/* Crop Modal */}
      <AnimatePresence>
        {selectedFileUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }} onClick={() => !uploadingImage && setSelectedFileUrl(null)} />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: "relative", width: "100%", maxWidth: 500, background: "rgba(26,7,16,1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "white" }}>Adjust Profile Picture</h3>
                <button onClick={() => setSelectedFileUrl(null)} disabled={uploadingImage} style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}><X size={20} /></button>
              </div>
              
              <div style={{ position: "relative", width: "100%", height: 350, background: "#000" }}>
                <Cropper
                  image={selectedFileUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </label>
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: "100%", accentColor: "#EC4899" }} />
                </div>
                
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setSelectedFileUrl(null)} disabled={uploadingImage} style={{ flex: 1, padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button onClick={uploadCroppedImage} disabled={uploadingImage} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #EC4899, #F59E0B)", border: "none", color: "white", fontWeight: 700, cursor: uploadingImage ? "not-allowed" : "pointer", opacity: uploadingImage ? 0.7 : 1 }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    {uploadingImage ? "Uploading..." : "Confirm & Save"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cover */}
      <div
        style={{
          height: 200,
          borderRadius: 20,
          background: user.coverImage ? `url("${user.coverImage}") center/cover` : "linear-gradient(135deg, #1A0710, #310d20, #000)",
          marginBottom: -60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(15,23,42,0.9))" }} />
      </div>

      {/* Avatar + actions */}
      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div style={{ position: "relative" }}>
            <label
              htmlFor="profile-image-upload"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "4px solid #0F172A",
                background: form.image ? `url("${form.image}") center/cover` : "linear-gradient(135deg, #EC4899, #F59E0B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
                backgroundSize: "cover",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {!form.image && (user.name?.[0] ?? "?")}
              
              {/* Overlay on hover */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
              >
                <Camera size={24} color="white" />
              </div>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </div>
          <button
            onClick={() => setEditing(!editing)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid rgba(236,72,153,0.4)",
              background: "transparent",
              color: "#EC4899",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
          >
            {editing ? <X size={16} /> : <Edit3 size={16} />}
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Name + details */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", marginBottom: 6 }}>{user.name}</h1>
          <p style={{ color: "#64748B", fontSize: 14, marginBottom: 8 }}>{user.email}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {user.branch && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 14 }}>
                <GraduationCap size={16} color="#EC4899" /> {user.branch}{user.year ? ` • ${yearLabel[user.year]}` : ""}
              </span>
            )}
            {user.campus && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 14 }}>
                <MapPin size={16} color="#EC4899" /> {campusLabel[user.campus] ?? user.campus}
              </span>
            )}
            {user.connectionType && (
              <span style={{ fontSize: 13, fontWeight: 700, color: "#EC4899", background: "rgba(236,72,153,0.1)", padding: "3px 10px", borderRadius: 8 }}>
                {connectionLabel[user.connectionType]}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Matches", value: (user._count?.matchesA ?? 0) + (user._count?.matchesB ?? 0) },
            { label: "Liked By", value: user._count?.likesReceived ?? 0 },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        {!editing ? (
          <>
            {user.bio && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#94A3B8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>About</h3>
                <p style={{ color: "#CBD5E1", fontSize: 15, lineHeight: 1.7 }}>{user.bio}</p>
              </div>
            )}
            {user.interests?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Interests</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {user.interests.map((i: string) => (
                    <span key={i} style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", color: "#EC4899", fontSize: 13, fontWeight: 600 }}>{i}</span>
                  ))}
                </div>
              </div>
            )}
            {(user.instagramUrl || user.linkedinUrl) && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#94A3B8", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Socials</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  {user.instagramUrl && <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: "#E1306C", fontSize: 14, textDecoration: "none" }}><Link2 size={16} /> Instagram</a>}
                  {user.linkedinUrl && <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: "#0077B5", fontSize: 14, textDecoration: "none" }}><Link2 size={16} /> LinkedIn</a>}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#EF4444", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Danger Zone</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.6 }}>
                  Deleting your account is permanent and cannot be undone. All your data, matches, and messages will be permanently removed.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", fontSize: 14, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", width: "fit-content", opacity: deleting ? 0.7 : 1 }}
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={200} style={{ ...inputStyle, resize: "none" }} />
              <div style={{ color: "#475569", fontSize: 12, textAlign: "right", marginTop: 4 }}>{form.bio.length}/200</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Campus</label>
                <select value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} style={inputStyle}>
                  {CAMPUSES.map((c) => <option key={c.value} value={c.value} style={{ background: "#1E293B" }}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Year</label>
                <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} style={inputStyle}>
                  {[1,2,3,4,5].map((y) => <option key={y} value={y} style={{ background: "#1E293B" }}>{yearLabel[y]}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Branch</label>
              <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} style={inputStyle}>
                {BRANCHES.map((b) => <option key={b} value={b} style={{ background: "#1E293B" }}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Interests ({form.interests.length}/10)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTERESTS.map((interest) => {
                  const sel = form.interests.includes(interest);
                  return (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                      style={{ padding: "6px 14px", borderRadius: 100, border: `1px solid ${sel ? "#EC4899" : "rgba(255,255,255,0.1)"}`, background: sel ? "linear-gradient(135deg, #EC4899, #F59E0B)" : "rgba(255,255,255,0.03)", color: sel ? "white" : "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                    >{interest}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Instagram URL</label>
                <input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." style={inputStyle} />
              </div>
              <div>
                <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>LinkedIn URL</label>
                <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." style={inputStyle} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #EC4899, #F59E0B)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: 8 }}
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
