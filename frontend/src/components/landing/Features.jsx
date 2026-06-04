import { motion } from "framer-motion";
import {
  Truck,
  Calculator,
  FileText,
  ShieldCheck,
  Smartphone,
  Banknote,
} from "lucide-react";

const FEATURES = [
  {
    icon: Calculator,
    title: "Material AI Calculation",
    body:
      "Pulls live rates for concrete, road base, geo-fabric, mulch, pavers, reo — by location and supplier.",
  },
  {
    icon: Truck,
    title: "Plant & Spoil Logic",
    body:
      "Knows excavator capacity, tipper loads and dump fees. Quotes spoil removal without ringing your mate.",
  },
  {
    icon: FileText,
    title: "Branded PDF Quotes",
    body:
      "GST-inclusive, line-itemed, with assumptions, exclusions and signed acceptance — emailed in one tap.",
  },
  {
    icon: ShieldCheck,
    title: "Defensible Estimates",
    body:
      "Every number traceable. Assumptions surfaced. Less variation arguments, more jobs in the diary.",
  },
  {
    icon: Smartphone,
    title: "Phone-First",
    body:
      "Quote from the cab. Voice input, offline drafts, dead-simple form. No laptop, no admin, no excuses.",
  },
  {
    icon: Banknote,
    title: "Xero & MYOB Export",
    body:
      "Accepted quotes flow straight to invoicing. Track variations, deposits and progress claims in one place.",
  },
];

const FEATURE_IMG =
  "https://customer-assets.emergentagent.com/job_quick-quote-ai-2/artifacts/p7m417v3_slab-edited.jpg";

export default function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 bg-neutral-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
              [ Capabilities ]
            </span>
            <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl tracking-tight">
              Built like the gear
              <br />
              you already trust.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-neutral-800">
          {/* Image cell */}
          <div className="md:col-span-5 md:row-span-2 relative min-h-[260px] md:min-h-0 border-b md:border-b-0 md:border-r border-neutral-800 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center scale-125"
              style={{ backgroundImage: `url(${FEATURE_IMG})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
            <div className="relative h-full p-8 flex flex-col justify-end">
              <span className="font-mono text-[10px] tracking-[0.3em] text-yellow-500 uppercase mb-3">
                / SPEC-01
              </span>
              <h3 className="font-display uppercase text-3xl tracking-tight max-w-xs">
                Pour-ready quotes
              </h3>
              <p className="mt-3 text-sm text-neutral-300 max-w-sm">
                Concrete strength, reo spacing, formwork, broom finish — all
                priced from the same brief you'd scribble on a beam.
              </p>
            </div>
          </div>

          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`md:col-span-3 p-6 sm:p-7 border-neutral-800 hover:bg-black transition-colors ${
                i % 2 === 0 ? "border-r" : ""
              } ${i < 4 ? "border-b" : ""}`}
            >
              <f.icon
                className="w-7 h-7 text-yellow-500 mb-5"
                strokeWidth={1.5}
              />
              <h4 className="font-display uppercase text-lg tracking-tight mb-2">
                {f.title}
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
