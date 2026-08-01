import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const helpArticles = [
  { title: 'Getting Started', slug: 'getting-started' },
  { title: 'Uploading Videos', slug: 'uploading-videos' },
  { title: 'AI Clip Generation', slug: 'ai-clip-generation' },
  { title: 'Subtitles', slug: 'subtitles' },
  { title: 'Exporting Clips', slug: 'exporting-clips' },
  { title: 'Account & Billing', slug: 'account-billing' },
];

export default function DashboardHelpCenterPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Dashboard help</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Help Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Explore quick guides and practical tips for getting started, refining clips, and managing your workflow.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {helpArticles.map((article) => (
            <Link key={article.slug} href={`/dashboard/support/help/${article.slug}`} className="block">
              <Card className="h-full transition-colors hover:bg-[var(--surface-hover)]">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    Learn how to use this feature and understand the recommended workflow inside ClipForge.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
