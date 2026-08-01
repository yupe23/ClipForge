import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardSupportDonatePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Support ClipForge</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Help fund the product
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[var(--text-secondary)]">
          <p>
            ClipForge is currently free to use, and support helps fund ongoing improvements, infrastructure, and new features.
          </p>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="font-medium text-[var(--text-primary)]">How your support helps</p>
            <p className="mt-1">Faster AI processing, better export quality, more templates, and more reliable system performance.</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="font-medium text-[var(--text-primary)]">Thanks for helping</p>
            <p className="mt-1">Every contribution helps keep the platform accessible and sustainable for everyone.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="default" size="lg" type="button">
            Support the project
          </Button>
          <Link href="/dashboard/support" className="inline-flex">
            <Button variant="secondary" size="lg">
              Back to Support Center
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
