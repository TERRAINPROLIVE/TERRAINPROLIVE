import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Used to lose half a Sunday quoting. Now I do five quotes between morning teas. Won two slab jobs last week off the back of it.",
    name: "Dave Mancuso",
    role: "Mancuso Concreting",
    location: "Geelong, VIC",
  },
  {
    quote:
      "The plant and spoil maths is dead accurate. Variation arguments have basically stopped because everything's in writing up front.",
    name: "Jess O'Connor",
    role: "OC Earthworks",
    location: "Toowoomba, QLD",
  },
  {
    quote:
      "I do residential landscaping with a 3-person crew. TerrainPRO made us look like a corporate. Conversion went up, full stop.",
    name: "Tane Whaiapu",
    role: "Whaiapu Yards",
    location: "Western Sydney, NSW",
  },
];

export default function Testimonials() {
  return (
    <section
      data-testid="testimonials"
      className="relative py-24 sm:py-32 border-t border-neutral-900 bg-neutral-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> Talk of the Town <span className="opacity-50">]</span>
          </span>
          <h2 className="mt-4 font-display uppercase text-2xl sm:text-3xl tracking-tight text-white max-w-2xl">
            Tradies running it
            <br />
            on real jobs.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-card-${i + 1}`}
              className="relative bg-zinc-900/40 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors flex flex-col"
            >
              <Quote className="w-7 h-7 text-yellow-500 group-hover:text-yellow-400 transition-colors mb-5" strokeWidth={1.5} />
              <blockquote className="text-neutral-300 text-sm leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-zinc-800">
                <div className="font-display uppercase text-base tracking-tight text-white">
                  {t.name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mt-1">
                  {t.role}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{t.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
