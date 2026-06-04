import { motion } from "framer-motion";
import { Truck, Box, Leaf } from "lucide-react";

const CASES = [
  {
    spec: "USE-01",
    icon: Truck,
    tag: "Earthmoving",
    title: "Bulk Earthworks & Cut / Fill",
    body:
      "Site cuts, pad preparation, trenching, spoil removal. TerrainPRO sizes the excavator, calls the tipper runs and prices it like a 30-year subbie would.",
    stats: [
      { k: "Avg job", v: "$8.4K" },
      { k: "Plant", v: "1.5–13t" },
      { k: "Spoil/load", v: "12t" },
    ],
  },
  {
    spec: "USE-02",
    icon: Box,
    tag: "Concreting",
    title: "Slabs, Footpaths & Driveways",
    body:
      "From a 20m² shed slab to a 400m² industrial pour. Mix strength, reo, formwork, control joints and pump rates — done before your coffee's cold.",
    stats: [
      { k: "Mix", v: "32MPa" },
      { k: "Coverage", v: "m² + m³" },
      { k: "Cure", v: "28 days" },
    ],
  },
  {
    spec: "USE-03",
    icon: Leaf,
    tag: "Landscaping",
    title: "Hardscape & Softscape Combos",
    body:
      "Pavers, retaining walls, turf, irrigation, planting schedules. Mix and match scope — TerrainPRO knows what plays nicely with what.",
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
        <div className="mb-12">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> Use Cases <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
            Three trades, one brain. TerrainPRO's model is trained on real
            Australian site jobs — earthmoving, concreting, landscaping. It
            speaks tradie, not corporate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CASES.map((c, i) => (
            <motion.div
              key={c.spec}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              data-testid={`use-case-${c.spec.toLowerCase()}`}
              className="relative bg-zinc-900/40 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors"
            >
              {/* Watermark spec */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute top-3 right-4 font-display text-5xl sm:text-6xl font-extrabold text-zinc-600/70 tracking-tight leading-none"
              >
                {c.spec}
              </span>

              <div className="relative z-10 flex items-start mb-5">
                <c.icon
                  className="w-7 h-7 text-yellow-500 group-hover:text-yellow-400 transition-colors"
                  strokeWidth={1.8}
                />
              </div>

              <span className="relative z-10 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mb-2">
                {c.tag}
              </span>
              <h3 className="relative z-10 font-display uppercase text-xl sm:text-2xl tracking-tight mb-3 text-white">
                {c.title}
              </h3>
              <p className="relative z-10 text-sm text-neutral-300 leading-relaxed mb-5">
                {c.body}
              </p>

              <div className="relative z-10 grid grid-cols-3 border-t border-zinc-800 pt-4 -mx-2">
                {c.stats.map((s) => (
                  <div key={s.k} className="px-2 min-w-0">
                    <div className="font-mono text-sm sm:text-lg text-yellow-500 font-bold leading-tight break-words">
                      {s.v.split("/").map((part, idx, arr) => (
                        <span key={idx}>
                          {part}
                          {idx < arr.length - 1 ? "/" : ""}
                          {idx < arr.length - 1 ? <wbr /> : null}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
