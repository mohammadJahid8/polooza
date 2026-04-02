import PaloozaLogo from "./palooza-logo";

const NAV_LINKS = [
  { href: "#schedule", label: "Schedule" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#music", label: "Music" },
  { href: "#transport", label: "Transport" },
  { href: "#needtoknow", label: "Need to Know" },
  { href: "#history", label: "Chapters" },
  { href: "#updates", label: "Updates" },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[1.2rem] py-3"
      style={{
        background: "rgba(6, 15, 26, .93)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200, 168, 75, .15)",
      }}
    >
      <PaloozaLogo size="sm" className="shrink-0" />
      <div
        className="flex gap-0 overflow-x-auto scrollbar-none"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap px-[0.6rem] py-[0.45rem] text-[0.55rem] uppercase tracking-[0.16em] text-palooza-sand transition-colors duration-200 hover:text-palooza-gold no-underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
