import { motion } from "framer-motion";
import {
  Box,
  Calculator,
  Truck,
  FileText,
  Smartphone,
  Plus,
} from "lucide-react";

const FEATURES = [
  {
    icon: Box,
    title: "Intelligent Scope-to-Math Translation",
    body:
      "It replaces messy back-of-envelope sketches. Speak or type raw site dimensions, and the system instantly calculates complex engineering variables — like reinforcement, mix strengths and base materials — without you looking up a single chart.",
  },
  {
    icon: Calculator,
    title: "Live Geo-Pricing Radar",
    body:
      "No more relying on out-of-date rate sheets. The app uses your job's exact GPS coordinates to pull real-time material costs from the nearest local supply yards, locking in your margins against sudden market price spikes.",
  },
  {
    icon: Truck,
    title: "Automated Site Physics & Haulage",
    body:
      "It takes the guesswork out of earthmoving logistics. By factoring in truck capacities, soil expansion ratios and live local tipping fees, it automatically prices site cuts and spoil removal accurately so you don't lose profit at the dump.",
  },
  {
    icon: FileText,
    title: "One-Tap Professional Proposals",
    body:
      "It transforms raw project figures into airtight commercial bids. In seconds, the app generates a polished, GST-inclusive PDF breakdown complete with standard exclusions, legal assumptions and a digital sign-off area ready for your client's phone.",
  },
  {
    icon: Smartphone,
    title: "High-Vibration Field Design",
    body:
      "Built for a dusty truck cab, not a quiet office desk. It focuses on rapid voice-to-text inputs, offline drafts for poor reception zones and high-contrast layouts so you can secure winning bids before you even turn the ignition key.",
  },
];

function Crosshair({ position }) {
  return (
    <Plus
      aria-hidden
      className={`absolute ${position} w-3 h-3 text-zinc-700 pointer-events-none`}
      strokeWidth={1.5}
    />
  );
}

export default function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 bg-neutral-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-4">
            <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
              <span className="opacity-50">[</span> Key Features <span className="opacity-50">]</span>
            </span>
          </div>
          <div className="md:col-span-7 md:col-start-6 text-neutral-400 leading-relaxed self-end">
            Built like the gear you already trust. Five core systems engineered
            for the tradies running dirt, pouring slabs and shaping yards.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              data-testid={`feature-card-${i + 1}`}
              className="relative bg-zinc-900/40 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors"
            >
              {/* Blueprint crosshairs */}
              <Crosshair position="top-2 left-2" />
              <Crosshair position="bottom-2 right-2" />

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
