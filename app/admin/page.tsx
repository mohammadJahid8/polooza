"use client";

import { useState } from "react";
import LoginPanel from "./_components/login-panel";
import DashboardPanel from "./_components/dashboard-panel";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);

  function handleLogin(data: RsvpEntry[]) {
    setRsvps(data);
    setIsLoggedIn(true);
  }

  function handleRefresh(data: RsvpEntry[]) {
    setRsvps(data);
  }

  return (
    <div className="min-h-screen bg-palooza-deep text-palooza-ivory p-8 px-6">
      {/* Header */}
      <div
        className="text-center mb-10 pb-6"
        style={{ borderBottom: "1px solid rgba(200, 168, 75, .2)" }}
      >
        <div className="font-[family-name:var(--font-cinzel)] text-[1.4rem] text-palooza-ivory mb-[0.3rem]">
          Ibiza Palooza VI
        </div>
        <div className="text-[0.65rem] tracking-[0.25em] uppercase text-palooza-gold">
          Host Dashboard — Private
        </div>
      </div>

      {!isLoggedIn ? (
        <LoginPanel onLogin={handleLogin} />
      ) : (
        <DashboardPanel rsvps={rsvps} onRefresh={handleRefresh} />
      )}
    </div>
  );
}

export interface RsvpEntry {
  name?: string;
  phone?: string;
  rsvp?: Record<string, string>;
  allergies?: string[];
  other?: string;
  submittedAt?: string;
}
