import SectionHeader from "@/components/global/section-header";
import RevealWrapper from "@/components/global/reveal-wrapper";

const TRANSPORT_ITEMS = [
  {
    icon: "⛵",
    type: "Boats — Friday & Saturday",
    detail: (
      <>
        <strong className="text-palooza-ivory font-normal">Departure point:</strong> Marina Ibiza<br />
        <strong className="text-palooza-ivory font-normal">Departure time:</strong> 11:30am Friday, 11:00am Saturday<br />
        Please be there <strong className="text-palooza-ivory font-normal">15 minutes early</strong> — boats will not wait
      </>
    ),
    delay: 0,
  },
  {
    icon: "🚗",
    type: "Private Transfers",
    detail: (
      <>
        We strongly recommend booking a private driver for the weekend, particularly for late-night returns from Blue Marlin and the villa party.<br /><br />
        <strong className="text-palooza-ivory font-normal">Recommended:</strong> Book in advance through your hotel concierge or contact Michael for a trusted local driver
      </>
    ),
    delay: 100,
  },
  {
    icon: "🚕",
    type: "Taxis & Apps",
    detail: (
      <>
        Cabify and Bolt both operate in Ibiza and are more reliable than street taxis.<br /><br />
        <strong className="text-palooza-ivory font-normal">Download before you arrive</strong> and set up your account. Pre-book where possible — do not rely on finding a taxi late at night during peak season.
      </>
    ),
    delay: 200,
  },
  {
    icon: "✈️",
    type: "Airport",
    detail: (
      <>
        <strong className="text-palooza-ivory font-normal">Ibiza Airport (IBZ)</strong> — approx 15–20 mins from town<br />
        <strong className="text-palooza-ivory font-normal">Arrivals:</strong> Aim to land Thursday 30 July in time for 20:30 dinner in the middle of the island<br />
        <strong className="text-palooza-ivory font-normal">Departures:</strong> Book flights from Sunday afternoon onward — Jondal runs late
      </>
    ),
    delay: 300,
  },
];

export default function TransportSection() {
  return (
    <section id="transport" className="py-20 px-6 bg-palooza-navy">
      <div className="max-w-[680px] mx-auto">
        <SectionHeader label="Getting Around" title="Transport" />

        {/* Warning banner */}
        <div
          className="flex gap-[0.9rem] items-start p-[1.1rem_1.4rem] mb-[1.2rem]"
          style={{
            border: "1px solid rgba(192, 57, 43, .4)",
            background: "rgba(192, 57, 43, .07)",
          }}
        >
          <div className="text-[1.1rem] shrink-0 mt-[0.05rem]">⚠️</div>
          <div className="text-[0.82rem] text-palooza-sand leading-[1.65]">
            <strong className="text-palooza-ivory font-normal">Important — please read.</strong> Getting around Ibiza can be surprisingly difficult. Taxis and Uber can be very unreliable, especially late at night when demand is high. We strongly recommend grouping together with other guests and arranging private transfers well in advance. Don&apos;t leave this to the last minute — it will save you a lot of stress on the night.
          </div>
        </div>

        {/* Transport cards */}
        <div className="flex flex-col gap-4">
          {TRANSPORT_ITEMS.map((item) => (
            <RevealWrapper key={item.type} delay={item.delay}>
              <div className="p-[1.4rem]" style={{ border: "1px solid rgba(200, 168, 75, .18)" }}>
                <div className="text-[1.4rem] mb-2">{item.icon}</div>
                <div className="text-[0.6rem] tracking-[0.22em] uppercase text-palooza-gold mb-2">
                  {item.type}
                </div>
                <div className="text-[0.88rem] text-palooza-sand leading-[1.7]">
                  {item.detail}
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
