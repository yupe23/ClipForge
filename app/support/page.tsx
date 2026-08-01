const faqs = [
  {
    question: 'How do I get started with ClipForge?',
    answer:
      'Create an account, sign in, and start by uploading a source video. The app will guide you through the workflow from discovery to export.',
  },
  {
    question: 'Can I edit generated clips after upload?',
    answer:
      'Yes. You can review the AI-suggested clips, trim manually, and refine the final output before exporting your social-ready versions.',
  },
  {
    question: 'What file types are supported?',
    answer:
      'The platform is designed for standard video source files used in short-form content workflows. If a file is unsupported, the upload step will surface the issue before processing starts.',
  },
  {
    question: 'How long does processing take?',
    answer:
      'Timing depends on video length and current queue load. Most short-form projects are processed within a few minutes, but longer uploads may take longer.',
  },
  {
    question: 'Do I need to create an account to use the app?',
    answer:
      'Yes. An account is required so your projects, exports, and workflow history can be saved and managed from your dashboard.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Support center</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            We’re here to help.
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--border)] bg-[var(--background)]" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Help Center</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Learn the basics of ClipForge, explore common workflows, and find quick answers to frequent questions.
            </p>
            <a
              href="#faq"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Browse Help Articles
            </a>

            <div id="faq" className="mt-8 space-y-4">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <h3 className="text-base font-medium text-[var(--text-primary)]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--border)] bg-[var(--background)]" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Contact Support</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              Need help with setup, billing, or account access? Reach out to the support team and we’ll review your message.
            </p>
            <p className="mt-5 text-base text-[var(--text-primary)]">
              <a href="mailto:support@clipforge.example" className="font-medium text-[var(--brand)] underline-offset-4 hover:underline">
                support@clipforge.example
              </a>
            </p>
            <button className="mt-5 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]">
              Contact Support
            </button>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--border)] bg-[var(--background)]" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Support ClipForge</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
              ClipForge is currently free to use, and your support helps fund future development, improvements, and new features.
            </p>
            <button className="mt-5 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]">
              Support ClipForge
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
