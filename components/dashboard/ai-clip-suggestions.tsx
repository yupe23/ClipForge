'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { getJobStatus, suggestClips } from '@/lib/worker-api';

type CurrentVideo = {
  videoUrl: string;
  sourceType: 'youtube' | 'upload';
  sourceUrl?: string;
  sourceId?: string;
};

type SuggestionCard = {
  id: string;
  start_seconds: number;
  end_seconds: number;
  reason: string;
};

type AiClipSuggestionsProps = {
  currentVideo: CurrentVideo | null;
  onAddSuggestion: (suggestion: { start: number; end: number }) => string | void;
};

const formatTime = (value: number) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safeValue % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export function AiClipSuggestions({ currentVideo, onAddSuggestion }: AiClipSuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<SuggestionCard[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [disabledSuggestionIds, setDisabledSuggestionIds] = React.useState<Record<string, boolean>>({});
  const pollingTimerRef = React.useRef<number | null>(null);
  const autoScrollTimerRef = React.useRef<number | null>(null);
  const autoScrollCancelledRef = React.useRef(false);
  const disabledTimerRef = React.useRef<Record<string, number>>({});

  const clearPolling = React.useCallback(() => {
    if (pollingTimerRef.current) {
      window.clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);

  const cancelAutoScroll = React.useCallback(() => {
    autoScrollCancelledRef.current = true;
    if (autoScrollTimerRef.current) {
      window.clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  const scheduleScrollToClipsSection = React.useCallback(() => {
    cancelAutoScroll();
    autoScrollCancelledRef.current = false;

    const handleUserActivity = () => {
      cancelAutoScroll();
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('wheel', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };

    window.addEventListener('pointerdown', handleUserActivity, { once: true });
    window.addEventListener('wheel', handleUserActivity, { once: true });
    window.addEventListener('keydown', handleUserActivity, { once: true });
    window.addEventListener('touchstart', handleUserActivity, { once: true });

    autoScrollTimerRef.current = window.setTimeout(() => {
      autoScrollTimerRef.current = null;

      if (autoScrollCancelledRef.current) {
        return;
      }

      document.getElementById('clips-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  }, [cancelAutoScroll]);

  const disableSuggestionButton = React.useCallback((suggestionId: string) => {
    if (disabledTimerRef.current[suggestionId]) {
      window.clearTimeout(disabledTimerRef.current[suggestionId]);
    }

    setDisabledSuggestionIds((current) => ({ ...current, [suggestionId]: true }));
    disabledTimerRef.current[suggestionId] = window.setTimeout(() => {
      setDisabledSuggestionIds((current) => {
        const next = { ...current };
        delete next[suggestionId];
        return next;
      });

      delete disabledTimerRef.current[suggestionId];
    }, 1000);
  }, []);

  React.useEffect(() => {
    return () => {
      clearPolling();
      if (autoScrollTimerRef.current) {
        window.clearTimeout(autoScrollTimerRef.current);
      }
      Object.values(disabledTimerRef.current).forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [clearPolling]);

  const startPolling = React.useCallback(
    (jobId: string) => {
      clearPolling();

      pollingTimerRef.current = window.setInterval(async () => {
        try {
          const jobStatus = await getJobStatus(jobId);

          if (jobStatus.status === 'completed') {
            clearPolling();
            setSuggestions(
              (jobStatus.suggestions ?? []).map((suggestion, index) => ({
                ...suggestion,
                id: `${suggestion.start_seconds}-${suggestion.end_seconds}-${index}`,
              })),
            );
            setStatus(jobStatus.status);
            setIsAnalyzing(false);
            setError(null);
            return;
          }

          if (jobStatus.status === 'failed') {
            clearPolling();
            setStatus(jobStatus.status);
            setIsAnalyzing(false);
            setError('The AI suggestion run failed. Please try again.');
            return;
          }

          setStatus(jobStatus.status);
        } catch (jobError) {
          clearPolling();
          setStatus('failed');
          setIsAnalyzing(false);
          setError(jobError instanceof Error ? jobError.message : 'Unable to fetch AI suggestions.');
        }
      }, 3000);
    },
    [clearPolling],
  );

  const handleSuggestClips = React.useCallback(async () => {
    if (!currentVideo) {
      return;
    }

    clearPolling();
    setIsAnalyzing(true);
    setError(null);
    setSuggestions([]);
    setStatus('processing');

    try {
      const payload =
        currentVideo.sourceType === 'youtube'
          ? {
              source_url: currentVideo.sourceUrl ?? currentVideo.videoUrl,
            }
          : {
              source_id: currentVideo.sourceId,
            };

      const result = await suggestClips(payload);
      setStatus(result.status);
      startPolling(result.job_id);
    } catch (suggestionError) {
      clearPolling();
      setIsAnalyzing(false);
      setStatus('failed');
      setError(suggestionError instanceof Error ? suggestionError.message : 'Unable to request AI clip suggestions.');
    }
  }, [clearPolling, currentVideo, startPolling]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Suggest Clips with AI</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Let the worker analyze the current source and propose the most compelling moments to add to your clip list.
          </p>
        </div>

        <Button type="button" onClick={handleSuggestClips} disabled={isAnalyzing || !currentVideo}>
          {isAnalyzing ? 'Analyzing…' : 'Suggest Clips with AI'}
        </Button>
      </div>

      {isAnalyzing ? (
        <div className="mt-4 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4 text-sm text-[var(--text-primary)]">
          <div className="flex items-center gap-3">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--accent)]/40 border-t-[var(--accent)]" />
            Analyzing video for the best moments...
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-red-800/60 bg-red-950/40 p-4 text-sm text-red-200" role="alert">
          <div className="font-medium">Suggestion request failed</div>
          <p className="mt-1">{error}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleSuggestClips}>
            Retry
          </Button>
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-4 space-y-3">
          {suggestions.map((suggestion) => (
            <div key={`${suggestion.start_seconds}-${suggestion.end_seconds}`} className="rounded-lg border border-[var(--border)] bg-[#11141A] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {formatTime(suggestion.start_seconds)} - {formatTime(suggestion.end_seconds)}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{suggestion.reason}</p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabledSuggestionIds[suggestion.id]}
                  onClick={() => {
                    if (disabledSuggestionIds[suggestion.id]) {
                      return;
                    }

                    disableSuggestionButton(suggestion.id);
                    onAddSuggestion({ start: suggestion.start_seconds, end: suggestion.end_seconds });
                    scheduleScrollToClipsSection();
                  }}
                >
                  Add to clips
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isAnalyzing && !error && status === 'completed' && suggestions.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] bg-[#11141A] p-4 text-sm text-[var(--text-secondary)]">
          No suggestions were returned for this video yet.
        </div>
      ) : null}
    </div>
  );
}
