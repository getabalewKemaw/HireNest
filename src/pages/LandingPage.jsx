import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturedJobsSection from '../components/landing/FeaturedJobsSection';
import DeveloperSection from '../components/landing/DeveloperSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import BottomCTASection from '../components/landing/BottomCTASection';
import ContactSection from '../components/landing/ContactSection';

/**
 * Landing Page Component
 * Modularized for better maintainability and performance.
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1C2D] transition-colors duration-500 relative overflow-hidden">
      {/* Premium Global Background Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <HeroSection />

        {/* Modern Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
        </div>

        <div className="bg-gray-50/50 dark:bg-black/10 transition-colors duration-500">
          <FeaturesSection />

          {/* Subtle Inner Divider */}
          <div className="max-w-5xl mx-auto px-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
          </div>

          <HowItWorksSection />
        </div>

        {/* Modern Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
        </div>

        <AboutSection />

        {/* Modern Divider */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        </div>

        <FeaturedJobsSection />

        {/* Developer Section */}




        {/* Original CTA Section */}
        <CTASection />
        <DeveloperSection />

        {/* NEW Contact Section */}
        <ContactSection />

        {/* New Premium Bottom CTA */}
        <BottomCTASection />
        <FAQSection />
      </div>
    </div>
  );
};


export default LandingPage;
