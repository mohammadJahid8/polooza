import SectionHeader from '@/components/global/section-header';

export default function MemoriesSection() {
  return (
    <section id='memories' className='py-20 px-6 bg-palooza-navy'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='The Archive' title='Memories' />
        <div
          className='text-center py-12 px-4'
          style={{ border: '1px solid rgba(200, 168, 75, .15)' }}
        >
          <div className='text-[2rem] mb-4 opacity-40'>📸</div>
          <div className='font-(family-name:--font-cormorant) italic text-[1.1rem] text-palooza-sand leading-[1.6]'>
            A place to remember what happened — and forget what shouldn&apos;t
            be remembered.
          </div>
          <div className='text-[0.65rem] tracking-[0.18em] uppercase text-palooza-gold/40 mt-[0.8rem]'>
            Unlocked after 2 August
          </div>
        </div>
      </div>
    </section>
  );
}
