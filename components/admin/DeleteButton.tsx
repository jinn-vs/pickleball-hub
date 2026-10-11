"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id, slug, endpoint }: { id: string; slug?: string; endpoint: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, slug }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Delete failed.");
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-xs font-semibold" style={{ color: "#f87171" }}>
      {busy ? "…" : "Delete"}
    </button>
  );
}
