import EstimatorWizard from "./EstimatorWizard";
import SignupGate from "./SignupGate";

export default function Estimator() {
  return (
    <section
      id="estimator"
      data-testid="estimator-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
              [ Live Demo · Powered by GPT-5.2 ]
            </span>
            <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Build a quote.
              <br />
              Right now.
            </h2>
          </div>
          <div className="md:col-span-5 self-end text-neutral-400 leading-relaxed">
            Sign up free, then run a real job through the wizard — customer,
            scope, measurements — and TerrainPRO AI returns a tight, line-itemed
            AUD quote.
          </div>
        </div>

        <SignupGate>
          <EstimatorWizard />
        </SignupGate>
      </div>
    </section>
  );
}
