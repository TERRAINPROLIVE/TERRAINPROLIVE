import { motion } from "framer-motion";
import {
  Box,
  Calculator,
  Truck,
  FileText,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    spec: "SPEC-01",
    icon: Box,
    title: "Pour-Ready Quotes",
    body:
      "Concrete strength, reo spacing, formwork, broom finish — all priced from the same brief you'd scribble on a beam.",
  },
  {
    spec: "SPEC-02",
    icon: Calculator,
    title: "Material AI Calculation",
    body:
      "Pulls live rates for concrete, road base, geo-fabric, mulch, pavers and reo — by location and supplier.",
  },
  {
    spec: "SPEC-03",
    icon: Truck,
    title: "Plant & Spoil Logic",
    body:
      "Knows excavator capacity, tipper loads and dump fees. Quotes spoil removal without ringing your mate.",
  },
  {
    spec: "SPEC-04",
    icon: FileText,
    title: "Branded PDF Quotes",
    body:
      "GST-inclusive, line-itemed, with assumptions, exclusions and signed acceptance — emailed in one tap.",
  },
  {
    spec: "SPEC-05",
    icon: Smartphone,
    title: "Phone-First",
    body:
      "Quote from the cab. Voice input, offline drafts, dead-simple form. No laptop, no admin, no excuses.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 bg-neutral-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-7">
            <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
              [ Capabilities ]
            </span>
            <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
              Built like the gear you already trust. Five core systems engineered
              for the tradies running dirt, pouring slabs and shaping yards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.spec}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              data-testid={`feature-card-${f.spec.toLowerCase()}`}
              className="relative bg-zinc-900/40 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors"
            >
              {/* Watermark spec */}
              <span
                aria-hidden
                className="pointer-events-none select-none absolute top-3 right-4 font-display text-5xl sm:text-6xl font-extrabold text-zinc-600/70 tracking-tight leading-none"
              >
                {f.spec}
              </span>

              <div className="relative z-10 flex items-start mb-5">
                <f.icon
                  className="w-7 h-7 text-yellow-500 group-hover:text-yellow-400 transition-colors"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="relative z-10 font-display uppercase text-xl sm:text-2xl tracking-tight mb-3 text-white">
                {f.title}
              </h3>
              <p className="relative z-10 text-sm text-neutral-300 leading-relaxed">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
