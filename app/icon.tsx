import type { ImageResponse } from 'next/og';
import { createPwaIconResponse } from '@/lib/pwa-icon';

const ICON_SIZES = [192, 512] as const;

export const contentType = 'image/png';

export function generateImageMetadata() {
  return ICON_SIZES.map((iconSize) => ({
    id: iconSize.toString(),
    size: {
      width: iconSize,
      height: iconSize,
    },
    contentType,
  }));
}

export default async function Icon({
  id,
}: {
  id: Promise<string>;
}): Promise<ImageResponse> {
  const iconSize = Number(await id);

  return createPwaIconResponse(
    ICON_SIZES.includes(iconSize as (typeof ICON_SIZES)[number]) ? iconSize : 192,
  );
}
