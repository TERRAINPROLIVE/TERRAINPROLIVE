import Marquee from "react-fast-marquee";

const ITEMS = [
  "BOBCAT · S70 · LICENCED",
  "CAT · 308 CR",
  "JOHN DEERE · 35G",
  "KOMATSU · PC55",
  "ALLIED CONCRETE · 32MPA",
  "BORAL · ROAD BASE",
  "HOLCIM · MIXES",
  "ANL · LANDSCAPE",
  "ADBRI · MASONRY",
  "BUILDXACT · INTEGRATIONS",
  "QBCC · LICENCE READY",
  "MYOB · XERO EXPORT",
];

export default function LogoMarquee() {
  return (
    <section
      data-testid="logo-marquee"
      className="relative border-y border-neutral-900 bg-neutral-950 py-6"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-neutral-700" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          Trusted by crews running
        </span>
      </div>
      <div className="marquee-fade">
        <Marquee speed={30} gradient={false} pauseOnHover>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="mx-8 flex items-center gap-3 font-display uppercase text-lg sm:text-2xl tracking-tight text-neutral-500 hover:text-yellow-500 transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-yellow-500/60" />
              {item}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
