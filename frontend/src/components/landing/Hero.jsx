import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";

const TICKER_ITEMS = [
  "AI QUOTING",
  "CONCRETING",
  "LANDSCAPING",
  "EARTHMOVING",
  "LINE-ITEM QUOTES",
  "BUILT FOR AUSSIE TRADIES",
];

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

      {/* Top tickertape — bold, equally-spaced infinite marquee */}
      <div className="absolute top-16 sm:top-20 inset-x-0 z-10 border-y border-yellow-500/30 bg-black/70 backdrop-blur-sm">
        <div className="flex items-center">
          <span className="hidden sm:flex shrink-0 items-center gap-2 pl-6 pr-5 py-2.5 font-mono font-bold text-[10px] uppercase tracking-[0.3em] text-neutral-200 border-r border-yellow-500/30">
            <span className="w-2 h-2 bg-green-500 animate-pulse" />
            LIVE
          </span>
          <div className="marquee-fade flex-1 min-w-0">
            <Marquee speed={42} gradient={false} autoFill className="py-2 sm:py-2.5">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="ml-7 sm:ml-10 inline-flex items-center gap-7 sm:gap-10 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-200"
                >
                  <span aria-hidden className="w-1.5 h-1.5 rotate-45 bg-yellow-500 shrink-0" />
                  {item}
                </span>
              ))}
            </Marquee>
          </div>
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
