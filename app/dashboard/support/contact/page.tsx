'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { handleContactSupportSubmit } from './actions';

export default function DashboardContactSupportPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      await handleContactSupportSubmit({ name, email, subject, message });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit support request.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[var(--text-primary)]">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-[var(--text-primary)]">
              Subject
            </label>
            <input
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[var(--text-primary)]">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              placeholder="Tell us what you need help with..."
              required
            />
          </div>

          {submitError ? (
            <p className="rounded-md border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">
              {submitError}
            </p>
          ) : null}

          {submitSuccess ? (
            <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
              Your message has been sent successfully.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
            <Link href="/dashboard/support" className="inline-flex">
              <Button type="button" variant="secondary" size="lg">
                Back to Support Center
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
