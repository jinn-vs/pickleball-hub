"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import SeoPanel from "@/components/admin/SeoPanel";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ border: "1px solid #374151", minHeight: 360 }} className="rounded-lg flex items-center justify-center text-[#6b7280] text-sm">
      Loading editor…
    </div>
  ),
});

export type ArticleFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  section: string;
  author_id: string;
  category_id: string;
  featured_image_url: string;
  tags: string[];
  faqs: { question: string; answer: string }[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  is_published: boolean;
};

type Ref = { id: string; name: string };

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ArticleForm({
  initial,
  categories,
  authors,
  mode,
}: {
  initial: ArticleFormData;
  categories: Ref[];
  authors: Ref[];
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (patch: Partial<ArticleFormData>) => setForm((f) => ({ ...f, ...patch }));

  async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return null;
    }
    return json.url as string;
  }

  async function handleFeatured(file: File) {
    setUploading(true);
    const url = await uploadImage(file);
    if (url) set({ featured_image_url: url });
    setUploading(false);
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      is_published: publish ?? form.is_published,
      tags: form.tags.filter(Boolean),
      faqs: form.faqs.filter((f) => f.question && f.answer),
      author_id: form.author_id || null,
      category_id: form.category_id || null,
      featured_image_url: form.featured_image_url || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords || null,
    };
    const res = await fetch("/api/articles", {
      method: mode === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(typeof json.error === "string" ? json.error : "Validation failed — check required fields.");
      return;
    }
    router.push("/admin/dashboard/articles");
    router.refresh();
  }

  const field = "w-full px-3 py-2 rounded text-sm outline-none";
  const fieldStyle = { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" };
  const labelCls = "text-[#9ca3af] text-xs font-medium block mb-1";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Main column */}
      <div className="space-y-4">
        {error && <p style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }} className="text-xs px-3 py-2 rounded">{error}</p>}

        <div>
          <label className={labelCls}>Title</label>
          <input
            value={form.title}
            onChange={(e) => set({ title: e.target.value, slug: mode === "new" ? slugify(e.target.value) : form.slug })}
            style={fieldStyle}
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>Slug</label>
          <input value={form.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} style={fieldStyle} className={field} />
        </div>

        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} rows={2} style={fieldStyle} className={`${field} resize-none`} />
        </div>

        <div>
          <label className={labelCls}>Body</label>
          <TiptapEditor value={form.body} onChange={(html) => set({ body: html })} onImageUpload={uploadImage} />
        </div>

        <SeoPanel
          values={{ seo_title: form.seo_title, seo_description: form.seo_description, seo_keywords: form.seo_keywords }}
          fallbackTitle={form.title}
          slug={form.slug}
          onChange={(p) => set(p)}
        />
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div style={{ border: "1px solid #1f2937", backgroundColor: "#0f172a" }} className="rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => save(true)} disabled={saving} className="btn btn-primary flex-1 disabled:opacity-50">
              {saving ? "Saving…" : "Publish"}
            </button>
            <button onClick={() => save(false)} disabled={saving} style={{ backgroundColor: "#374151", color: "#fff" }} className="btn flex-1 disabled:opacity-50">
              Save draft
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#9ca3af]">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set({ is_published: e.target.checked })} />
            Published
          </label>
        </div>

        <div style={{ border: "1px solid #1f2937", backgroundColor: "#0f172a" }} className="rounded-lg p-4 space-y-3">
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category_id} onChange={(e) => set({ category_id: e.target.value })} style={fieldStyle} className={field}>
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Author</label>
            <select value={form.author_id} onChange={(e) => set({ author_id: e.target.value })} style={fieldStyle} className={field}>
              <option value="">— none —</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Section label (optional)</label>
            <input value={form.section} onChange={(e) => set({ section: e.target.value })} placeholder="e.g. Technique, Rules" style={fieldStyle} className={field} />
          </div>
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              value={form.tags.join(", ")}
              onChange={(e) => set({ tags: e.target.value.split(",").map((t) => t.trim()) })}
              style={fieldStyle}
              className={field}
            />
          </div>
        </div>

        <div style={{ border: "1px solid #1f2937", backgroundColor: "#0f172a" }} className="rounded-lg p-4 space-y-2">
          <label className={labelCls}>Featured image</label>
          {form.featured_image_url ? (
            <div className="relative w-full h-36 rounded overflow-hidden">
              <Image src={form.featured_image_url} alt="featured" fill className="object-cover" />
            </div>
          ) : (
            <div style={{ border: "1px dashed #374151" }} className="h-36 rounded flex items-center justify-center text-[#6b7280] text-xs">
              {uploading ? "Uploading…" : "No image"}
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFeatured(e.target.files[0])} className="text-xs text-[#9ca3af]" />
        </div>
      </aside>
    </div>
  );
}
