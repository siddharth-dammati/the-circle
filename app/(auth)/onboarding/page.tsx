"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GraduationCap, ChevronRight, ChevronLeft, Check, Camera, Loader2, Link2, X } from "lucide-react";
import { BRANCHES, INTERESTS, CAMPUSES } from "@/lib/utils";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import toast from "react-hot-toast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Alumni"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Crop state
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    branch: "",
    year: "",
    campus: "",
    gender: "",
    bio: "",
    interests: [] as string[],
    connectionType: "FRIENDS",
    image: "",
    instagramUrl: "",
    linkedinUrl: "",
  });

  const steps = [
    { title: "Your Academic Info", subtitle: "Tell us about your studies" },
    { title: "Your Profile Picture", subtitle: "Add a photo so people know it's you" },
    { title: "Your Interests", subtitle: "Select up to 10 things you love" },
    { title: "Your Vibe", subtitle: "What are you looking for?" },
    { title: "Your Socials", subtitle: "Drop your links (Optional)" },
  ];

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    }
  };

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

      setForm((prev) => ({ ...prev, image: data.data.url }));
      setSelectedFileUrl(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : prev.interests.length < 10
        ? [...prev.interests, interest]
        : prev.interests,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#F8FAFC",
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#1A0710", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      
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
                  onCropComplete={(_, px) => setCroppedAreaPixels(px as any)}
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

      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #EC4899, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: "#F8FAFC" }}>The<span style={{ color: "#EC4899" }}>Circle</span></span>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: i <= step ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i <= step ? "linear-gradient(135deg, #EC4899, #F59E0B)" : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                }} />
              </div>
            ))}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 8 }}>{steps[step].title}</h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>{steps[step].subtitle}</p>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: 32, backdropFilter: "blur(20px)" }}
          >
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Campus *</label>
                  <select value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} style={inputStyle}>
                    <option value="" style={{ background: "#1A0710" }}>Select campus</option>
                    {CAMPUSES.map((c) => <option key={c.value} value={c.value} style={{ background: "#1A0710" }}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Branch *</label>
                  <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} style={inputStyle}>
                    <option value="" style={{ background: "#1A0710" }}>Select your branch</option>
                    {BRANCHES.map((b) => <option key={b} value={b} style={{ background: "#1A0710" }}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Academic Year *</label>
                  <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle}>
                    <option value="" style={{ background: "#1A0710" }}>Select year</option>
                    {YEARS.map((y, i) => <option key={y} value={String(i + 1)} style={{ background: "#1A0710" }}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Gender</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["MALE", "Male"], ["FEMALE", "Female"], ["OTHER", "Other"], ["PREFER_NOT_TO_SAY", "Prefer not to say"]].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm({ ...form, gender: val })}
                        style={{
                          padding: "10px",
                          borderRadius: 10,
                          border: `1px solid ${form.gender === val ? "#EC4899" : "rgba(255,255,255,0.1)"}`,
                          background: form.gender === val ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.03)",
                          color: form.gender === val ? "#EC4899" : "#94A3B8",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Bio (optional)</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell people a bit about yourself..."
                    rows={3}
                    maxLength={200}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                  <div style={{ color: "#475569", fontSize: 12, textAlign: "right", marginTop: 4 }}>{form.bio.length}/200</div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
                <label
                  htmlFor="onboarding-image-upload"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    border: "4px solid rgba(255,255,255,0.1)",
                    background: form.image ? `url("${form.image}") center/cover` : "linear-gradient(135deg, #EC4899, #F59E0B)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 24,
                    boxShadow: "0 10px 30px rgba(236,72,153,0.3)"
                  }}
                >
                  {!form.image && <Camera size={40} color="white" />}
                  {form.image && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}>
                      <Camera size={32} color="white" />
                    </div>
                  )}
                </label>
                <input
                  id="onboarding-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>{form.image ? "Looking good!" : "Upload a photo"}</h3>
                <p style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", maxWidth: 300 }}>
                  Profiles with photos get significantly more matches and engagement.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{ color: "#64748B", fontSize: 13, marginBottom: 20 }}>{form.interests.length}/10 selected</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {INTERESTS.map((interest) => {
                    const selected = form.interests.includes(interest);
                    return (
                      <motion.button
                        key={interest}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(interest)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 100,
                          border: `1px solid ${selected ? "#EC4899" : "rgba(255,255,255,0.1)"}`,
                          background: selected ? "linear-gradient(135deg, #EC4899, #F59E0B)" : "rgba(255,255,255,0.04)",
                          color: selected ? "white" : "#94A3B8",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "Inter, sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {selected && <Check size={12} />}
                        {interest}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 8 }}>What are you primarily looking for on The Circle?</p>
                {[
                  { value: "FRIENDS", label: "🤝 Friends", desc: "Meet cool people from your campus" },
                  { value: "STUDY_PARTNER", label: "📚 Study Partner", desc: "Find someone to study and collaborate with" },
                  { value: "NETWORKING", label: "🚀 Networking", desc: "Build your professional campus network" },
                  { value: "RELATIONSHIP", label: "❤️ Relationship", desc: "Find a meaningful romantic connection" },
                ].map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setForm({ ...form, connectionType: opt.value })}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 14,
                      border: `1px solid ${form.connectionType === opt.value ? "#EC4899" : "rgba(255,255,255,0.08)"}`,
                      background: form.connectionType === opt.value ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.03)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: form.connectionType === opt.value ? "#EC4899" : "#F8FAFC", marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{opt.desc}</div>
                  </motion.button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Link2 size={16} color="#E1306C" /> Instagram URL
                  </label>
                  <input
                    type="url"
                    value={form.instagramUrl}
                    onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    style={{ ...inputStyle, background: "rgba(255,255,255,0.03)" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Link2 size={16} color="#0077B5" /> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    style={{ ...inputStyle, background: "rgba(255,255,255,0.03)" }}
                  />
                </div>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    Adding your socials helps confirm you're a real student and makes it easier to connect off-platform once you match!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 16 }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #EC4899, #F59E0B)", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 8px 24px rgba(236,72,153,0.3)" }}
          >
            {loading ? "Saving..." : step < steps.length - 1 ? "Continue" : "Complete Setup"}
            {!loading && (step < steps.length - 1 ? <ChevronRight size={18} /> : <Check size={18} />)}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
