import Marquee from "react-fast-marquee";

const ITEM = "Your Project · Our Terrain";

export default function SloganMarquee() {
  // Repeat the slogan so the marquee has consistent visual rhythm
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section
      data-testid="slogan-marquee"
      className="relative border-y border-neutral-900 bg-neutral-950 py-6"
    >
      <div className="marquee-fade">
        <Marquee speed={30} gradient={false} pauseOnHover>
          {items.map((i) => (
            <div
              key={i}
              className="mx-8 flex items-center gap-3 font-display uppercase text-lg sm:text-2xl tracking-tight text-neutral-500 hover:text-yellow-500 transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-yellow-500/60" />
              {ITEM}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
