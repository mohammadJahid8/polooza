"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function GateForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  /* Auto-enter if already authenticated */
  useEffect(() => {
    const token = localStorage.getItem("palooza_token");
    const savedPhone = localStorage.getItem("palooza_phone");
    if (token && savedPhone) {
      router.push("/home");
    }
  }, [router]);

  function showError(msg: string, ms = 4000) {
    setError(msg);
    setTimeout(() => setError(""), ms);
  }

  function enterApp(verifiedPhone: string) {
    localStorage.setItem(
      "palooza_token",
      btoa(verifiedPhone + ":" + Date.now())
    );
    localStorage.setItem("palooza_phone", verifiedPhone);
    router.push("/home");
  }

  function previewBypass() {
    enterApp("+447854954028");
  }

  async function sendCode() {
    const trimmed = phone.trim();
    if (!trimmed || trimmed.replace(/[^0-9]/g, "").length < 10) {
      showError("Enter number with country code e.g. +447...");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmed }),
      });
      const d = await res.json();
      if (!res.ok) {
        showError(d.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setStep(2);
      setTimeout(() => codeRef.current?.focus(), 300);
    } catch {
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    const trimmed = code.trim();
    if (!trimmed || trimmed.length !== 6) {
      showError("Enter the 6-digit code", 3000);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: trimmed }),
      });
      const d = await res.json();
      if (!res.ok) {
        showError(d.error || "Incorrect code. Please try again.");
        setCode("");
        setLoading(false);
        return;
      }
      enterApp(phone.trim());
    } catch {
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function backToPhone() {
    setStep(1);
    setCode("");
    setError("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (step === 2) verifyCode();
      else sendCode();
    }
  }

  /* Auto-verify on 6 digits */
  useEffect(() => {
    if (code.length === 6) verifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Step 1: Phone number */}
      {step === 1 && (
        <div className="flex flex-col items-center gap-[0.9rem] w-full max-w-[280px] opacity-0 animate-[fadeUp_1s_ease_1s_forwards]">
          <label className="self-start text-[0.6rem] uppercase tracking-[0.25em] text-palooza-sand">
            Your mobile number
          </label>
          <input
            className="w-full bg-transparent border-none border-b border-b-palooza-gold/50 py-[0.65rem] text-center font-[family-name:var(--font-cinzel)] text-[0.95rem] tracking-[0.1em] text-palooza-ivory outline-none transition-colors duration-300 focus:border-b-palooza-gold2 placeholder:text-palooza-ivory/20 placeholder:tracking-[0.15em] placeholder:text-[0.75rem] placeholder:font-[family-name:var(--font-jost)]"
            style={{ borderBottom: "1px solid rgba(200, 168, 75, .5)" }}
            type="tel"
            placeholder="+44 7700 000000"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="text-[0.6rem] tracking-[0.12em] text-palooza-ivory/35 text-center mt-[0.2rem]">
            We&apos;ll send you a verification code
          </div>
          <button
            className="w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 mt-[0.8rem] hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50"
            onClick={sendCode}
            disabled={loading}
          >
            {loading ? "..." : "Send Code ↗"}
          </button>
          {error && (
            <div className="text-[0.7rem] tracking-[0.1em] text-palooza-flame text-center min-h-4 mt-[0.2rem]">
              {error}
            </div>
          )}
          <button
            onClick={previewBypass}
            className="bg-none border-none text-palooza-gold/20 font-[family-name:var(--font-jost)] text-[0.55rem] tracking-[0.2em] uppercase cursor-pointer mt-6"
          >
            Preview only ···
          </button>
        </div>
      )}

      {/* Step 2: OTP code */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-[0.9rem] w-full max-w-[280px] opacity-0 animate-[fadeUp_1s_ease_0.2s_forwards]">
          <label className="self-start text-[0.6rem] uppercase tracking-[0.25em] text-palooza-sand">
            Enter your code
          </label>
          <input
            ref={codeRef}
            className="w-full bg-transparent border-none py-[0.65rem] text-center font-[family-name:var(--font-cinzel)] text-[1.4rem] tracking-[0.4em] text-palooza-ivory outline-none transition-colors duration-300 focus:border-b-palooza-gold2 placeholder:text-palooza-ivory/20 placeholder:tracking-[0.15em] placeholder:text-[0.75rem] placeholder:font-[family-name:var(--font-jost)]"
            style={{ borderBottom: "1px solid rgba(200, 168, 75, .5)" }}
            type="tel"
            placeholder="· · · · · ·"
            maxLength={6}
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="text-[0.6rem] tracking-[0.12em] text-palooza-ivory/35 text-center mt-[0.2rem]">
            Code sent to {phone}
          </div>
          <button
            className="w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 mt-[0.8rem] hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50"
            onClick={verifyCode}
            disabled={loading}
          >
            {loading ? "..." : "Verify ↗"}
          </button>
          <button
            onClick={backToPhone}
            className="bg-none border-none text-palooza-gold/40 font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.2em] uppercase cursor-pointer mt-[0.3rem]"
          >
            ← Change number
          </button>
          {error && (
            <div className="text-[0.7rem] tracking-[0.1em] text-palooza-flame text-center min-h-4 mt-[0.2rem]">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
