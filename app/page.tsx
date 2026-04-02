import PaloozaLogo from '@/components/global/palooza-logo';
import GateForm from './_components/gate-form';

export default function GatePage() {
  return (
    <div className='fixed inset-0 z-[9999] bg-palooza-deep flex flex-col items-center justify-center p-8'>
      {/* Logo */}
      <PaloozaLogo
        size='gate'
        detailed
        className='mb-[2.2rem] opacity-0 animate-[fadeUp_1s_ease_0.2s_forwards]'
      />

      {/* Title */}
      <div className='font-[family-name:var(--font-cinzel)] text-[clamp(1.3rem,5vw,1.8rem)] tracking-[0.2em] text-center text-palooza-ivory opacity-0 animate-[fadeUp_1s_ease_0.4s_forwards]'>
        PALOOZA
      </div>

      {/* Chapter */}
      <div className='text-[0.65rem] tracking-[0.3em] uppercase text-palooza-gold text-center mt-[0.35rem] opacity-0 animate-[fadeUp_1s_ease_0.55s_forwards]'>
        Chapter VI
      </div>

      {/* Subtitle */}
      <div className='font-(family-name:--font-cormorant) italic text-[1.25rem] text-palooza-sky tracking-[0.06em] mt-[0.3rem] text-center opacity-0 animate-[fadeUp_1s_ease_0.65s_forwards]'>
        Los Cuatro Elementos
      </div>

      {/* Divider */}
      <div
        className='w-[60px] h-px mx-auto my-[1.8rem] opacity-0 animate-[fadeIn_1s_ease_0.8s_forwards]'
        style={{
          background:
            'linear-gradient(90deg, transparent, #C8A84B, transparent)',
        }}
      />

      {/* Dates */}
      <div className='text-[0.65rem] tracking-[0.22em] uppercase text-palooza-sand text-center mb-[2.4rem] opacity-0 animate-[fadeUp_1s_ease_0.9s_forwards]'>
        30 July – 2 August · Ibiza / Formentera
      </div>

      {/* Auth Form */}
      <GateForm />
    </div>
  );
}
