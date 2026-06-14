'use client';

import { useRef, useState } from 'react';

interface VideoUploadProps {
  /** Current Cloudinary secure_url (empty string / undefined if none) */
  value?: string;
  /** Called with the new secure_url after a successful upload, or '' when removed */
  onChange: (url: string) => void;
  /** Optional Cloudinary folder to upload into */
  folder?: string;
  label?: string;
}

interface SignResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  error?: string;
}

const MAX_BYTES = 200 * 1024 * 1024; // 200MB safety guard

export default function VideoUpload({
  value,
  onChange,
  folder = 'palooza/schedule-videos',
  label = 'Highlight video',
}: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');

    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Video is too large (max 200MB).');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // 1. Ask our server for a signature (the secret stays on the server).
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });
      const sign: SignResponse = await signRes.json();
      if (!signRes.ok || !sign.signature) {
        throw new Error(sign.error || 'Could not sign the upload.');
      }

      // 2. Upload the file DIRECTLY to Cloudinary (bypasses our server entirely).
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sign.apiKey);
      form.append('timestamp', String(sign.timestamp));
      form.append('folder', sign.folder);
      form.append('signature', sign.signature);

      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`,
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.secure_url) resolve(data.secure_url as string);
              else reject(new Error('Upload succeeded but no URL was returned.'));
            } catch {
              reject(new Error('Could not parse Cloudinary response.'));
            }
          } else {
            let msg = `Upload failed (${xhr.status}).`;
            try {
              const data = JSON.parse(xhr.responseText);
              if (data?.error?.message) msg = data.error.message;
            } catch {
              /* keep generic message */
            }
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.send(form);
      });

      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const btnCls =
    'bg-transparent border border-palooza-gold/60 text-palooza-gold font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.2em] uppercase py-[0.55rem] px-4 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className='flex flex-col gap-2 mb-4'>
      <label className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70'>
        {label}
      </label>

      {/* Preview of the currently uploaded video */}
      {value ? (
        <div className='mb-1 flex justify-start'>
          <div
            className='relative rounded-sm overflow-hidden max-w-full'
            style={{ border: '1px solid rgba(200,168,75,.25)' }}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={value}
              controls
              playsInline
              preload='metadata'
              className='block max-w-full max-h-[260px]'
            />
          </div>
        </div>
      ) : (
        <div className='text-[0.62rem] text-palooza-ivory/30 italic'>
          No video uploaded yet.
        </div>
      )}

      {/* Hidden native input, driven by the buttons below */}
      <input
        ref={inputRef}
        type='file'
        accept='video/*'
        className='hidden'
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {uploading ? (
        <div className='flex flex-col gap-1'>
          <div className='h-[6px] w-full rounded-full overflow-hidden' style={{ background: 'rgba(200,168,75,.12)' }}>
            <div
              className='h-full bg-palooza-gold transition-[width] duration-150'
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className='text-[0.6rem] tracking-[0.1em] text-palooza-gold'>
            Uploading… {progress}%
          </span>
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className={btnCls}
          >
            {value ? 'Replace video ↻' : 'Upload video ↑'}
          </button>
          {value && (
            <button
              type='button'
              onClick={() => {
                setError('');
                onChange('');
              }}
              className='bg-transparent border border-palooza-flame/50 text-palooza-flame/90 font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.2em] uppercase py-[0.55rem] px-4 cursor-pointer transition-all duration-300 hover:bg-palooza-flame hover:text-palooza-ivory'
            >
              Remove ✕
            </button>
          )}
        </div>
      )}

      {error && (
        <span className='text-[0.62rem] text-palooza-flame'>{error}</span>
      )}
    </div>
  );
}
