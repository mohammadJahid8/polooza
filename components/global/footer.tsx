import PaloozaLogo from './palooza-logo';

export default function Footer() {
  return (
    <footer
      className='bg-palooza-deep px-6 py-12 text-center'
      style={{ borderTop: '1px solid rgba(200, 168, 75, .1)' }}
    >
      <PaloozaLogo size='md' className='mx-auto mb-[1.2rem] opacity-50' />
      <div className='text-[0.62rem] uppercase tracking-[0.2em] text-palooza-ivory/30'>
        Ibiza Palooza · Chapter VI · 2025
      </div>
      <div className='mt-[0.4rem] font-(family-name:--font-cormorant) italic text-[0.95rem] text-palooza-gold opacity-55'>
        Tierra · Agua · Fuego · Aire
      </div>
    </footer>
  );
}
