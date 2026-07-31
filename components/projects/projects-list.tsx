'use client';

import * as React from 'react';
import { AlertCircle, ArrowRight, FolderOpen, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/lib/projects';
import type { ProjectStatus } from '@/lib/supabase/types';

const statusClasses: Record<ProjectStatus, string> = {
  draft: 'bg-[var(--surface-hover)] text-[var(--text-primary)]',
  ready: 'bg-[var(--brand-soft)] text-[var(--brand)]',
  processing: 'bg-amber-900/40 text-amber-200',
  completed: 'bg-[var(--success)]/10 text-[var(--success)]',
  failed: 'bg-red-900/40 text-red-200',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export function ProjectsList() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        cache: 'no-store',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Unable to load projects.');
      }

      const payload = (await response.json()) as { projects: Project[] };
      setProjects(payload.projects);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" aria-hidden="true" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading projects...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-900/60 bg-red-950/25">
        <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
          <AlertCircle className="h-9 w-9 text-red-200" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">Projects could not load</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-red-100/80">{error}</p>
          <Button type="button" onClick={() => void loadProjects()} className="mt-6">
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-[var(--brand)]">
            <FolderOpen className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-[var(--text-primary)]">No projects yet</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
            Start a video workflow from the dashboard and it will appear here.
          </p>
          <Link
            href={'/dashboard' as Route}
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New workflow
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4" aria-label="Saved projects">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>
        <Link
          href={'/dashboard' as Route}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New workflow
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-[var(--text-primary)]">{project.title}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Updated {formatDate(project.updated_at)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
                <span className="text-[var(--text-secondary)]">Created {formatDate(project.created_at)}</span>
                <span className="inline-flex items-center gap-1 text-[var(--brand)]">
                  Saved
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
