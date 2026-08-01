export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Privacy</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            Privacy Policy
          </h1>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Overview</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              ClipForge is committed to protecting your privacy. This policy explains what information we collect,
              how we use it, and the choices you have when using our platform.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Information we collect</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              We may collect account information such as your name, email address, and authentication details, as
              well as project data, uploaded media metadata, generated clips, and usage information needed to improve
              the service.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">How we use information</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Your information helps us provide account access, personalize workflows, support project history,
              improve model quality, maintain security, and respond to support requests.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Cookies and analytics</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              We may use cookies and similar technologies to remember your preferences, maintain session state, and
              understand how visitors engage with our product. Analytics help us improve performance and reliability.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your choices</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              You may update account settings, manage your personal information, or request deletion of certain data
              where applicable. We will process requests in accordance with our service commitments and applicable law.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
