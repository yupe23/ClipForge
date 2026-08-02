import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type ContactSupportPayload = {
  name?: string;
  email: string;
  subject?: string;
  message: string;
};

export async function submitContactSupportRequest(
  payload: ContactSupportPayload,
): Promise<{ success: boolean }> {
  void payload;

  return { success: true };
}

export async function handleContactSupportSubmit(
  payload: ContactSupportPayload,
): Promise<{ success: boolean }> {
  return submitContactSupportRequest(payload);
}

export default function DashboardContactSupportPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Contact support</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Need a hand?
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-6 text-[var(--text-secondary)]">
          <p>
            For account questions, setup issues, billing concerns, or workflow help, our team can review your request and get back to you soon.
          </p>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="font-medium text-[var(--text-primary)]">Response time</p>
            <p className="mt-1">Typically within 1–2 business days.</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="font-medium text-[var(--text-primary)]">Best for</p>
            <p className="mt-1">Access problems, export questions, account updates, and troubleshooting.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:support@clipforge.app"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Email support
          </a>
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
