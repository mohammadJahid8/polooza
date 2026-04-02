"use client";

import { useState } from "react";
import type { RsvpEntry } from "../page";

const ADMIN_PASSWORD = "palooza2025host";

interface LoginPanelProps {
  onLogin: (data: RsvpEntry[]) => void;
}

export default function LoginPanel({ onLogin }: LoginPanelProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const pw = password.trim();
    if (pw !== ADMIN_PASSWORD) {
      setError("Incorrect password");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/save-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword: ADMIN_PASSWORD }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error loading data");
        setLoading(false);
        return;
      }
      onLogin(data.rsvps || []);
    } catch {
      setError("Network error — are you on the hosted app?");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="max-w-[320px] mx-auto mt-16 text-center" onKeyDown={handleKeyDown}>
      <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-palooza-gold mb-[0.8rem]">
        Host Password
      </label>
      <input
        className="w-full bg-transparent border-none py-[0.7rem] text-center font-[family-name:var(--font-cinzel)] text-base tracking-[0.3em] text-palooza-ivory outline-none mb-[1.2rem]"
        style={{ borderBottom: "1px solid rgba(200, 168, 75, .4)" }}
        type="password"
        placeholder="· · · · · · · ·"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.25em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50"
      >
        {loading ? "..." : "Access Dashboard ↗"}
      </button>
      {error && (
        <div className="text-[0.7rem] text-palooza-flame text-center mt-2 min-h-4">
          {error}
        </div>
      )}
    </div>
  );
}
