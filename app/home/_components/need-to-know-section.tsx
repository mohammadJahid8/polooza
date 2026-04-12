'use client';

import SectionHeader from '@/components/global/section-header';
import RevealWrapper from '@/components/global/reveal-wrapper';
import { useContent } from '@/lib/useContent';

export default function NeedToKnowSection() {
  const { needToKnow } = useContent();

  return (
    <section id='needtoknow' className='py-20 px-6 bg-palooza-deep'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='Essential Info' title='Need to Know' />
        <div className='flex flex-col gap-[0.8rem]'>
          {needToKnow.items.map((item, i) => (
            <RevealWrapper key={item.title} delay={i * 80}>
              <div
                className='flex gap-4 items-start py-[0.9rem] px-[1.1rem] transition-colors duration-300 hover:border-l-palooza-gold'
                style={{
                  borderLeft: '2px solid rgba(200, 168, 75, .3)',
                  background: 'rgba(200, 168, 75, .04)',
                }}
              >
                <div className='text-[1.1rem] shrink-0 mt-[0.05rem]'>{item.icon}</div>
                <div>
                  <div className='text-[0.72rem] tracking-[0.12em] uppercase text-palooza-ivory mb-[0.2rem] font-normal'>
                    {item.title}
                  </div>
                  <div className='font-(family-name:--font-cormorant) italic text-[0.95rem] text-palooza-sand leading-[1.5]'>
                    {item.detail}
                  </div>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* WhatsApp button */}
        <a
          href='https://wa.me/447854954028'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-[0.6rem] text-[0.65rem] tracking-[0.18em] uppercase text-[#25D366] no-underline py-3 px-[1.4rem] transition-colors duration-300 mt-6 hover:bg-[rgba(37,211,102,.1)]'
          style={{ border: '1px solid rgba(37, 211, 102, .3)' }}
        >
          <svg className='w-4 h-4 fill-[#25D366]' viewBox='0 0 24 24'>
            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
          </svg>
          Message Michael
        </a>
      </div>
    </section>
  );
}
