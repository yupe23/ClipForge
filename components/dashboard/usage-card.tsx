import { Clapperboard, Gauge, WandSparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UsageCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
            <Clapperboard className="h-4 w-4" aria-hidden="true" />
          </span>
          ClipForge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <WandSparkles className="h-4 w-4 text-amber-200" aria-hidden="true" />
            Short-form video workspace
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Trim source videos, review AI-assisted moments, and export polished clips from one focused dashboard.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Gauge className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
            Workflow
          </div>
          <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">Upload · Trim · Export</div>
        </div>
      </CardContent>
    </Card>
  );
}
