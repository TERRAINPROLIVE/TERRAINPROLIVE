import { motion } from "framer-motion";
import { AlertTriangle, Activity, FileCheck2 } from "lucide-react";

const CASES = [
  {
    spec: "OLD-01",
    icon: AlertTriangle,
    tag: "The Old Hustle",
    title: "The Weekend Paperwork Trap",
    body:
      "Spending Sunday nights staring at back-of-envelope sketches, second-guessing your supplier costs, and chasing your tail trying to build a professional-looking quote.",
    stats: [
      { k: "Lost Per Quote", v: "3+ Hours" },
      { k: "Rate Sheets", v: "Outdated" },
      { k: "Burn Out", v: "Sunday" },
    ],
    muted: true,
  },
  {
    spec: "NEW-02",
    icon: Activity,
    tag: "The Tech",
    title: "Live Margin Protection",
    body:
      "No more getting burned by sudden supplier price hikes. TerrainPRO automatically scans live material rates from the closest yards to your exact job coordinates.",
    stats: [
      { k: "From The Cab", v: "10 Mins" },
      { k: "Yard Pricing", v: "Real-Time" },
      { k: "Locked Margins", v: "100%" },
    ],
  },
  {
    spec: "NEW-03",
    icon: FileCheck2,
    tag: "The Output",
    title: "Airtight Proposals In Seconds",
    body:
      "Avoid variation arguments down the line. Fire off a branded, line-itemed, GST-inclusive PDF to your client's phone before you even turn your truck's ignition key.",
    stats: [
      { k: "PDF Exports", v: "Professional" },
      { k: "Exclusions", v: "Built-In" },
      { k: "Jobs Won", v: "3.2x More" },
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
            <span className="opacity-50">[</span> The Old Way vs. The TerrainPRO Way <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
            You didn&apos;t get into the trade to sit behind a laptop all weekend.
            See how TerrainPRO takes the friction out of your field operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CASES.map((c, i) => {
            const isMuted = c.muted;
            return (
              <motion.div
                key={c.spec}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                data-testid={`use-case-${c.spec.toLowerCase()}`}
                className={`relative bg-zinc-900/40 border border-zinc-800 border-l-2 rounded-lg p-6 group transition-colors ${
                  isMuted
                    ? "border-l-zinc-600 hover:bg-zinc-900/70 hover:border-l-zinc-500"
                    : "border-l-yellow-500 hover:bg-zinc-900 hover:border-l-yellow-400"
                }`}
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
                    className={`w-7 h-7 transition-colors ${
                      isMuted
                        ? "text-neutral-500 group-hover:text-neutral-400"
                        : "text-yellow-500 group-hover:text-yellow-400"
                    }`}
                    strokeWidth={1.8}
                  />
                </div>

                <span
                  className={`relative z-10 inline-block font-mono text-[10px] uppercase tracking-[0.25em] mb-2 ${
                    isMuted ? "text-neutral-500" : "text-yellow-500"
                  }`}
                >
                  {c.tag}
                </span>
                <h3
                  className={`relative z-10 font-display uppercase text-xl sm:text-2xl tracking-tight mb-3 ${
                    isMuted ? "text-neutral-300" : "text-white"
                  }`}
                >
                  {c.title}
                </h3>
                <p className="relative z-10 text-sm text-neutral-300 leading-relaxed mb-5">
                  {c.body}
                </p>

                <div className="relative z-10 grid grid-cols-3 border-t border-zinc-800 pt-4 -mx-2">
                  {c.stats.map((s) => (
                    <div key={s.k} className="px-2 min-w-0">
                      <div
                        className={`font-mono text-sm sm:text-lg font-bold leading-tight break-words ${
                          isMuted ? "text-neutral-400" : "text-yellow-500"
                        }`}
                      >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
