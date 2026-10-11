"use client";

import { SITE } from "@/site.config";

type SeoValues = {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

export default function SeoPanel({
  values,
  fallbackTitle,
  slug,
  onChange,
}: {
  values: SeoValues;
  fallbackTitle: string;
  slug: string;
  onChange: (patch: Partial<SeoValues>) => void;
}) {
  const titleLen = (values.seo_title || fallbackTitle).length;
  const descLen = values.seo_description.length;
  const previewTitle = values.seo_title || fallbackTitle || "Untitled";
  const previewUrl = `${SITE.url}/blog/${slug || "your-article"}`;

  const counter = (len: number, max: number) => {
    const color = len > max ? "#dc3545" : len > max * 0.9 ? "#fd7e14" : "#6b7280";
    return <span style={{ color }} className="text-[11px]">{len}/{max}</span>;
  };

  return (
    <div style={{ border: "1px solid #1f2937", backgroundColor: "#0f172a" }} className="rounded-lg p-4 space-y-4">
      <h3 className="text-white text-sm font-bold uppercase tracking-wide">SEO Settings</h3>

      {/* Google preview */}
      <div style={{ backgroundColor: "#fff" }} className="rounded p-3">
        <p className="text-[#1a0dab] text-[16px] leading-tight clamp-2">{previewTitle}</p>
        <p className="text-[#006621] text-xs mt-0.5">{previewUrl}</p>
        <p className="text-[#545454] text-xs mt-1 clamp-2">
          {values.seo_description || "Add a meta description to control the snippet shown in Google."}
        </p>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[#9ca3af] text-xs font-medium">SEO Title</label>
          {counter(titleLen, 60)}
        </div>
        <input
          value={values.seo_title}
          onChange={(e) => onChange({ seo_title: e.target.value })}
          placeholder={fallbackTitle || "Defaults to the article title"}
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }}
          className="w-full px-3 py-2 rounded text-sm outline-none"
        />
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-[#9ca3af] text-xs font-medium">Meta Description</label>
          {counter(descLen, 160)}
        </div>
        <textarea
          value={values.seo_description}
          onChange={(e) => onChange({ seo_description: e.target.value })}
          rows={3}
          placeholder="Defaults to the excerpt"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }}
          className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-[#9ca3af] text-xs font-medium block mb-1">Keywords (comma-separated)</label>
        <input
          value={values.seo_keywords}
          onChange={(e) => onChange({ seo_keywords: e.target.value })}
          placeholder="pickleball, paddle review, beginner tips"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }}
          className="w-full px-3 py-2 rounded text-sm outline-none"
        />
      </div>
    </div>
  );
}
