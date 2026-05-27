import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Hammer } from "lucide-react";

const NAV = [
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-neutral-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#top"
          data-testid="logo-link"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 bg-yellow-500 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl uppercase tracking-tight">
              TerrainPRO
            </span>
            <span className="font-mono text-[10px] text-yellow-500 uppercase tracking-[0.25em]">
              AI Estimator
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs uppercase tracking-[0.18em] font-semibold text-neutral-400 hover:text-yellow-500 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#estimator"
            data-testid="header-cta"
            className="hidden sm:inline-flex items-center px-4 h-10 bg-yellow-500 text-black font-semibold text-xs uppercase tracking-[0.15em] btn-industrial"
          >
            Demo Quote
          </a>
          <button
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 grid place-items-center border border-neutral-800 text-neutral-200"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-black border-t border-neutral-800"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.18em] font-semibold text-neutral-300 py-2 border-b border-neutral-900"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#estimator"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center h-11 bg-yellow-500 text-black font-semibold text-xs uppercase tracking-[0.15em]"
              >
                Demo Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
