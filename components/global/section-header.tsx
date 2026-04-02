interface SectionHeaderProps {
  label: string;
  title: string;
}

export default function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <>
      <div className="section-label mb-2 flex items-center gap-[0.8rem] text-[0.58rem] uppercase tracking-[0.3em] text-palooza-gold">
        {label}
      </div>
      <h2 className="mb-10 font-[family-name:var(--font-cinzel)] text-[clamp(1.6rem,5vw,2.2rem)] font-normal tracking-[0.05em] text-palooza-ivory">
        {title}
      </h2>
    </>
  );
}
