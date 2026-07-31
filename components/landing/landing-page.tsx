import { GetStartedCta } from '@/components/landing/get-started-cta';
import { HeroSection } from '@/components/landing/hero-section';
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

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Start repurposing a few videos and validate your short-form workflow.',
    features: ['AI clip suggestions', 'Manual trimming', 'Social-ready previews'],
  },
  {
    name: 'Creator',
    price: '$19',
    description: 'For creators publishing consistent clips across multiple channels.',
    features: ['Longer uploads', 'Caption workflow', 'Priority processing'],
    highlighted: true,
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

function PricingSection({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-[var(--border)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
              Start free, then scale when clips become part of the schedule.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Simple plans for testing the workflow now and expanding output as your publishing rhythm grows.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-[var(--accent)] bg-[var(--surface)]'
                  : 'border-[var(--border)] bg-[var(--background)]'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{plan.description}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-3xl font-semibold text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-secondary)]">/mo</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <GetStartedCta isSignedIn={isSignedIn} className="mt-8 w-full" size="lg">
                Get Started
              </GetStartedCta>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
