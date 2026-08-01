export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Legal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            Terms of Service
          </h1>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Acceptance of terms</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              By creating an account or using ClipForge, you agree to these Terms of Service and any applicable
              policies. If you do not agree with these terms, you should not use the service.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Use of the service</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              You are responsible for the content you upload, your account security, and your compliance with
              applicable laws and platform rules. We provide the service for lawful personal and business use.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Content ownership</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              You retain ownership of the content you upload. By using the platform, you grant us the rights necessary
              to process, transform, and deliver the service to you, including generating clips and exported assets.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Service availability</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              We strive to keep the service reliable and available, but uptime, feature availability, and processing
              times may vary depending on system load, maintenance, or third-party service dependencies.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Termination</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              We may suspend or terminate access if a user violates these terms, engages in abusive conduct, or
              otherwise poses a risk to the platform, other users, or the integrity of the service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
