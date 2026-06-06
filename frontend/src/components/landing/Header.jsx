import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Instagram, ArrowUpRight, Sparkles } from "lucide-react";

const NAV = [
  { label: "Key Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#waitlist" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/terrainproai", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/terrainproai", Icon: Instagram },
];

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const goSignup = () => {
    setOpen(false);
    navigate("/signup");
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "bg-black/95 backdrop-blur-sm border-b border-neutral-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        {/* Left — Logo */}
        <a href="#top" data-testid="logo-link" className="flex items-center gap-3 group">
          <img
            src="/terrainpro-logo-full.png"
            alt="TerrainPRO"
            data-testid="header-logo-img"
            className="h-14 sm:h-20 w-auto object-contain shrink-0 select-none"
            draggable={false}
          />
          <span className="font-mono text-[10px] sm:text-xs text-yellow-500 uppercase tracking-[0.25em] border-l border-yellow-500/30 pl-3 hidden sm:inline-block">
            AI Estimator
          </span>
        </a>

        {/* Right — Desktop horizontal nav (hover-pause float animation) */}
        <nav
          data-testid="desktop-nav"
          aria-label="Primary"
          className="hidden md:flex items-center gap-9 lg:gap-11 nav-float"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-testid={`desktop-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="group inline-flex items-baseline font-mono uppercase text-[13px] lg:text-[14px] tracking-[0.22em] text-white/85 hover:text-yellow-500 transition-colors duration-200"
            >
              <span className="font-display tracking-[0.14em] text-[16px] lg:text-[18px] font-bold">
                {item.label.toUpperCase()}
              </span>
            </a>
          ))}
          <button
            type="button"
            data-testid="desktop-nav-cta"
            onClick={() => navigate("/signup")}
            className="ml-2 inline-flex items-center gap-2 h-11 px-5 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-[12px] btn-industrial transition-transform duration-150 hover:bg-yellow-400 active:translate-y-[1px]"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Start Free Trial
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          data-testid="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-150 ${
            open
              ? "bg-yellow-500 text-black border-yellow-500"
              : "bg-neutral-800 text-white border-neutral-700 hover:border-amber-400"
          }`}
        >
          {open ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
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
              className="md:hidden fixed inset-0 top-16 sm:top-20 bg-black/70 backdrop-blur-sm -z-10"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              data-testid="dropdown-menu"
              className="md:hidden absolute right-6 lg:right-8 top-[72px] sm:top-[88px] w-[88vw] max-w-sm overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            >
              <div className="px-5 pt-5 pb-4 border-b border-zinc-800/50 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">Menu</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">Esc to close</span>
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
                      <span className="font-display uppercase text-base tracking-tight font-bold">{item.label}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-yellow-500 transition-all" strokeWidth={2} />
                  </a>
                ))}
              </nav>

              <div className="px-5 pt-5">
                <button
                  type="button"
                  data-testid="menu-start-trial"
                  onClick={goSignup}
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
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Social</div>
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
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold">{label}</span>
                      <ArrowUpRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100 group-hover:text-yellow-500 transition-all" strokeWidth={2} />
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
