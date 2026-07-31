import { HeroSection } from '@/components/landing/hero-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { SiteHeader } from '@/components/landing/site-header';

const features = [
  {
    title: 'Find the moments that matter',
    description:
      'AI scoring surfaces high-retention hooks, crisp soundbites, and natural cut points so every edit starts with the strongest material.',
  },
  {
    title: 'Caption and format once',
    description:
      'Generate clean subtitles, resize for vertical feeds, and keep each clip ready for TikTok, Reels, and Shorts without leaving the workflow.',
  },
  {
    title: 'Ship a full content batch',
    description:
      'Review suggested clips, trim manually when needed, and export a consistent set of social-ready videos from one long recording.',
  },
];

type LandingPageProps = {
  isSignedIn: boolean;
};

export function LandingPage({ isSignedIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <SiteHeader isSignedIn={isSignedIn} />
      <main>
        <HeroSection isSignedIn={isSignedIn} />
        <FeaturesSection />
        <PricingSection isSignedIn={isSignedIn} />
      </main>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
            Everything needed to turn source video into polished clips.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            ClipForge keeps discovery, trimming, captions, and export decisions in one focused workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="mb-5 h-1.5 w-12 rounded-full bg-[var(--accent)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
