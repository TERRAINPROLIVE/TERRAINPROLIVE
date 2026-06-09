import { useState } from "react";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TIERS = [
  {
    id: "sole_quoter",
    name: "Sole Quoter",
    price: "$39",
    period: "/ month",
    sub: "Single user • Cancel any time",
    body: "For ABNs flying solo. Tight, line-itemed quotes out the door without the admin headache.",
    cta: "Start Sole Quoter",
    highlight: false,
    perks: [
      "Unlimited AI-generated quotes",
      "Branded PDF export (with your ABN)",
      "Quote save, edit & status tracking",
      "Mobile-first quoting on the go",
      "Toolbox Talks AI assistant",
    ],
  },
  {
    id: "crew",
    name: "Crew",
    price: "$69",
    period: "/ month",
    sub: "1–3 users • Cancel any time",
    body: "For 2–3 person crews running multiple jobs a week. Everyone on the same playbook.",
    cta: "Start Crew",
    highlight: true,
    perks: [
      "Everything in Sole Quoter",
      "Up to 3 user seats",
      "Shared quote library",
      "Preferred Pro's directory access",
      "Priority support",
    ],
  },
];

const HAZARD_BG =
  "https://static.prod-images.emergentagent.com/jobs/747abd9c-2a04-4e8d-97e7-67c6e970cdc3/images/8a6e0e28588a6d4a32a829f80e506465aa8ce8eedab9f19c94b543ac5bb6aa75.png";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);

  const handleCta = async (tier) => {
    if (!user) {
      navigate("/welcome");
      return;
    }
    setBusy(tier.id);
    try {
      const { data } = await axios.post(`${API}/payments/checkout`, {
        package_id: tier.id,
        origin_url: window.location.origin,
      });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Couldn't start checkout. Try again.");
      setBusy(null);
    }
  };

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

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> Pricing <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
            One quote you win pays for the year. Start with a 7-day free trial — no credit card. Cancel any time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.id}
              data-testid={`pricing-tier-${t.id}`}
              className={`relative flex flex-col rounded-lg p-8 sm:p-10 border transition-colors group ${
                t.highlight
                  ? "border-yellow-500 border-l-2 border-l-yellow-500 bg-zinc-900 md:scale-[1.02] z-10"
                  : "border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 hover:bg-zinc-900 hover:border-l-yellow-400"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-8 bg-yellow-500 text-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="font-display uppercase text-2xl tracking-tight">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-yellow-500">{t.price}</span>
                  <span className="text-neutral-500 text-sm">{t.period}</span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">{t.sub}</p>
                <p className="mt-5 text-sm text-neutral-400 leading-relaxed">{t.body}</p>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {t.perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-200">{p}</span>
                  </li>
                ))}
              </ul>
              {user ? (
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => handleCta(t)}
                  data-testid={`pricing-cta-${t.id}`}
                  className={`mt-8 inline-flex items-center justify-center h-12 font-semibold uppercase tracking-[0.15em] text-xs ${
                    t.highlight
                      ? "bg-yellow-500 text-black btn-industrial"
                      : "border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {busy === t.id ? "Redirecting..." : t.cta}
                </button>
              ) : (
                <Link
                  to="/welcome"
                  data-testid={`pricing-cta-${t.id}`}
                  className={`mt-8 inline-flex items-center justify-center h-12 font-semibold uppercase tracking-[0.15em] text-xs ${
                    t.highlight
                      ? "bg-yellow-500 text-black btn-industrial"
                      : "border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                  }`}
                >
                  Start 7-Day Free Trial
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          Secure checkout via Stripe • Cancel any time • GST included
        </p>
      </div>
    </section>
  );
}
