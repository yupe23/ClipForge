import { GetStartedCta } from '@/components/landing/get-started-cta';

type HeroSectionProps = {
  isSignedIn: boolean;
};

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          AI clip workflow
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
          Turn 1 hour into 10 clips.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
          ClipForge finds the best moments, auto-generates subtitles, and reformats each segment into a vertical social-ready video in one workflow.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GetStartedCta isSignedIn={isSignedIn} size="lg">
            Get Started Free
          </GetStartedCta>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Workflow
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">Content pipeline</h2>
            </div>
            <button className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-primary)]">
              Export
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
            <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Recent
                </p>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
                  4
                </span>
              </div>
              <div className="space-y-2">
                {['Creator Q&A', 'Product launch', 'Team briefing', 'Weekly recap'].map((project, index) => (
                  <div
                    key={project}
                    className={`rounded-md border px-2.5 py-2 text-sm ${
                      index === 0
                        ? 'border-[var(--brand)]/40 bg-[var(--brand-soft)] text-[var(--text-primary)]'
                        : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {project}
                  </div>
                ))}
              </div>
            </aside>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Video preview
                </span>
                <span className="rounded-full bg-[var(--brand-soft)] px-2 py-1 text-[10px] font-medium text-[var(--brand)]">
                  AI selected
                </span>
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <div className="flex h-52 items-end justify-between bg-gradient-to-br from-[var(--surface)] via-[var(--background)] to-[var(--surface)] p-4 sm:h-64">
                  <div className="flex items-end gap-2">
                    {['10%', '36%', '64%', '82%', '58%', '92%'].map((height, index) => (
                      <div
                        key={height}
                        className={`w-3 rounded-t-md ${
                          index % 2 === 0 ? 'bg-[var(--accent)]' : 'bg-[var(--brand)]'
                        }`}
                        style={{ height }}
                      />
                    ))}
                  </div>

                  <div className="rounded-md border border-[var(--border)] bg-[var(--background)]/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    00:42
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                <span>Best hook: “12x more reach”</span>
                <span className="font-medium text-[var(--text-primary)]">+24% retention</span>
              </div>
            </div>

            <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                AI clip suggestions
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { title: 'Hook + CTA', time: '00:21', score: '97%' },
                  { title: 'Product demo', time: '00:31', score: '94%' },
                  { title: 'Customer win', time: '00:18', score: '91%' },
                ].map((clip) => (
                  <div key={clip.title} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-2.5">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{clip.time}</span>
                      <span className="font-medium text-[var(--brand)]">{clip.score}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{clip.title}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
