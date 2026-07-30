import { Button } from '@/components/ui/button';

export function HeroSection() {
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
          <Button size="lg">Get Started Free</Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
        <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-secondary)] sm:min-h-[420px]">
          Product preview placeholder
        </div>
      </div>
    </section>
  );
}
