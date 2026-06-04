import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Instagram, ArrowUpRight, Sparkles } from "lucide-react";

const NAV = [
  { label: "How It Works", href: "#how", external: false },
  { label: "Pricing", href: "#pricing", external: false },
  { label: "Contact", href: "#waitlist", external: false },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/terrainproai",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/terrainproai",
    Icon: Instagram,
  },
];

export default function Header({ onTryEstimator }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "bg-black/95 backdrop-blur-sm border-b border-neutral-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="logo-link"
          className="flex items-center gap-3 group"
        >
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 bg-yellow-500 grid place-items-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 sm:w-8 sm:h-8 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 17V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              <circle cx="9" cy="13" r="3" />
              <path d="M9 10V7" />
              <path d="M15 19v-3" />
              <path d="M19 19v-2" />
            </svg>
            <span aria-hidden className="absolute inset-0 border-2 border-black/10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display uppercase text-2xl font-black sm:text-3xl tracking-wide">
              <span className="text-white">Terrain</span>
              <span className="text-yellow-500">PRO</span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-yellow-500 uppercase tracking-[0.25em] mt-1">
              AI Estimator
            </span>
          </div>
        </a>

        <button
          data-testid="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`group inline-flex items-center gap-3 sm:gap-4 py-3 px-5 sm:py-4 sm:px-8 font-black uppercase tracking-wider rounded-sm border-2 border-black transition-all duration-150 active:translate-y-[3px] active:shadow-[0_2px_0_0_#000] ${
            open
              ? "bg-white text-black shadow-[0_5px_0_0_#000] hover:bg-yellow-400"
              : "bg-yellow-500 text-black shadow-[0_5px_0_0_#000] hover:bg-white"
          }`}
        >
          <span className="text-xs sm:text-lg tracking-[0.18em] sm:tracking-[0.22em]">
            You Ready
          </span>
          <span className="w-7 h-7 sm:w-9 sm:h-9 grid place-items-center border-2 border-black/80 bg-black/5 group-hover:bg-black/10 transition-colors">
            {open ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
            )}
          </span>
        </button>
      </div>

      {/* Backdrop + dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              data-testid="menu-backdrop"
              className="fixed inset-0 top-16 sm:top-20 bg-black/70 backdrop-blur-sm -z-10"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              data-testid="dropdown-menu"
              className="absolute right-6 lg:right-8 top-[72px] sm:top-[88px] w-[88vw] max-w-sm overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            >
              <div className="px-5 pt-5 pb-4 border-b border-zinc-800/50 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                  Menu
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Esc to close
                </span>
              </div>

              <nav className="py-1">
                {NAV.map((item, i) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group flex items-center justify-between px-5 py-5 border-b border-zinc-800/50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-zinc-600 tracking-[0.2em] group-hover:text-yellow-500 transition-colors">
                        / 0{i + 1}
                      </span>
                      <span className="font-display uppercase text-base tracking-tight font-bold">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-yellow-500 transition-all"
                      strokeWidth={2}
                    />
                  </a>
                ))}
              </nav>

              <div className="px-5 pt-5">
                <button
                  type="button"
                  data-testid="menu-start-trial"
                  onClick={() => {
                    setOpen(false);
                    onTryEstimator?.();
                  }}
                  className="group w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-lg bg-yellow-500 text-black font-black uppercase tracking-wider border-2 border-black shadow-[0_4px_0_0_#000] transition-all duration-150 hover:bg-white active:translate-y-[2px] active:shadow-[0_2px_0_0_#000]"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                  Start Free Trial
                </button>
                <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Sign in to the quote tool
                </p>
              </div>

              <div className="px-5 py-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">
                  Social
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      data-testid={`menu-social-${label.toLowerCase()}`}
                      className="group flex items-center gap-3 px-4 h-12 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold">
                        {label}
                      </span>
                      <ArrowUpRight
                        className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100 group-hover:text-yellow-500 transition-all"
                        strokeWidth={2}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
