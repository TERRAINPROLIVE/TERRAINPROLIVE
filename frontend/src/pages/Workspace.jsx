import { Link, useNavigate } from "react-router-dom";
import { Mountain, LogOut, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EstimatorWizard from "@/components/landing/EstimatorWizard";

export default function Workspace() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const trialActive = user?.trial_active;
  const days = user?.days_remaining ?? 0;

  return (
    <div data-testid="workspace-page" className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="workspace-logo">
            <div className="w-9 h-9 bg-yellow-500 grid place-items-center shrink-0">
              <Mountain className="w-5 h-5 text-black" strokeWidth={2.4} />
            </div>
            <span className="font-display uppercase text-xl font-black tracking-wide leading-none">
              <span className="text-white">Terrain</span>
              <span className="text-yellow-500">PRO</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={signOut}
              data-testid="workspace-signout"
              className="inline-flex items-center gap-2 h-9 px-3 border border-neutral-800 text-neutral-300 hover:border-yellow-500 hover:text-yellow-500 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* System status / trial banner */}
        <div
          data-testid="trial-banner"
          className={`border-t ${
            trialActive
              ? "border-yellow-500/30 bg-yellow-500/[0.05]"
              : "border-red-500/40 bg-red-500/[0.06]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-2 flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            <span
              className={`w-2 h-2 ${trialActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            />
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

      {/* Body */}
      {trialActive ? (
        <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
          <div className="mb-8">
            <span className="font-display uppercase text-3xl sm:text-4xl tracking-tight text-yellow-500">
              [ AI Quote Estimator ]
            </span>
            <p className="mt-3 text-neutral-400 max-w-xl leading-relaxed">
              Run a real job through the wizard — customer, scope, measurements — and
              TerrainPRO AI returns a tight, line-itemed AUD quote.
            </p>
          </div>
          <EstimatorWizard />
        </main>
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
