import { Link, useNavigate } from "react-router-dom";
import { Mountain, LogOut, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children, label = "Business Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const trialActive = user?.trial_active;
  const days = user?.days_remaining ?? 0;

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
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0" data-testid="shell-logo">
            <div className="w-9 h-9 bg-yellow-500 grid place-items-center shrink-0">
              <Mountain className="w-5 h-5 text-black" strokeWidth={2.4} />
            </div>
            <span className="font-display uppercase text-xl font-black tracking-wide leading-none">
              <span className="text-white">Terrain</span>
              <span className="text-yellow-500">PRO</span>
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
            trialActive ? "border-yellow-500/30 bg-yellow-500/[0.05]" : "border-red-500/40 bg-red-500/[0.06]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-2 flex items-center gap-3 font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            <span className={`w-1.5 h-1.5 ${trialActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {trialActive ? (
              <span className="text-yellow-500">
                Trial Active // {days} {days === 1 ? "Day" : "Days"} Remaining
              </span>
            ) : (
              <span className="text-red-400">Trial Expired</span>
            )}
          </div>
        </div>
      </header>

      {trialActive ? (
        <div className="relative z-10">{children}</div>
      ) : (
        <main className="relative z-10 max-w-2xl mx-auto px-5 py-24 text-center" data-testid="trial-expired">
          <div className="inline-grid place-items-center w-14 h-14 bg-zinc-900 border border-zinc-800 mb-6">
            <Lock className="w-6 h-6 text-yellow-500" />
          </div>
          <h1 className="font-display uppercase text-4xl tracking-tight">
            Your trial has <span className="text-yellow-500">expired.</span>
          </h1>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Your 7-day free access has ended. Upgrade to keep generating unlimited
            line-itemed AI quotes for your crew.
          </p>
          <a
            href="/#pricing"
            data-testid="expired-upgrade-cta"
            className="mt-8 inline-flex items-center justify-center gap-2 h-12 px-8 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-sm btn-industrial"
          >
            View Plans <ArrowRight className="w-4 h-4" />
          </a>
        </main>
      )}
    </div>
  );
}
