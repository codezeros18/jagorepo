import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyJagaRepoSection } from "@/components/landing/WhyJagaRepoSection";
import { BeforeAfterSection } from "@/components/landing/BeforeAfterSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyJagaRepoSection />
        <BeforeAfterSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
