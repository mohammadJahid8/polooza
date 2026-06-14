import { ImageResponse } from 'next/og';

const APP_BACKGROUND = [
  'radial-gradient(circle at 24% 24%, rgba(174,214,241,0.18) 0, transparent 34%)',
  'radial-gradient(circle at 76% 20%, rgba(200,168,75,0.18) 0, transparent 30%)',
  'radial-gradient(circle at 50% 82%, rgba(41,128,185,0.22) 0, transparent 42%)',
  'linear-gradient(180deg, #040C16 0%, #0B1E33 48%, #071420 100%)',
].join(', ');

function buildLogoDataUri() {
  const svg = `
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" fill="none">
      <g stroke="#C8A84B" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 155 L15 62 Q15 10 60 10 Q105 10 105 62 L105 155" stroke-width="4.5" />
        <line x1="15" y1="155" x2="105" y2="155" stroke-width="4.5" />
        <path d="M22 152 L22 64 Q22 18 60 18 Q98 18 98 64 L98 152" stroke-width="2.1" stroke-opacity="0.3" />
        <path d="M60 137 Q58 122 57 107 Q56 92 60 76" stroke-width="4.6" />
        <circle cx="60" cy="58" r="8.2" stroke-width="2.3" />
        <path d="M22 140 Q32 134 44 140 Q56 146 68 140 Q80 134 98 140" stroke-width="2.1" />
        <path d="M22 148 Q32 142 44 148 Q56 154 68 148 Q80 142 98 148" stroke-width="2.1" />
        <path d="M60 76 Q43 66 33 53" stroke-width="3.1" />
        <path d="M60 76 Q45 69 39 59" stroke-width="2.5" />
        <path d="M60 79 Q41 75 34 67" stroke-width="2.3" />
        <path d="M60 84 Q43 84 37 77" stroke-width="1.9" />
        <line x1="42" y1="64" x2="37" y2="60" stroke-width="1.1" stroke-opacity="0.55" />
        <line x1="46" y1="72" x2="41" y2="68" stroke-width="1.1" stroke-opacity="0.55" />
        <path d="M60 76 Q77 66 87 53" stroke-width="3.1" />
        <path d="M60 76 Q75 69 81 59" stroke-width="2.5" />
        <path d="M60 79 Q79 75 86 67" stroke-width="2.3" />
        <path d="M60 84 Q77 84 83 77" stroke-width="1.9" />
        <line x1="78" y1="64" x2="83" y2="60" stroke-width="1.1" stroke-opacity="0.55" />
        <line x1="74" y1="72" x2="79" y2="68" stroke-width="1.1" stroke-opacity="0.55" />
        <path d="M60 76 Q54 61 49 52" stroke-width="2" />
        <path d="M60 76 Q66 61 71 52" stroke-width="2" />
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createPwaIconResponse(size: number) {
  const borderSize = Math.max(2, Math.round(size * 0.014));
  const outerInset = Math.round(size * 0.08);
  const glowSize = Math.round(size * 0.66);
  const logoWidth = Math.round(size * 0.36);
  const logoHeight = Math.round(logoWidth * (160 / 120));
  const logoDataUri = buildLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#060F1A',
          backgroundImage: APP_BACKGROUND,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: outerInset,
            borderRadius: '28%',
            border: `${borderSize}px solid rgba(200, 168, 75, 0.18)`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: glowSize,
            height: glowSize,
            borderRadius: '50%',
            border: `${Math.max(2, borderSize - 1)}px solid rgba(174, 214, 241, 0.16)`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: Math.round(size * 0.56),
            height: Math.round(size * 0.56),
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(11,30,51,0.84) 0%, rgba(6,15,26,0) 72%)',
          }}
        />

        {/* next/image is not available inside ImageResponse rendering. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          alt=''
          width={logoWidth}
          height={logoHeight}
          style={{
            objectFit: 'contain',
            filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.38))',
          }}
        />
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
