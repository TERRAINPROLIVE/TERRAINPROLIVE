import { ClipboardList, Cpu, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Describe the job",
    body:
      "Punch in job type, square meterage, timeline and materials. Voice notes work too — TerrainPRO parses the lot.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI does the math",
    body:
      "TerrainPRO AI cross-checks rates against your region, plant, soil class and current material pricing — in seconds.",
  },
  {
    n: "03",
    icon: FileCheck2,
    title: "Send a tight quote",
    body:
      "Get a line-itemed, GST-inclusive quote with assumptions and exclusions. Branded PDF, ready to fire off.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      data-testid="how-it-works"
      className="relative py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-4">
            <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
              [ Process ]
            </span>
          </div>
          <div className="md:col-span-7 md:col-start-6 text-neutral-400 leading-relaxed self-end">
            Quote on your phone from the cab or review the pipeline on your
            laptop. TerrainPRO kills the back-of-envelope hustle by building
            precise, line-itemed estimates. Our adaptive AI constantly learns,
            automatically tracking down live material rates from the closest
            suppliers to your job location so your margins are always locked
            in.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-zinc-900/50 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors"
            >
              {/* Watermark step number */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute top-3 right-5 font-display text-6xl sm:text-7xl font-extrabold text-zinc-600/70 tracking-tight leading-none"
              >
                {s.n}
              </span>

              <div className="relative flex items-start mb-6">
                <s.icon
                  className="w-7 h-7 text-yellow-500 group-hover:text-yellow-400 transition-colors"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="relative font-display uppercase text-2xl tracking-tight mb-3 text-white">
                {s.title}
              </h3>
              <p className="relative text-neutral-300 leading-relaxed text-sm">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
