import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { AuthenticatedUserMenu } from '@/components/authenticated-user-menu';
import { ProjectsList } from '@/components/projects/projects-list';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-[var(--brand)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)]">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">CLIPFORGE</span>
          </Link>
          <nav className="flex items-center gap-3" aria-label="Projects navigation">
            <Link
              href={'/dashboard' as Route}
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              Dashboard
            </Link>
            <ThemeToggle />
            <AuthenticatedUserMenu />
          </nav>
        </header>

        <section className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">Projects</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Review your saved clip workflows and track their latest processing status.
          </p>
        </section>

        <ProjectsList />
      </div>
    </main>
  );
}
