import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import SloganMarquee from "@/components/landing/SloganMarquee";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Pricing from "@/components/landing/Pricing";
import DemoVideo from "@/components/landing/DemoVideo";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";
import ChatBot from "@/components/landing/ChatBot";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) return; // logged-in users see landing normally (or could redirect to dashboard)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) navigate("/welcome", { replace: true });
  }, [navigate, user]);

  return (
    <div data-testid="landing-page" className="relative bg-[#0a0a0a] text-[#fafafa]">
      <Header />
      <main>
        <Hero />
        <SloganMarquee />
        <HowItWorks />
        <Features />
        <UseCases />
        <Pricing />
        <DemoVideo />
        <Testimonials />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
