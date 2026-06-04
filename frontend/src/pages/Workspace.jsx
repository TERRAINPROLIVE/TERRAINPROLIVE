import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import EstimatorWizard from "@/components/landing/EstimatorWizard";

export default function Workspace() {
  return (
    <AppShell>
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-10" data-testid="workspace-page">
        <Link
          to="/dashboard"
          data-testid="quote-back-dashboard"
          className="inline-flex items-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

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
    </AppShell>
  );
}
