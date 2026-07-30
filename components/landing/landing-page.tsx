import { HeroSection } from '@/components/landing/hero-section';
import { SiteHeader } from '@/components/landing/site-header';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader />
      <HeroSection />
    </div>
  );
}
