import Link from 'next/link';

const supportCards = [
  {
    title: 'Help Center',
    description: 'Browse quick tips, workflow guidance, and common answers for getting the most from ClipForge.',
    href: '/dashboard/support/help',
    cta: 'Open Help Center',
  },
  {
    title: 'Contact Support',
    description: 'Need help with setup, billing, or account questions? Our support team can review your request.',
    href: '/dashboard/support/contact',
    cta: 'Contact Support',
  },
  {
    title: 'Support ClipForge',
    description: 'ClipForge is currently free to use, and support helps fund future improvements and new features.',
    href: '/dashboard/support/donate',
    cta: 'Support ClipForge',
  },
];

export default function DashboardSupportPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Dashboard support</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Support Center
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {supportCards.map((card) => (
            <section
              key={card.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{card.description}</p>
              <Link
                href={card.href}
                className="mt-6 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
              >
                {card.cta}
              </Link>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
