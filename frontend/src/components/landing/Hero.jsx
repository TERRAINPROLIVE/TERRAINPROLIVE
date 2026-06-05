import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/747abd9c-2a04-4e8d-97e7-67c6e970cdc3/images/b6feb06c1e22eb535e31a44dae30920128c69818aea25cf6f2f8021a10380ce0.png";

export default function Hero() {
  const navigate = useNavigate();
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 sm:pb-28 pt-20 sm:pt-24 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          data-testid="hero-title"
          className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight max-w-5xl"
        >
          <span className="text-yellow-500">#1</span> Quoting Tool
          <br />
          For Aussie Tradies
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            type="button"
            onClick={() => navigate("/signup")}
            data-testid="hero-primary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-lg bg-[#F5A623] text-zinc-900 font-black uppercase tracking-widest text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(245,166,35,0.5)] hover:bg-[#ffb733] hover:shadow-[0_14px_38px_-4px_rgba(245,166,35,0.65)] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            <span>Start Free Trial</span>
          </button>

          <a
            href="#how"
            data-testid="hero-secondary-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 rounded-lg border-2 border-white text-white font-black uppercase tracking-widest text-sm sm:text-base bg-transparent hover:bg-white/10 transition-all duration-200"
          >
            <Play className="w-4 h-4" strokeWidth={2.5} />
            <span>Watch Demo</span>
          </a>
        </motion.div>

        {/* Stats dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {[
            { v: "10 mins", k: "Average Quote Time" },
            { v: "94%", k: "Accuracy Rate" },
            { v: "3.2x", k: "More Jobs Won" },
            { v: "Self Optimising", k: "With Every Quote" },
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
