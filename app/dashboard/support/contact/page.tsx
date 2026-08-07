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

  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const messageInputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      setSubmitError('Email is required.');
      emailInputRef.current?.focus();
      return;
    }

    if (!trimmedMessage) {
      setSubmitError('Message is required.');
      messageInputRef.current?.focus();
      return;
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      setSubmitError('Message must be between 10 and 5000 characters.');
      messageInputRef.current?.focus();
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      await handleContactSupportSubmit({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      const nextError = error instanceof Error ? error.message : 'Unable to submit support request.';
      setSubmitError(nextError);
      if (!trimmedEmail || !trimmedMessage) {
        return;
      }
      emailInputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                Email
              </label>
              <input
                id="email"
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={isSubmitting}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[var(--text-primary)]">
              Message
            </label>
            <textarea
              id="message"
              ref={messageInputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              disabled={isSubmitting}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
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
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </span>
              ) : (
                'Send message'
              )}
            </Button>
            <Link href="/dashboard/support" className="inline-flex">
              <Button type="button" variant="secondary" size="lg" disabled={isSubmitting}>
                Back to Support Center
              </Button>
            </Link>
          </div>
        </form>
    </div>
  );
}
