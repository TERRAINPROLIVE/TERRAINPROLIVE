import { Hammer } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-black border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-yellow-500 flex items-center justify-center">
                <Hammer className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl uppercase tracking-tight">
                  TerrainPRO
                </span>
                <span className="font-mono text-[10px] text-yellow-500 uppercase tracking-[0.25em]">
                  AI Estimator
                </span>
              </div>
            </div>
            <p className="mt-5 text-sm text-neutral-400 max-w-sm leading-relaxed">
              Built in Australia for the crews who actually do the work.
              Earthmoving, concreting, landscaping — quoted in seconds.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li>
                <a href="#estimator" className="hover:text-yellow-500">
                  Estimator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-yellow-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-yellow-500">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
              Trades
            </h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li>Earthmoving</li>
              <li>Concreting</li>
              <li>Landscaping</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li>crew@terrainpro.com.au</li>
              <li>1800 QUOTE-IT</li>
              <li className="text-neutral-500">Geelong · Brisbane · Sydney</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
            © {new Date().getFullYear()} TerrainPRO AI · ABN 00 000 000 000
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
            Built with the universal LLM key · GPT-5.2
          </p>
        </div>
      </div>
    </footer>
  );
}
