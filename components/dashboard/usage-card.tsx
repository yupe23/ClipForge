import { Clapperboard, Gauge, WandSparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UsageCard() {
  return (
    <Card className="overflow-hidden border-[var(--border)] bg-slate-900/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
            <Clapperboard className="h-4 w-4" aria-hidden="true" />
          </span>
          ClipForge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
            <WandSparkles className="h-4 w-4 text-amber-200" aria-hidden="true" />
            Short-form video workspace
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Trim source videos, review AI-assisted moments, and export polished clips from one focused dashboard.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Gauge className="h-4 w-4 text-cyan-200" aria-hidden="true" />
            Workflow
          </div>
          <div className="mt-1 text-sm font-medium text-slate-100">Upload · Trim · Export</div>
        </div>
      </CardContent>
    </Card>
  );
}
