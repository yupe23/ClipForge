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
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Support</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
            We’re here to help.
          </h1>
        </div>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Contact</h2>
          <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
            For questions, account help, or support requests, email{' '}
            <a href="mailto:support@clipforge.example" className="font-medium text-[var(--brand)] underline-offset-4 hover:underline">
              support@clipforge.example
            </a>
            .
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <h3 className="text-base font-medium text-[var(--text-primary)]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Need more help?</h2>
          <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
            If you need additional help with billing, account access, project setup, or troubleshooting, contact our support team and we’ll get back to you as soon as possible.
          </p>
        </section>
      </div>
    </main>
  );
}
