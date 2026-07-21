import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  WorkflowSection,
  TechStackSection,
  TestimonialsSection,
  CTASection,
  Footer
} from '../components/landing';
export default function Landing() {
  return (
    <main className="min-h-screen bg-[#070A13] text-[#F8FAFC] antialiased selection:bg-[#3B82F6]/30">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <WorkflowSection />
      <TechStackSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
