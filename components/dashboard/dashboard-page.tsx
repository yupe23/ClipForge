import { ClipsGrid } from '@/components/dashboard/clips-grid';
import { UploadForm } from '@/components/dashboard/upload-form';
import { UsageCard } from '@/components/dashboard/usage-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-500">VidRepurpose</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Turn long-form videos into viral-ready clips</h1>
          <p className="max-w-2xl text-slate-400">
            Paste a YouTube URL or upload a video file to start generating vertical, subtitle-rich short clips.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create a new repurposing job</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadForm />
            </CardContent>
          </Card>

          <UsageCard />
        </section>

        <ClipsGrid />
      </div>
    </main>
  );
}
