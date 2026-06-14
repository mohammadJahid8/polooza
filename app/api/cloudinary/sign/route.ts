import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';


export async function POST(req: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: 'Cloudinary is not configured on the server.' },
      { status: 500 },
    );
  }

  // Allow the caller to scope uploads into a folder; fall back to a sensible default.
  let folder = 'palooza/schedule-videos';
  try {
    const body = await req.json();
    if (body && typeof body.folder === 'string' && body.folder.trim()) {
      folder = body.folder.trim();
    }
  } catch {
    /* no body / invalid JSON — use the default folder */
  }

  const timestamp = Math.round(Date.now() / 1000);


  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return Response.json({ cloudName, apiKey, timestamp, folder, signature });
}
