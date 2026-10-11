"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SITE } from "@/site.config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  const field = "w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-green transition-colors";
  const fieldStyle = { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" };

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }} className="flex items-center justify-center px-4">
      <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }} className="w-full max-w-md rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white">{SITE.name}</h1>
          <p style={{ color: "#6b7280" }} className="text-sm mt-1">Admin Panel</p>
        </div>
        <div className="space-y-4">
          <div>
            <label style={{ color: "#9ca3af" }} className="text-xs font-medium block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} className={field} />
          </div>
          <div>
            <label style={{ color: "#9ca3af" }} className="text-xs font-medium block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={fieldStyle}
              className={field}
            />
          </div>
          {error && <p style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }} className="text-xs px-4 py-2.5 rounded-lg">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
