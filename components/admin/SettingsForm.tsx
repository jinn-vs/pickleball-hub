"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type SettingsData = {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  logo_url: string;
};

export default function SettingsForm({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"hero" | "logo" | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const set = (p: Partial<SettingsData>) => setForm((f) => ({ ...f, ...p }));

  async function upload(file: File, which: "hero" | "logo") {
    setUploading(which);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { setErr(json.error ?? "Upload failed"); return; }
      set(which === "hero" ? { hero_image_url: json.url } : { logo_url: json.url });
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setErr(""); setMsg("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero_title: form.hero_title || null,
        hero_subtitle: form.hero_subtitle || null,
        hero_image_url: form.hero_image_url || null,
        logo_url: form.logo_url || null,
      }),
    });
    setSaving(false);
    if (!res.ok) { setErr("Save failed — check the fields."); return; }
    setMsg("Saved. Changes are live on the homepage.");
    router.refresh();
  }

  const fieldStyle = { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" };
  const field = "w-full px-3 py-2 rounded text-sm outline-none";
  const label = "text-[#9ca3af] text-xs font-medium block mb-1";
  const card = { border: "1px solid #1f2937", backgroundColor: "#0f172a" };

  return (
    <div className="max-w-2xl space-y-5">
      {err && <p style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }} className="text-xs px-3 py-2 rounded">{err}</p>}
      {msg && <p style={{ backgroundColor: "#14532d", color: "#86efac" }} className="text-xs px-3 py-2 rounded">{msg}</p>}

      {/* Hero */}
      <div style={card} className="rounded-lg p-5 space-y-4">
        <h3 className="text-white text-sm font-bold uppercase tracking-wide">Homepage Hero</h3>

        <div>
          <label className={label}>Hero image</label>
          {form.hero_image_url ? (
            <div className="relative w-full h-40 rounded overflow-hidden mb-2">
              <Image src={form.hero_image_url} alt="hero" fill className="object-cover" />
            </div>
          ) : (
            <div style={{ border: "1px dashed #374151" }} className="h-40 rounded flex items-center justify-center text-[#6b7280] text-xs mb-2">
              {uploading === "hero" ? "Uploading…" : "No image — a green gradient shows as fallback"}
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "hero")} className="text-xs text-[#9ca3af]" />
        </div>

        <div>
          <label className={label}>Hero title</label>
          <input value={form.hero_title} onChange={(e) => set({ hero_title: e.target.value })} placeholder="Everything pickleball — news, drills & guides…" style={fieldStyle} className={field} />
        </div>
        <div>
          <label className={label}>Hero subtitle</label>
          <textarea value={form.hero_subtitle} onChange={(e) => set({ hero_subtitle: e.target.value })} rows={2} placeholder="Techniques, rules, tournaments and the latest from the courts." style={fieldStyle} className={`${field} resize-none`} />
        </div>
      </div>

      {/* Logo */}
      <div style={card} className="rounded-lg p-5 space-y-3">
        <h3 className="text-white text-sm font-bold uppercase tracking-wide">Logo (optional)</h3>
        {form.logo_url && (
          <div className="relative w-32 h-12 rounded overflow-hidden bg-white/5">
            <Image src={form.logo_url} alt="logo" fill className="object-contain" />
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "logo")} className="text-xs text-[#9ca3af]" />
        <p className="text-[#6b7280] text-xs">Leave empty to keep the default text logo.</p>
      </div>

      <button onClick={save} disabled={saving || !!uploading} className="btn btn-primary disabled:opacity-50">
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}
