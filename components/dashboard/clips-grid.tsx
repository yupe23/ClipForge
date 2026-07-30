import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ClipQuality = '480p' | '720p' | '1080p' | 'best';

type ClipListItem = {
  id: string;
  sourceType?: 'youtube' | 'upload';
  sourceUrl?: string;
  sourceId?: string;
  start: number;
  end: number;
  status?: 'ready' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  downloadUrl?: string;
  error?: string;
};

type ClipsGridProps = {
  clips?: ClipListItem[];
  onDeleteClip?: (clipId: string) => void;
  onExportClip?: (clip: ClipListItem, quality: ClipQuality, addSubtitles: boolean) => void;
  highlightedClipId?: string | null;
};

const formatTime = (value: number) => {
  const safeValue = Math.max(0, Math.floor(value));
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safeValue % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export function ClipsGrid({ clips = [], onDeleteClip, onExportClip, highlightedClipId }: ClipsGridProps) {
  const [selectedQualities, setSelectedQualities] = React.useState<Record<string, ClipQuality>>({});
  const [subtitleSelections, setSubtitleSelections] = React.useState<Record<string, boolean>>({});
  const [deleteClipId, setDeleteClipId] = React.useState<string | null>(null);
  const [isDeletingClip, setIsDeletingClip] = React.useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated clips</h2>
        <span className="text-sm text-slate-400">{clips.length} item{clips.length === 1 ? '' : 's'}</span>
      </div>

      {clips.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-8 text-sm text-[var(--text-secondary)]">
          No clips added yet. Create a selection from the video preview to populate this list.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clips.map((clip) => {
            const clipStatus = clip.status ?? 'ready';
            const selectedQuality = selectedQualities[clip.id] ?? '720p';
            const addSubtitles = subtitleSelections[clip.id] ?? false;

            return (
              <Card
                key={clip.id}
                className={
                  clip.id === highlightedClipId
                    ? 'animate-in fade-in zoom-in-95 duration-1000'
                    : undefined
                }
              >
                <CardContent className="space-y-3 pt-6">
                  <div className="rounded-lg bg-slate-900 p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-100">
                          {formatTime(clip.start)} - {formatTime(clip.end)}
                        </div>
                        <div className="mt-1 text-slate-400">Duration: {formatTime(clip.end - clip.start)}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteClipId(clip.id)}
                        disabled={isDeletingClip}
                        aria-label="Delete video"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    {clipStatus === 'processing' ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-900/40 px-3 py-1 text-xs font-medium text-amber-200">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-300/40 border-t-amber-200" />
                        Processing
                      </span>
                    ) : clipStatus === 'completed' ? (
                      <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-200">
                        Completed
                      </span>
                    ) : clipStatus === 'failed' ? (
                      <span className="rounded-full bg-red-900/40 px-3 py-1 text-xs font-medium text-red-200">
                        Failed
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                        Ready
                      </span>
                    )}
                  </div>

                  {clipStatus === 'failed' && clip.error ? (
                    <p className="rounded-md border border-red-800/60 bg-red-950/40 px-3 py-2 text-xs text-red-200">
                      {clip.error}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor={`clip-quality-${clip.id}`}>
                      Quality
                    </label>
                    <select
                      id={`clip-quality-${clip.id}`}
                      value={selectedQuality}
                      onChange={(event) => {
                        const nextQuality = event.target.value as ClipQuality;
                        setSelectedQualities((current) => ({ ...current, [clip.id]: nextQuality }));
                      }}
                      className="min-w-[180px] rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-slate-200 outline-none"
                      disabled={clipStatus === 'processing'}
                    >
                      <option value="480p">480p (Fast)</option>
                      <option value="720p">720p (Balanced)</option>
                      <option value="1080p">1080p (High Quality)</option>
                      <option value="best">Best Available</option>
                    </select>

                    {clipStatus === 'completed' && clip.downloadUrl ? (
                      <a
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--accent-hover)]"
                        href={clip.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    ) : (
                      <Button
                        type="button"
                        variant={clipStatus === 'failed' ? 'outline' : 'default'}
                        onClick={() => onExportClip?.(clip, selectedQuality, addSubtitles)}
                        disabled={clipStatus === 'processing'}
                      >
                        {clipStatus === 'processing' ? 'Processing…' : clipStatus === 'failed' ? 'Retry export' : 'Export'}
                      </Button>
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={addSubtitles}
                      onChange={(event) => {
                        const nextChecked = event.target.checked;

                        setSubtitleSelections((current) => ({ ...current, [clip.id]: nextChecked }));
                      }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-[var(--accent)] accent-[var(--accent)] outline-none"
                      disabled={clipStatus === 'processing'}
                    />
                    <span>Add subtitles</span>
                  </label>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {deleteClipId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Delete video?</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                This removes only this video and its generated clip data.
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteClipId(null)}
                disabled={isDeletingClip}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeletingClip(true);
                  setSelectedQualities((current) => {
                    const next = { ...current };
                    delete next[deleteClipId];
                    return next;
                  });
                  setSubtitleSelections((current) => {
                    const next = { ...current };
                    delete next[deleteClipId];
                    return next;
                  });
                  onDeleteClip?.(deleteClipId);
                  setDeleteClipId(null);
                  setIsDeletingClip(false);
                }}
                disabled={isDeletingClip}
              >
                Delete video
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
