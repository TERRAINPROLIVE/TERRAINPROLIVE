import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SloganMarquee from "@/components/landing/SloganMarquee";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";
import ChatBot from "@/components/landing/ChatBot";
import Estimator from "@/components/landing/Estimator";

export default function Landing() {
  const [estimatorOpen, setEstimatorOpen] = useState(false);

  // Lock body scroll only while overlay is open
  useEffect(() => {
    if (estimatorOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [estimatorOpen]);

  // Esc closes overlay
  useEffect(() => {
    if (!estimatorOpen) return;
    const onKey = (e) => e.key === "Escape" && setEstimatorOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [estimatorOpen]);

  return (
    <div
      data-testid="landing-page"
      className="relative bg-[#0a0a0a] text-[#fafafa]"
    >
      <Header />
      <main>
        <Hero onTryEstimator={() => setEstimatorOpen(true)} />
        <SloganMarquee />
        <HowItWorks />
        <Features />
        <UseCases />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
      <ChatBot />

      <AnimatePresence>
        {estimatorOpen && (
          <motion.div
            key="estimator-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-testid="estimator-overlay"
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 lg:px-8 h-16 sm:h-20 bg-black border-b border-neutral-800">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                AI Quote Estimator
              </span>
              <button
                type="button"
                onClick={() => setEstimatorOpen(false)}
                data-testid="estimator-overlay-close"
                aria-label="Close estimator"
                className="inline-flex items-center gap-2 h-10 px-3 border border-neutral-800 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors"
              >
                Close
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
            <Estimator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
