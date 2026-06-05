import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { LogOut, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PLANS = [
  { id: "sole_quoter", name: "Sole Quoter", price: "$39", sub: "Per month • Single user" },
  { id: "crew", name: "Crew", price: "$69", sub: "Per month • 1–3 users", recommended: true },
];

export default function AppShell({ children, label = "Business Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const signOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const startCheckout = async (planId) => {
    setCheckoutPlan(planId);
    try {
      const { data } = await axios.post(`${API}/payments/checkout`, {
        package_id: planId,
        origin_url: window.location.origin,
      });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Couldn't start checkout. Try again.");
      setCheckoutPlan(null);
    }
  };

  const trialActive = user?.trial_active;
  const subscriptionActive = user?.subscription_active;
  const accessActive = user?.access_active ?? (trialActive || subscriptionActive);
  const days = user?.days_remaining ?? 0;
  const subDays = user?.subscription_days_remaining ?? 0;
  const planName = user?.subscription_plan_name || (user?.subscription_plan === "crew" ? "Crew" : user?.subscription_plan === "sole_quoter" ? "Sole Quoter" : "");

  return (
    <div data-testid="app-shell" className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden">
      {/* Industrial concrete watermark background (webapp only) */}
      <div data-testid="app-bg-texture" aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* charcoal concrete base + cinematic moody lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,#161616_0%,#0c0c0c_45%,#070707_100%)]" />
        {/* subtle architectural vertical lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 160px)",
          }}
        />
        {/* fine grain / concrete noise */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Left margin vertical watermark */}
        <span className="hidden lg:block absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap font-display font-black uppercase text-white/[0.03] text-6xl xl:text-7xl tracking-[0.5em] select-none">
          Your Project,
        </span>
        {/* Right margin vertical watermark */}
        <span className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 rotate-90 origin-center whitespace-nowrap font-display font-black uppercase text-white/[0.03] text-6xl xl:text-7xl tracking-[0.5em] select-none">
          Our Terrain.
        </span>
      </div>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black border-b border-neutral-800">
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0" data-testid="shell-logo">
            <img
              src="/terrainpro-logo-full.png"
              alt="TerrainPRO"
              data-testid="shell-logo-img"
              className="h-12 w-auto object-contain shrink-0 select-none"
              draggable={false}
            />
            <span className="hidden sm:inline-block font-mono text-[10px] text-yellow-500 uppercase tracking-[0.25em] border-l border-yellow-500/30 pl-3 leading-none">
              AI Estimator
            </span>
          </Link>

          {/* Centered section label */}
          <span
            data-testid="shell-center-label"
            className="hidden md:block absolute left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.32em] text-yellow-500 whitespace-nowrap pointer-events-none"
          >
            TERRAIN PRO // {label}
          </span>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden lg:block font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 max-w-[160px] truncate">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={signOut}
              data-testid="shell-signout"
              className="inline-flex items-center gap-2 h-9 px-3.5 border border-neutral-800 text-neutral-300 hover:border-yellow-500 hover:text-yellow-500 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* System status / trial banner */}
        <div
          data-testid="trial-banner"
          className={`border-t ${
            subscriptionActive
              ? "border-green-500/30 bg-green-500/[0.05]"
              : trialActive
              ? "border-yellow-500/30 bg-yellow-500/[0.05]"
              : "border-red-500/40 bg-red-500/[0.06]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-2 flex items-center gap-3 font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            <span
              className={`w-1.5 h-1.5 ${
                subscriptionActive ? "bg-green-400 animate-pulse" : trialActive ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            {subscriptionActive ? (
              <span className="text-green-400">
                {planName ? `${planName} Plan` : "Subscription Active"} // {subDays} {subDays === 1 ? "Day" : "Days"} Until Renewal
              </span>
            ) : trialActive ? (
              <span className="text-yellow-500">
                Trial Active // {days} {days === 1 ? "Day" : "Days"} Remaining
              </span>
            ) : (
              <span className="text-red-400">Trial Expired</span>
            )}
          </div>
        </div>
      </header>

      {accessActive ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <main className="relative z-10 max-w-3xl mx-auto px-5 py-20 text-center" data-testid="trial-expired">
          <div className="inline-grid place-items-center w-14 h-14 bg-zinc-900 border border-zinc-800 mb-6">
            <Lock className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="font-display uppercase text-4xl tracking-tight">
            Your trial has <span className="text-yellow-500">expired.</span>
          </h1>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Your 7-day free access has ended. Pick a plan to keep generating
            unlimited line-itemed AI quotes for your crew.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {PLANS.map((p) => (
              <div
                key={p.id}
                data-testid={`upgrade-card-${p.id}`}
                className={`relative flex flex-col rounded-lg p-6 border bg-zinc-950 ${
                  p.recommended
                    ? "border-yellow-500 border-l-2 border-l-yellow-500"
                    : "border-zinc-800 border-l-2 border-l-yellow-500"
                }`}
              >
                {p.recommended && (
                  <div className="absolute -top-3 left-6 bg-yellow-500 text-black px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] font-bold">
                    Recommended
                  </div>
                )}
                <h2 className="font-display uppercase text-2xl tracking-tight">{p.name}</h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-yellow-500">{p.price}</span>
                  <span className="text-neutral-500 text-xs">/ month</span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{p.sub}</p>
                <ul className="mt-5 space-y-2 text-sm text-neutral-300 flex-1">
                  <li>✓ Unlimited AI quotes</li>
                  <li>✓ Branded PDF export</li>
                  <li>✓ Quote save + edit + status</li>
                  {p.id === "crew" && <li>✓ Up to 3 user seats</li>}
                </ul>
                <button
                  type="button"
                  disabled={!!checkoutPlan}
                  onClick={() => startCheckout(p.id)}
                  data-testid={`upgrade-cta-${p.id}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 h-12 px-6 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-xs btn-industrial disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutPlan === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Upgrade <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
            Secure checkout via Stripe • Cancel any time
          </p>
        </main>
      )}
    </div>
  );
}
