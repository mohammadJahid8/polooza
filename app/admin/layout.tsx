export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-palooza-deep text-palooza-ivory'>
      <div className='p-8 px-6'>
        {/* Header */}
        <div
          className='text-center mb-10 pb-6'
          style={{ borderBottom: '1px solid rgba(200, 168, 75, .2)' }}
        >
          <div className='font-[family-name:var(--font-cinzel)] text-[1.4rem] text-palooza-ivory mb-[0.3rem]'>
            Ibiza Palooza VI
          </div>
          <div className='text-[0.65rem] tracking-[0.25em] uppercase text-palooza-gold'>
            Host Dashboard — Private
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
