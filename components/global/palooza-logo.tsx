import React from "react";

type LogoSize = "sm" | "md" | "lg" | "gate";

const sizeMap: Record<LogoSize, string> = {
  sm: "w-[34px]",
  md: "w-[50px]",
  lg: "w-[clamp(120px,30vw,155px)]",
  gate: "w-[110px]",
};

interface PaloozaLogoProps {
  size?: LogoSize;
  className?: string;
  detailed?: boolean;
}

export default function PaloozaLogo({
  size = "md",
  className = "",
  detailed = false,
}: PaloozaLogoProps) {
  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 160"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#C8A84B"
        strokeWidth={detailed ? "1.2" : "1.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Arch frame */}
        <path d="M15 155 L15 62 Q15 10 60 10 Q105 10 105 62 L105 155" />
        <line x1="15" y1="155" x2="105" y2="155" />
        {detailed && (
          <path
            d="M22 152 L22 64 Q22 18 60 18 Q98 18 98 64 L98 152"
            strokeOpacity="0.3"
          />
        )}
        {/* Trunk + sun */}
        <path d="M60 137 Q58 122 57 107 Q56 92 60 76" strokeWidth="1.6" />
        <circle cx="60" cy="58" r="5.5" strokeWidth="1.1" />
        {/* Waves */}
        <path
          className="wave-1"
          d="M22 140 Q32 134 44 140 Q56 146 68 140 Q80 134 98 140"
          strokeWidth="1.1"
        />
        {detailed && (
          <path
            className="wave-2"
            d="M22 148 Q32 142 44 148 Q56 154 68 148 Q80 142 98 148"
            strokeWidth="1.1"
          />
        )}
        {/* Left fronds */}
        <g className="fronds-left">
          <path d="M60 76 Q43 66 33 53" strokeWidth="1.3" />
          {detailed && (
            <>
              <path d="M60 76 Q45 69 39 59" strokeWidth="1.1" />
              <path d="M60 79 Q41 75 34 67" />
              <path d="M60 84 Q43 84 37 77" strokeWidth="0.9" />
              <line
                x1="42" y1="64" x2="37" y2="60"
                strokeWidth="0.6" strokeOpacity="0.55"
              />
              <line
                x1="46" y1="72" x2="41" y2="68"
                strokeWidth="0.6" strokeOpacity="0.55"
              />
            </>
          )}
          {!detailed && <path d="M60 79 Q41 75 34 67" />}
        </g>
        {/* Right fronds */}
        <g className="fronds-right">
          <path d="M60 76 Q77 66 87 53" strokeWidth="1.3" />
          {detailed && (
            <>
              <path d="M60 76 Q75 69 81 59" strokeWidth="1.1" />
              <path d="M60 79 Q79 75 86 67" />
              <path d="M60 84 Q77 84 83 77" strokeWidth="0.9" />
              <line
                x1="78" y1="64" x2="83" y2="60"
                strokeWidth="0.6" strokeOpacity="0.55"
              />
              <line
                x1="74" y1="72" x2="79" y2="68"
                strokeWidth="0.6" strokeOpacity="0.55"
              />
            </>
          )}
          {!detailed && <path d="M60 79 Q79 75 86 67" />}
        </g>
        {/* Centre fronds (detailed only) */}
        {detailed && (
          <g className="fronds-centre">
            <path d="M60 76 Q54 61 49 52" />
            <path d="M60 76 Q66 61 71 52" />
          </g>
        )}
      </svg>
    </div>
  );
}
