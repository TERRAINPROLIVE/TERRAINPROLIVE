import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import LogoMarquee from "@/components/landing/LogoMarquee";
import SloganMarquee from "@/components/landing/SloganMarquee";
import Estimator from "@/components/landing/Estimator";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div data-testid="landing-page" className="bg-[#0a0a0a] text-[#fafafa]">
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Estimator />
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
    </div>
  );
}
