import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Capabilities", href: "#estimator" },
  { label: "Key Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how" },
];

const TRADES_LINKS = [
  { label: "Earthmoving", href: "#features" },
  { label: "Concreting", href: "#features" },
  { label: "Landscaping", href: "#features" },
  { label: "Preferred Pros", to: "/directory" },
];

const CONTACT_LINKS = [
  { label: "crew@terrainpro.com.au", href: "mailto:crew@terrainpro.com.au" },
  { label: "1800 QUOTE-IT", href: "tel:18007868348" },
  { label: "Get in Touch", href: "#waitlist" },
];

function ColumnLink({ item }) {
  const cls =
    "inline-block text-[13px] text-white/85 hover:text-[#ffb703] transition-colors duration-200 font-medium tracking-wide";
  if (item.to) {
    return (
      <Link to={item.to} className={cls}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={cls}>
      {item.label}
    </a>
  );
}

function ColumnHeading({ children }) {
  return (
    <h4
      className="font-display text-[12px] font-bold uppercase tracking-[0.3em] text-[#ffb703] mb-5"
    >
      {children}
    </h4>
  );
}

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0b0b0b] text-white"
    >
      {/* Yellow broken separator at top */}
      <div
        aria-hidden
        className="h-[3px] w-full bg-[length:14px_3px] bg-repeat-x"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #ffb703 0 8px, transparent 8px 14px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Left — Brand block */}
          <div className="md:col-span-5">
            <Link
              to="/"
              data-testid="footer-logo"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/terrainpro-logo-full.png"
                alt="TerrainPRO"
                data-testid="footer-logo-img"
                className="h-14 w-auto object-contain shrink-0 select-none"
                draggable={false}
              />
            </Link>
            <p className="mt-6 text-[13px] text-white/65 max-w-sm leading-relaxed">
              Built in Australia for the crews who actually do the work.
              Earthmoving, concreting, landscaping — quoted in seconds.
            </p>

            <Link
              to="/signup"
              data-testid="footer-cta"
              className="mt-7 inline-flex items-center gap-2 h-11 px-5 bg-[#ffb703] text-black font-black uppercase tracking-[0.18em] text-[11px] btn-industrial transition-all duration-150 hover:bg-[#ffc933] active:translate-y-[1px]"
            >
              Start Free Trial
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.6} />
            </Link>
          </div>

          {/* Spacer for layout balance on md+ */}
          <div className="hidden md:block md:col-span-1" />

          {/* Product */}
          <nav
            aria-label="Footer product links"
            className="md:col-span-2"
            data-testid="footer-col-product"
          >
            <ColumnHeading>Product</ColumnHeading>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((it) => (
                <li key={it.label}>
                  <ColumnLink item={it} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Trades */}
          <nav
            aria-label="Footer trades links"
            className="md:col-span-2"
            data-testid="footer-col-trades"
          >
            <ColumnHeading>Trades</ColumnHeading>
            <ul className="space-y-3">
              {TRADES_LINKS.map((it) => (
                <li key={it.label}>
                  <ColumnLink item={it} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <nav
            aria-label="Footer contact links"
            className="md:col-span-2"
            data-testid="footer-col-contact"
          >
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="space-y-3">
              {CONTACT_LINKS.map((it) => (
                <li key={it.label}>
                  <ColumnLink item={it} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Utility bar */}
        <div className="mt-14 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            © {new Date().getFullYear()} TerrainPRO AI · ABN 00 000 000 000 · Australia
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Built with the universal LLM key · GPT-5.2
          </p>
        </div>
      </div>
    </footer>
  );
}
