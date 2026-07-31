'use client';

import { GetStartedCta } from '@/components/landing/get-started-cta';
import { Button } from '@/components/ui/button';
import { useId, useState } from 'react';

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

type PricingSectionProps = {
  isSignedIn: boolean;
};

export function PricingSection({ isSignedIn }: PricingSectionProps) {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

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
          {plans.map((plan) => {
            const isFreePlan = plan.price === '$0';

            return (
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

                {isFreePlan ? (
                  <GetStartedCta isSignedIn={isSignedIn} className="mt-8 w-full" size="lg">
                    Get Started
                  </GetStartedCta>
                ) : (
                  <Button type="button" className="mt-8 w-full" size="lg" onClick={() => setIsNoticeOpen(true)}>
                    Get Started
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {isNoticeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl transition-all"
          >
            <h3 id={titleId} className="text-xl font-semibold text-[var(--text-primary)]">
              Subscriptions unavailable
            </h3>
            <p id={descriptionId} className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Subscriptions are coming soon. This feature is currently under development.
            </p>
            <Button type="button" className="mt-6 w-full" onClick={() => setIsNoticeOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
