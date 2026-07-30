import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { AuthenticatedUserMenu } from '@/components/authenticated-user-menu';
import { ProjectsList } from '@/components/projects/projects-list';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#05070B] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sky-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">CLIPFORGE</span>
          </Link>
          <nav className="flex items-center gap-3" aria-label="Projects navigation">
            <Link
              href={'/dashboard' as Route}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              Dashboard
            </Link>
            <AuthenticatedUserMenu />
          </nav>
        </header>

        <section className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Projects</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Review your saved clip workflows and track their latest processing status.
          </p>
        </section>

        <ProjectsList />
      </div>
    </main>
  );
}
