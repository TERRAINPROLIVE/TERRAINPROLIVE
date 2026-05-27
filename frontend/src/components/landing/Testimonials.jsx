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
      "I do residential landscaping with a 3-person crew. Quoteforge made us look like a corporate. Conversion went up, full stop.",
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
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
            [ Field Reports ]
          </span>
          <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl tracking-tight max-w-2xl">
            Tradies running it
            <br />
            on real jobs.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-neutral-800">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="border-r border-b border-neutral-800 p-8 sm:p-10 flex flex-col"
            >
              <Quote className="w-8 h-8 text-yellow-500 mb-6" strokeWidth={1.5} />
              <blockquote className="text-neutral-200 text-base leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-neutral-800">
                <div className="font-display uppercase text-base tracking-tight">
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
