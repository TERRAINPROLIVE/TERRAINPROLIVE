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
    <div data-testid="app-shell" className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
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
                [ System Status: Trial Active // {days} {days === 1 ? "Day" : "Days"} Remaining ]
              </span>
            ) : (
              <span className="text-red-400">[ System Status: Trial Expired ]</span>
            )}
          </div>
        </div>
      </header>

      {trialActive ? (
        children
      ) : (
        <main className="max-w-2xl mx-auto px-5 py-24 text-center" data-testid="trial-expired">
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
