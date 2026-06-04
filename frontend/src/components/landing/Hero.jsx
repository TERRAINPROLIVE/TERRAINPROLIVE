import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/747abd9c-2a04-4e8d-97e7-67c6e970cdc3/images/b6feb06c1e22eb535e31a44dae30920128c69818aea25cf6f2f8021a10380ce0.png";

export default function Hero({ onTryEstimator }) {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" aria-hidden />
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />

      {/* Top tickertape — live + trades */}
      <div className="absolute top-16 sm:top-20 inset-x-0 z-10 border-y border-yellow-500/30 bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-center gap-2 sm:gap-4 font-mono font-semibold text-[7px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.32em] text-neutral-300 whitespace-nowrap">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 animate-pulse" />
            <span>LIVE</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-yellow-500 tracking-[0.22em] sm:tracking-[0.38em]">
            Concreting · Landscaping · Earthmoving
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 sm:pb-28 pt-32 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          data-testid="hero-title"
          className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight max-w-5xl"
        >
          Quote in
          <br />
          <span className="text-yellow-500">15 mins.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="mt-8 max-w-2xl"
        >
          <div className="font-mono text-xs uppercase tracking-[0.35em] text-yellow-500">
            TerrainPRO
          </div>
          <p className="mt-2 text-lg sm:text-xl text-neutral-200 leading-tight">
            AI quoting software for Australian tradies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            type="button"
            onClick={onTryEstimator}
            data-testid="hero-primary-cta"
            className="group relative inline-flex items-center justify-center gap-3 py-4 px-8 sm:py-5 sm:px-10 bg-zinc-900/80 backdrop-blur-sm border-2 border-yellow-500 text-yellow-500 font-black uppercase tracking-widest text-sm sm:text-base transition-all duration-200 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_24px_rgba(234,179,8,0.45)]"
          >
            {/* Corner brackets */}
            <span aria-hidden className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-yellow-500" />
            <span aria-hidden className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-yellow-500" />
            <span aria-hidden className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-yellow-500" />
            <span aria-hidden className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-yellow-500" />

            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span>Start Free Trial</span>
          </button>
        </motion.div>

        {/* Stats dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {[
            { v: "8 mins", k: "Average Quote Time" },
            { v: "94%", k: "Accuracy Rate" },
            { v: "3.2x", k: "More Jobs Won" },
            { v: "Smarter", k: "With Every Quote" },
          ].map((s, i) => (
            <div
              key={i}
              className="relative bg-zinc-900/50 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-4 sm:p-6 group hover:bg-zinc-900 hover:border-l-yellow-400 transition-colors"
            >
              <div className="relative z-10">
                <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                  {s.v}
                </div>
                <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400">
                  {s.k}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
