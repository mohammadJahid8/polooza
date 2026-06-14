'use client';

import { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

type InstallPlatform = 'ios-safari' | 'ios-other' | 'android' | 'other';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

const DISMISS_KEY = 'palooza_pwa_prompt_hidden';

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(userAgent: string) {
  return (
    /iphone|ipad|ipod/i.test(userAgent) &&
    /safari/i.test(userAgent) &&
    !/crios|fxios|edgios|opr\//i.test(userAgent)
  );
}

function getInstallPlatform(userAgent: string): InstallPlatform {
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return isIosSafari(userAgent) ? 'ios-safari' : 'ios-other';
  }

  return 'other';
}

export default function PwaInstallPrompt() {
  const [platform] = useState<InstallPlatform>(() =>
    getInstallPlatform(window.navigator.userAgent),
  );
  const [isSecureContextReady] = useState(() => window.isSecureContext);
  const [hidden, setHidden] = useState(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';
    const standalone = isStandaloneMode();
    const currentPlatform = getInstallPlatform(window.navigator.userAgent);

    return dismissed || standalone || currentPlatform === 'other';
  });
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore registration failures and keep the web experience intact.
    });
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      const dismissed = sessionStorage.getItem(DISMISS_KEY) === '1';

      event.preventDefault();
      setDeferredPrompt(event);
      setHidden(dismissed || isStandaloneMode());
    };

    const handleAppInstalled = () => {
      sessionStorage.setItem(DISMISS_KEY, '1');
      setDeferredPrompt(null);
      setHidden(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const dismissPrompt = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setHidden(true);
  };

  const installApp = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    if (choice.outcome === 'accepted') {
      dismissPrompt();
      return;
    }

    setHidden(true);
  };

  const shouldShow = !hidden && platform !== 'other';

  const installMessage = (() => {
    if (deferredPrompt) {
      return 'Add this site to your home screen for quicker access and a more app-like mobile experience.';
    }

    if (platform === 'ios-safari') {
      return "Tap Safari's share button, then choose Add to Home Screen.";
    }

    if (platform === 'ios-other') {
      return 'Open this site in Safari, then use Share > Add to Home Screen to save it as an app.';
    }

    if (!isSecureContextReady) {
      return 'App install needs HTTPS. Open this site over HTTPS to enable Add to Home Screen.';
    }

    return 'Open your browser menu and choose Install app or Add to Home screen. If the browser enables direct install, the Install button will appear here.';
  })();

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className='pointer-events-none fixed inset-x-0 bottom-0 z-[10010] px-4 md:hidden'
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <div className='pointer-events-auto mx-auto max-w-sm rounded-[28px] border border-[rgba(200,168,75,.24)] bg-[rgba(6,15,26,.94)] shadow-[0_18px_48px_rgba(0,0,0,.42)] backdrop-blur-xl'>
        <div className='flex items-start gap-3 p-4'>
          <div className='mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(200,168,75,.28)] bg-[rgba(200,168,75,.08)] text-palooza-gold'>
            {deferredPrompt ? <Download className='size-4' /> : <Share2 className='size-4' />}
          </div>

          <div className='min-w-0 flex-1'>
            <p className='font-[family-name:var(--font-cinzel)] text-sm tracking-[0.2em] uppercase text-palooza-ivory'>
              Install Palooza
            </p>
            <p className='mt-2 text-sm leading-5 text-palooza-sand'>
              {installMessage}
            </p>
          </div>

          <button
            type='button'
            onClick={dismissPrompt}
            className='rounded-full p-1 text-palooza-sand/70 transition hover:bg-white/5 hover:text-palooza-ivory'
            aria-label='Dismiss install prompt'
          >
            <X className='size-4' />
          </button>
        </div>

        <div className='flex gap-2 px-4 pb-4'>
          {deferredPrompt ? (
            <button
              type='button'
              onClick={installApp}
              className='flex-1 rounded-full bg-palooza-gold px-4 py-3 text-sm font-medium text-palooza-deep transition hover:bg-palooza-gold2'
            >
              Install
            </button>
          ) : null}

          <button
            type='button'
            onClick={dismissPrompt}
            className='flex-1 rounded-full border border-[rgba(200,168,75,.22)] bg-transparent px-4 py-3 text-sm font-medium text-palooza-ivory transition hover:bg-white/5'
          >
            {deferredPrompt ? 'Later' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
}
