"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SC: {
      Widget: (iframe: HTMLIFrameElement) => SCWidget;
    };
  }
}

interface SCWidget {
  bind: (event: string, callback: () => void) => void;
  play: () => void;
  pause: () => void;
  getPosition: (cb: (pos: number) => void) => void;
  getDuration: (cb: (dur: number) => void) => void;
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const widgetRef = useRef<SCWidget | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = initPlayer;
    document.head.appendChild(script);

    function initPlayer() {
      if (!iframeRef.current || !window.SC) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind("play" as string, () => {
        setIsPlaying(true);
        intervalRef.current = setInterval(updateProgress, 500);
      });
      widget.bind("pause" as string, () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      });
      widget.bind("finish" as string, () => {
        setIsPlaying(false);
        if (progressRef.current) progressRef.current.style.width = "0%";
        if (intervalRef.current) clearInterval(intervalRef.current);
      });
    }

    function updateProgress() {
      const w = widgetRef.current;
      if (!w) return;
      w.getPosition((pos) => {
        w.getDuration((dur) => {
          if (dur > 0 && progressRef.current) {
            progressRef.current.style.width = `${(pos / dur) * 100}%`;
          }
        });
      });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function togglePlay() {
    const w = widgetRef.current;
    if (!w) return;
    if (isPlaying) w.pause();
    else w.play();
  }

  return (
    <div className="mt-[1.8rem] opacity-0 animate-[fadeUp_1s_ease_1.5s_forwards] flex flex-col items-center gap-[0.6rem]">
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
        style={{
          border: "1px solid rgba(200, 168, 75, .5)",
          background: "rgba(200, 168, 75, .08)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Pulse ring */}
        <div
          className="absolute -inset-1 rounded-full transition-all duration-300"
          style={{
            border: isPlaying
              ? "1px solid rgba(200, 168, 75, .25)"
              : "1px solid transparent",
            animation: isPlaying ? "pulseRing 2s ease-in-out infinite" : "none",
          }}
        />
        {/* Play icon */}
        {!isPlaying && (
          <svg className="w-4 h-4 fill-palooza-gold ml-[2px]" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {/* Pause icon */}
        {isPlaying && (
          <svg className="w-4 h-4 fill-palooza-gold" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="w-[120px] h-[2px] rounded-sm overflow-hidden" style={{ background: "rgba(200, 168, 75, .15)" }}>
        <div
          ref={progressRef}
          className="h-full rounded-sm transition-[width] duration-500 linear"
          style={{
            width: "0%",
            background: "linear-gradient(90deg, #C8A84B, #E8C96A)",
          }}
        />
      </div>

      {/* Hidden SoundCloud iframe */}
      <iframe
        ref={iframeRef}
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/impressumrecordings/sommers-uk-room-1-6&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false&color=%23C8A84B"
        className="absolute w-px h-px opacity-0 pointer-events-none"
        allow="autoplay"
      />
    </div>
  );
}
