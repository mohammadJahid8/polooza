import PaloozaLogo from '@/components/global/palooza-logo';
import CountdownTimer from './countdown-timer';
import AudioPlayer from './audio-player';

export default function HeroSection() {
  return (
    <section
      id='home'
      className='hero-bg relative min-h-screen flex flex-col items-center justify-center px-8 pt-24 pb-16 overflow-hidden text-center'
      style={{
        background:
          'radial-gradient(ellipse at 30% 60%, rgba(41,128,185,.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(200,168,75,.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(41,128,185,.2) 0%, transparent 60%), linear-gradient(180deg, #040C16 0%, #0B1E33 45%, #071420 100%)',
      }}
    >
      {/* Spinning rings */}
      <div
        className='absolute border rounded-full pointer-events-none w-[420px] h-[420px] animate-[slowSpin_80s_linear_infinite]'
        style={{ borderColor: 'rgba(200, 168, 75, .07)' }}
      />
      <div
        className='absolute border rounded-full pointer-events-none w-[290px] h-[290px] animate-[slowSpin_50s_linear_infinite_reverse]'
        style={{ borderColor: 'rgba(174, 214, 241, .06)' }}
      />

      {/* Content */}
      <div className='relative z-[1]'>
        {/* Tag */}
        <div className='text-[0.62rem] tracking-[0.32em] uppercase text-palooza-gold mb-[1.2rem] opacity-0 animate-[fadeUp_1s_ease_0.2s_forwards]'>
          Chapter VI · Ibiza
        </div>

        {/* Logo */}
        <PaloozaLogo
          size='lg'
          detailed
          className='mx-auto mb-6 opacity-0 animate-[fadeUp_1.2s_ease_0.4s_forwards]'
        />

        {/* Title */}
        <div className='font-[family-name:var(--font-cinzel)] text-[clamp(2.5rem,9vw,5rem)] font-normal leading-[1.05] tracking-[0.06em] text-palooza-ivory opacity-0 animate-[fadeUp_1s_ease_0.6s_forwards]'>
          PALOOZA
        </div>

        {/* Subtitle */}
        <div className='font-(family-name:--font-cormorant) italic text-[clamp(1.4rem,4vw,2.2rem)] text-palooza-gold tracking-[0.06em] mt-[0.4rem] opacity-0 animate-[fadeUp_1s_ease_0.75s_forwards]'>
          Los Cuatro Elementos
        </div>

        {/* Elements */}
        <div className='flex gap-6 justify-center mt-[1.8rem]'>
          <div className='text-[0.55rem] tracking-[0.2em] uppercase flex flex-col items-center gap-[0.3rem] text-palooza-tierra opacity-0 animate-[fadeUp_1s_ease_0.92s_forwards]'>
            <span className='text-[1.1rem]'>🌍</span>Tierra
          </div>
          <div className='text-[0.55rem] tracking-[0.2em] uppercase flex flex-col items-center gap-[0.3rem] text-palooza-agua opacity-0 animate-[fadeUp_1s_ease_1.0s_forwards]'>
            <span className='text-[1.1rem]'>🌊</span>Agua
          </div>
          <div className='text-[0.55rem] tracking-[0.2em] uppercase flex flex-col items-center gap-[0.3rem] text-palooza-fuego opacity-0 animate-[fadeUp_1s_ease_1.08s_forwards]'>
            <span className='text-[1.1rem]'>🔥</span>Fuego
          </div>
          <div className='text-[0.55rem] tracking-[0.2em] uppercase flex flex-col items-center gap-[0.3rem] text-palooza-aire opacity-0 animate-[fadeUp_1s_ease_1.16s_forwards]'>
            <span className='text-[1.1rem]'>💨</span>Aire
          </div>
        </div>

        {/* Dates */}
        <div className='text-[0.65rem] tracking-[0.2em] uppercase text-palooza-sand mt-8 opacity-0 animate-[fadeUp_1s_ease_1.05s_forwards]'>
          30 July – 2 August · Ibiza / Formentera
        </div>

        {/* Countdown */}
        <CountdownTimer />

        {/* Scroll indicator */}
        <div className='mt-12 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_1s_ease_1.3s_forwards]'>
          <div className='text-[0.55rem] tracking-[0.25em] uppercase text-palooza-gold'>
            Scroll
          </div>
          <div className='scroll-line' />
        </div>

        {/* Audio Player */}
        <AudioPlayer />
      </div>
    </section>
  );
}
