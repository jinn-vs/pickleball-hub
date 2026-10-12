"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = { key: string; label: string; type?: "text" | "textarea" | "image"; auto?: "slug-from" };
type Row = Record<string, string | null | undefined> & { id: string };

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EntityManager({
  title,
  endpoint,
  fields,
  rows,
}: {
  title: string;
  endpoint: string;
  fields: Field[];
  rows: Row[];
}) {
  const router = useRouter();
  const blank = Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<string, string>;
  const [form, setForm] = useState<Record<string, string>>(blank);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function uploadImage(key: string, file: File) {
    setUploadingKey(key);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      set(key, json.url as string);
    } finally {
      setUploadingKey(null);
    }
  }

  const set = (k: string, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      const slugField = fields.find((x) => x.auto === "slug-from");
      if (slugField && k === fields[0].key && !editId) next[slugField.key] = slugify(v);
      return next;
    });
  };

  async function submit() {
    setBusy(true);
    setError("");
    // Empty optional fields → null (so blank photo/description/bio is allowed)
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
    );
    const payload = editId ? { id: editId, ...cleaned } : cleaned;
    const res = await fetch(endpoint, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Save failed — check required fields (name + slug).");
      return;
    }
    setForm(blank);
    setEditId(null);
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
  }

  function startEdit(r: Row) {
    setEditId(r.id);
    setForm(Object.fromEntries(fields.map((f) => [f.key, r[f.key] ?? ""])) as Record<string, string>);
  }

  const fieldStyle = { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" };
  const fieldCls = "w-full px-3 py-2 rounded text-sm outline-none";

  return (
    <div>
      <h1 className="text-white text-2xl font-black mb-6">{title}</h1>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Form */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }} className="rounded-lg p-4 space-y-3 h-fit">
          <p className="text-white text-sm font-bold">{editId ? "Edit" : "Add new"}</p>
          {error && <p style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }} className="text-xs px-3 py-2 rounded">{error}</p>}
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[#9ca3af] text-xs block mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={3} style={fieldStyle} className={`${fieldCls} resize-none`} />
              ) : f.type === "image" ? (
                <div className="space-y-2">
                  {form[f.key] ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form[f.key]} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div style={{ border: "1px dashed #374151" }} className="w-20 h-20 rounded-full flex items-center justify-center text-[#6b7280] text-[10px] text-center px-1">
                      {uploadingKey === f.key ? "Uploading…" : "No image"}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadImage(f.key, e.target.files[0])}
                    className="text-xs text-[#9ca3af]"
                  />
                  {form[f.key] && (
                    <button type="button" onClick={() => set(f.key, "")} className="block text-[11px] font-semibold" style={{ color: "#f87171" }}>
                      Remove image
                    </button>
                  )}
                </div>
              ) : (
                <input value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} style={fieldStyle} className={fieldCls} />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={submit} disabled={busy || !!uploadingKey} className="btn btn-primary flex-1 disabled:opacity-50">{editId ? "Update" : "Add"}</button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(blank); }} style={{ backgroundColor: "#374151", color: "#fff" }} className="btn">Cancel</button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ border: "1px solid #1f2937" }} className="rounded-lg overflow-hidden h-fit">
          {rows.length === 0 ? (
            <p style={{ color: "#6b7280" }} className="text-sm p-4">Nothing yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td className="px-4 py-3">
                      <span className="text-white font-semibold">{r[fields[0].key]}</span>
                      <span style={{ color: "#6b7280" }} className="block text-xs">{r.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(r)} className="text-green text-xs font-semibold mr-4">Edit</button>
                      <button onClick={() => del(r.id)} className="text-xs font-semibold" style={{ color: "#f87171" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
