import Link from 'next/link';
import { Button } from '@/components/ui/button';

type HelpArticleProps = {
  title: string;
  description: string;
};

export default function HelpArticle({ title, description }: HelpArticleProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Help article</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{description}</p>

        <div className="mt-8 flex items-center justify-center">
          <Button variant="secondary" size="lg">
            Coming Soon
          </Button>
        </div>

        <div className="mt-8">
          <Link href="/dashboard/support/help" className="inline-flex">
            <Button variant="default" size="lg">
              Back to Help Center
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
