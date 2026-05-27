import { Check, X } from "lucide-react";

const TIERS = [
  {
    name: "Sole Trader",
    price: "$0",
    period: "/ month",
    sub: "Free during beta",
    body: "For ABNs flying solo. Get tight quotes out the door without the admin headache.",
    cta: "Start Free",
    highlight: false,
    perks: [
      { ok: true, t: "20 AI quotes / month" },
      { ok: true, t: "Branded PDF export" },
      { ok: true, t: "Mobile-first quoting" },
      { ok: false, t: "Multi-user crews" },
      { ok: false, t: "Xero / MYOB sync" },
    ],
  },
  {
    name: "Crew",
    price: "$79",
    period: "/ month",
    sub: "Per business, unlimited users",
    body: "For 2–10 person crews running multiple jobs a week. Sync with the office.",
    cta: "Start 14-day Trial",
    highlight: true,
    perks: [
      { ok: true, t: "Unlimited AI quotes" },
      { ok: true, t: "Branded PDF + email" },
      { ok: true, t: "Multi-user with roles" },
      { ok: true, t: "Xero / MYOB export" },
      { ok: true, t: "Custom rates library" },
    ],
  },
  {
    name: "Contractor",
    price: "Custom",
    period: "",
    sub: "Volume + enterprise",
    body: "For builders and head contractors. SSO, audit trails, bulk variations.",
    cta: "Talk to Sales",
    highlight: false,
    perks: [
      { ok: true, t: "Everything in Crew" },
      { ok: true, t: "SSO + audit logs" },
      { ok: true, t: "API + integrations" },
      { ok: true, t: "Dedicated success eng." },
      { ok: true, t: "Custom AI tuning" },
    ],
  },
];

const HAZARD_BG =
  "https://static.prod-images.emergentagent.com/jobs/747abd9c-2a04-4e8d-97e7-67c6e970cdc3/images/8a6e0e28588a6d4a32a829f80e506465aa8ce8eedab9f19c94b543ac5bb6aa75.png";

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${HAZARD_BG})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/70" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
            [ Pricing ]
          </span>
          <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl tracking-tight">
            Priced like a tool,
            <br />
            not a subscription trap.
          </h2>
          <p className="mt-6 text-neutral-400 max-w-2xl mx-auto">
            One quote you win pays for the year. Cancel any time — no lock-in,
            no exit fees, no BS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              data-testid={`pricing-tier-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`relative flex flex-col p-8 sm:p-10 border ${
                t.highlight
                  ? "border-yellow-500 bg-neutral-950 md:scale-[1.02] z-10"
                  : "border-neutral-800 bg-black/60"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-8 bg-yellow-500 text-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="font-display uppercase text-2xl tracking-tight">
                  {t.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-yellow-500">
                    {t.price}
                  </span>
                  <span className="text-neutral-500 text-sm">{t.period}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                  {t.sub}
                </p>
                <p className="mt-5 text-sm text-neutral-400 leading-relaxed">
                  {t.body}
                </p>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {t.perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    {p.ok ? (
                      <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-700 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={p.ok ? "text-neutral-200" : "text-neutral-600"}
                    >
                      {p.t}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                data-testid={`pricing-cta-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`mt-8 inline-flex items-center justify-center h-12 font-semibold uppercase tracking-[0.15em] text-xs ${
                  t.highlight
                    ? "bg-yellow-500 text-black btn-industrial"
                    : "border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
