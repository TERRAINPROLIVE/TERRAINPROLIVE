import { motion } from "framer-motion";

const CASES = [
  {
    tag: "EARTHMOVING",
    title: "Bulk earthworks & cut/fill",
    body:
      "Site cuts, pad preparation, trenching, spoil removal. TerrainPRO sizes the excavator, calls the tipper runs, and prices it like a 30-year subbie would.",
    img: "https://images.pexels.com/photos/37393680/pexels-photo-37393680.jpeg",
    stats: [
      { k: "Avg job", v: "$8.4K" },
      { k: "Plant", v: "1.5–13t" },
      { k: "Spoil/load", v: "12t" },
    ],
  },
  {
    tag: "CONCRETING",
    title: "Slabs, footpaths & driveways",
    body:
      "From a 20m² shed slab to a 400m² industrial pour. Mix strength, reo, formwork, control joints and pump rates — done before your coffee's cold.",
    img: "https://static.prod-images.emergentagent.com/jobs/747abd9c-2a04-4e8d-97e7-67c6e970cdc3/images/8a5426a3c4fd7ffff49172e78e3e71be6d7343b360d6f04e51aafa9149109697.png",
    stats: [
      { k: "Mix", v: "32MPa" },
      { k: "Coverage", v: "m² + m³" },
      { k: "Cure", v: "28 days" },
    ],
  },
  {
    tag: "LANDSCAPING",
    title: "Hardscape & softscape combos",
    body:
      "Pavers, retaining walls, turf, irrigation, planting schedules. Mix and match scope — TerrainPRO knows what plays nicely with what.",
    img: "https://images.pexels.com/photos/16239805/pexels-photo-16239805.jpeg",
    stats: [
      { k: "Pavers", v: "/m²" },
      { k: "Retaining", v: "blocks/lm" },
      { k: "Turf", v: "couch/buffalo" },
    ],
  },
];

export default function UseCases() {
  return (
    <section
      data-testid="use-cases"
      className="relative py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
              [ Use Cases ]
            </span>
            <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl tracking-tight">
              Three trades.
              <br />
              One brain.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 self-end text-neutral-400 leading-relaxed">
            TerrainPRO's model is trained on real Australian site jobs —
            earthmoving, concreting, landscaping. It speaks tradie, not
            corporate.
          </div>
        </div>

        <div className="space-y-6">
          {CASES.map((c, i) => (
            <motion.article
              key={c.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 border border-neutral-800 hover:border-yellow-500/40 transition-colors group"
            >
              <div
                className={`lg:col-span-5 relative min-h-[240px] lg:min-h-[320px] overflow-hidden ${
                  i % 2 === 0 ? "" : "lg:order-2"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${c.img})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.3em] uppercase bg-yellow-500 text-black px-2.5 py-1">
                  {c.tag}
                </span>
              </div>
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <h3 className="font-display uppercase text-3xl sm:text-4xl tracking-tight mb-4">
                  {c.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-8">{c.body}</p>
                <div className="grid grid-cols-3 border-t border-neutral-800 divide-x divide-neutral-800">
                  {c.stats.map((s) => (
                    <div key={s.k} className="pt-5 pl-4 first:pl-0">
                      <div className="font-mono text-xl sm:text-2xl text-yellow-500 font-bold">
                        {s.v}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                        {s.k}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
