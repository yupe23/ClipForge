'use client';

import * as React from 'react';
import {
  BadgeDollarSign,
  Captions,
  Clapperboard,
  Download,
  FileCheck2,
  Headphones,
  Scissors,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadForm } from '@/components/dashboard/upload-form';
import { ManualTrim } from '@/components/dashboard/manual-trim';
import { ClipsGrid } from '@/components/dashboard/clips-grid';
import { AiClipSuggestions } from '@/components/dashboard/ai-clip-suggestions';
import { AuthenticatedUserMenu } from '@/components/authenticated-user-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { createProject, updateProjectStatus } from '@/lib/projects';
import type { ProjectStatus } from '@/lib/supabase/types';
import { getJobStatus, processClips } from '@/lib/worker-api';

type MockVideo = {
  videoUrl: string;
  duration: number;
  sourceType: 'youtube' | 'upload';
  sourceUrl?: string;
  sourceId?: string;
};

type ClipQuality = '480p' | '720p' | '1080p' | 'best';

type ClipSelection = {
  id: string;
  videoKey: string;
  sourceType: 'youtube' | 'upload';
  sourceUrl?: string;
  sourceId?: string;
  start: number;
  end: number;
  status: 'ready' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  jobStatus?: string;
  downloadUrl?: string;
  error?: string;
};

const clipForgeFeatures = [
  { label: 'AI Suggestions', icon: Sparkles },
  { label: 'Smart Subtitles', icon: Captions },
  { label: '100% Local Processing', icon: ShieldCheck },
  { label: 'Free Forever', icon: BadgeDollarSign },
];

const getWorkflowProjectStatus = (clips: ClipSelection[], videoKey: string | null): ProjectStatus => {
  if (!videoKey) {
    return 'draft';
  }

  const workflowClips = clips.filter((clip) => clip.videoKey === videoKey);

  if (workflowClips.length === 0) {
    return 'draft';
  }

  if (workflowClips.some((clip) => clip.status === 'processing')) {
    return 'processing';
  }

  if (workflowClips.every((clip) => clip.status === 'completed')) {
    return 'completed';
  }

  if (workflowClips.some((clip) => clip.status === 'failed')) {
    return 'failed';
  }

  return 'ready';
};

export default function DashboardRoutePage() {
  const [currentVideo, setCurrentVideo] = React.useState<MockVideo | null>(null);
  const [currentVideoKey, setCurrentVideoKey] = React.useState<string | null>(null);
  const [clips, setClips] = React.useState<ClipSelection[]>([]);
  const [highlightedClipId, setHighlightedClipId] = React.useState<string | null>(null);
  const [isProjectSaving, setIsProjectSaving] = React.useState(false);
  const [projectPersistenceError, setProjectPersistenceError] = React.useState<string | null>(null);
  const currentProjectIdRef = React.useRef<string | null>(null);
  const pendingProjectStatusRef = React.useRef<ProjectStatus>('draft');
  const lastProjectStatusRef = React.useRef<ProjectStatus | null>(null);
  const workflowKeyRef = React.useRef<string | null>(null);
  const highlightTimerRef = React.useRef<number | null>(null);
  const pollingTimers = React.useRef<Record<string, number>>({});

  const setActiveProjectId = React.useCallback((projectId: string | null) => {
    currentProjectIdRef.current = projectId;
  }, []);

  const persistProjectStatus = React.useCallback((status: ProjectStatus) => {
    pendingProjectStatusRef.current = status;

    if (!currentProjectIdRef.current) {
      return;
    }

    if (lastProjectStatusRef.current === status) {
      return;
    }

    lastProjectStatusRef.current = status;
    setProjectPersistenceError(null);

    void updateProjectStatus(currentProjectIdRef.current, status).catch((error) => {
      lastProjectStatusRef.current = null;
      setProjectPersistenceError(error instanceof Error ? error.message : 'Unable to update project status.');
    });
  }, []);

  const clearPolling = React.useCallback((clipId: string) => {
    const timerId = pollingTimers.current[clipId];

    if (timerId) {
      window.clearInterval(timerId);
      delete pollingTimers.current[clipId];
    }
  }, []);

  React.useEffect(() => {
    return () => {
      Object.values(pollingTimers.current).forEach((timerId) => window.clearInterval(timerId));
      pollingTimers.current = {};
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    persistProjectStatus(getWorkflowProjectStatus(clips, currentVideoKey));
  }, [clips, currentVideoKey, persistProjectStatus]);

  const handleVideoSubmit = (video: { videoUrl: string; duration: number; title?: string }) => {
    const nextVideoKey = `video-${Date.now()}`;

    setCurrentVideoKey(nextVideoKey);
    setActiveProjectId(null);
    pendingProjectStatusRef.current = 'draft';
    lastProjectStatusRef.current = null;
    setIsProjectSaving(true);
    setProjectPersistenceError(null);
    workflowKeyRef.current = nextVideoKey;
    setCurrentVideo((previous) => ({
      videoUrl: video.videoUrl,
      duration: video.duration,
      sourceType: previous?.sourceType ?? 'upload',
      sourceUrl: previous?.sourceUrl,
      sourceId: previous?.sourceId,
    }));

    void createProject(video.title?.trim() || 'Untitled video project')
      .then(async (project) => {
        if (workflowKeyRef.current !== nextVideoKey) {
          return;
        }

        setActiveProjectId(project.id);
        lastProjectStatusRef.current = project.status;

        if (pendingProjectStatusRef.current !== project.status) {
          await updateProjectStatus(project.id, pendingProjectStatusRef.current);
          lastProjectStatusRef.current = pendingProjectStatusRef.current;
        }
      })
      .catch((error) => {
        setProjectPersistenceError(error instanceof Error ? error.message : 'Unable to create project.');
      })
      .finally(() => {
        if (workflowKeyRef.current === nextVideoKey) {
          setIsProjectSaving(false);
        }
      });
  };

  const handleVideoReady = (video: {
    source_type: 'youtube' | 'upload';
    source_url?: string;
    source_id?: string;
    duration?: number;
  }) => {
    setCurrentVideo((previous) =>
      previous
        ? {
            ...previous,
            sourceType: video.source_type,
            sourceUrl: video.source_url,
            sourceId: video.source_id,
          }
        : null,
    );
  };

  const handleClipsChange = React.useCallback(
    (nextClips: Array<{ id: string; start: number; end: number }>) => {
      if (!currentVideo || !currentVideoKey) {
        return;
      }

      setClips((current) => {
        const otherVideoClips = current.filter((clip) => clip.videoKey !== currentVideoKey);
        const nextVideoClips = nextClips.map((clip) => {
          const existingClip = current.find((item) => item.id === clip.id);

          return {
            id: clip.id,
            videoKey: currentVideoKey,
            sourceType: currentVideo.sourceType,
            sourceUrl: currentVideo.sourceUrl ?? currentVideo.videoUrl,
            sourceId: currentVideo.sourceId,
            start: clip.start,
            end: clip.end,
            status: existingClip?.status ?? 'ready',
            jobId: existingClip?.jobId,
            jobStatus: existingClip?.jobStatus,
            downloadUrl: existingClip?.downloadUrl,
            error: existingClip?.error,
          };
        });

        return [...otherVideoClips, ...nextVideoClips];
      });
    },
    [currentVideo, currentVideoKey],
  );

  const handleAddSuggestedClip = React.useCallback(
    (suggestion: { start: number; end: number }) => {
      if (!currentVideo || !currentVideoKey) {
        return;
      }

      const clip: ClipSelection = {
        id: `${suggestion.start}-${suggestion.end}-${Date.now()}`,
        videoKey: currentVideoKey,
        sourceType: currentVideo.sourceType,
        sourceUrl: currentVideo.sourceUrl ?? currentVideo.videoUrl,
        sourceId: currentVideo.sourceId,
        start: suggestion.start,
        end: suggestion.end,
        status: 'ready',
      };

      setClips((current) => [...current, clip]);
      setHighlightedClipId(clip.id);

      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }

      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedClipId(null);
        highlightTimerRef.current = null;
      }, 1500);

      return clip.id;
    },
    [currentVideo, currentVideoKey],
  );

  const startPolling = React.useCallback(
    (clipId: string, jobId: string) => {
      clearPolling(clipId);

      const timerId = window.setInterval(async () => {
        try {
          const jobStatus = await getJobStatus(jobId);

          setClips((current) =>
            current.map((clip) => {
              if (clip.id !== clipId) {
                return clip;
              }

              if (jobStatus.status === 'completed') {
                clearPolling(clipId);

                return {
                  ...clip,
                  status: 'completed',
                  jobStatus: jobStatus.status,
                  downloadUrl: jobStatus.download_urls?.[0],
                  error: undefined,
                };
              }

              if (jobStatus.status === 'failed') {
                clearPolling(clipId);

                return {
                  ...clip,
                  status: 'failed',
                  jobStatus: jobStatus.status,
                  error: 'Export failed. Please try again.',
                };
              }

              return {
                ...clip,
                status: 'processing',
                jobStatus: jobStatus.status,
              };
            }),
          );
        } catch (error) {
          clearPolling(clipId);

          setClips((current) =>
            current.map((clip) =>
              clip.id === clipId
                ? {
                    ...clip,
                    status: 'failed',
                    jobStatus: 'failed',
                    error: error instanceof Error ? error.message : 'Unable to fetch export status.',
                  }
                : clip,
            ),
          );
        }
      }, 3000);

      pollingTimers.current[clipId] = timerId;
    },
    [clearPolling],
  );

  const handleExportClip = React.useCallback(
    async (
      clip: {
        id: string;
        start: number;
        end: number;
        sourceType?: 'youtube' | 'upload';
        sourceUrl?: string;
        sourceId?: string;
      },
      quality: ClipQuality = '720p',
      addSubtitles = false,
    ) => {
      const sourceType = clip.sourceType ?? currentVideo?.sourceType;

      if (!sourceType) {
        return;
      }

      const sourcePayload =
        sourceType === 'youtube'
          ? {
              source_type: 'youtube' as const,
              source_url: clip.sourceUrl ?? currentVideo?.sourceUrl ?? currentVideo?.videoUrl,
            }
          : {
              source_type: 'upload' as const,
              source_id: clip.sourceId ?? currentVideo?.sourceId,
          };

      setClips((current) =>
        current.map((item) =>
          item.id === clip.id
            ? {
                ...item,
                status: 'processing',
                jobStatus: 'processing',
                error: undefined,
                downloadUrl: undefined,
              }
            : item,
        ),
      );

      try {
        const result = await processClips({
          ...sourcePayload,
          quality,
          add_subtitles: addSubtitles,
          clips: [{ start_seconds: clip.start, end_seconds: clip.end }],
        });

        setClips((current) =>
          current.map((item) =>
            item.id === clip.id
              ? {
                  ...item,
                  status: 'processing',
                  jobId: result.job_id,
                  jobStatus: result.status,
                }
              : item,
          ),
        );

        startPolling(clip.id, result.job_id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to export the clip.';

        setClips((current) =>
          current.map((item) =>
            item.id === clip.id
              ? {
                  ...item,
                  status: 'failed',
                  jobStatus: 'failed',
                  error: message,
                }
              : item,
          ),
        );
      }
    },
    [currentVideo, startPolling],
  );

  const handleDeleteClip = React.useCallback(
    (clipId: string) => {
      clearPolling(clipId);

      if (highlightedClipId === clipId) {
        if (highlightTimerRef.current) {
          window.clearTimeout(highlightTimerRef.current);
          highlightTimerRef.current = null;
        }

        setHighlightedClipId(null);
      }

      setClips((current) => current.filter((clip) => clip.id !== clipId));
    },
    [clearPolling, highlightedClipId],
  );

  const readyClipCount = clips.filter((clip) => clip.status === 'ready').length;
  const processingClipCount = clips.filter((clip) => clip.status === 'processing').length;
  const completedClipCount = clips.filter((clip) => clip.status === 'completed').length;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[var(--brand)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)]">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">CLIPFORGE</span>
          </div>

          <nav className="flex items-center gap-2" aria-label="Dashboard navigation">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Support"
              className="gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Support</span>
            </Button>
            <ThemeToggle />
            <AuthenticatedUserMenu />
          </nav>
        </header>

        <section className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">Dashboard</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Upload a source video, define manual clip ranges, and review your selected exports in one place.
          </p>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" aria-label="ClipForge workflow">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                    1
                  </span>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UploadCloud className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                      Upload source
                    </CardTitle>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Add the long-form source from YouTube or upload a local video file.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UploadForm onVideoSubmit={handleVideoSubmit} onVideoReady={handleVideoReady} />
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                    2
                  </span>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Scissors className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                      Define clips
                    </CardTitle>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Trim precise ranges manually, then use AI suggestions to add promising moments to the same clip list.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentVideo ? (
                  <>
                    <ManualTrim
                      videoUrl={currentVideo.videoUrl}
                      duration={currentVideo.duration}
                      sourceType={currentVideo.sourceType}
                      onClipsChange={handleClipsChange}
                    />
                    <AiClipSuggestions currentVideo={currentVideo} onAddSuggestion={handleAddSuggestedClip} />
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-8 text-sm text-[var(--text-secondary)]">
                    Upload a source video to unlock manual trim controls and AI clip suggestions.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card id="clips-section" className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                    3
                  </span>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileCheck2 className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                      Review exports
                    </CardTitle>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Check the selected ranges, export status, output quality, subtitles, and completed downloads.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ClipsGrid
                  clips={clips}
                  onDeleteClip={handleDeleteClip}
                  onExportClip={handleExportClip}
                  highlightedClipId={highlightedClipId}
                />
              </CardContent>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 text-sm font-semibold text-[var(--success)]">
                    4
                  </span>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
                      Export clips
                    </CardTitle>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Start exports from reviewed clips, monitor processing, and download finished short-form videos.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isProjectSaving ? (
                  <p className="rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-soft)] px-3 py-2 text-sm text-[var(--text-primary)]">
                    Saving project...
                  </p>
                ) : null}
                {projectPersistenceError ? (
                  <p className="rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">
                    Project changes could not be saved: {projectPersistenceError}
                  </p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">Ready</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{readyClipCount}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">Processing</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--warning)]">{processingClipCount}</p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">Completed</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--success)]">{completedClipCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-6">
            <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
                    <Clapperboard className="h-4 w-4" aria-hidden="true" />
                  </span>
                  ClipForge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  A focused workspace for turning long-form videos into polished clips with trim controls, AI review, and export tracking.
                </p>
                <div className="grid gap-3">
                  {clipForgeFeatures.map((feature) => {
                    const FeatureIcon = feature.icon;

                    return (
                      <div
                        key={feature.label}
                        className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3"
                      >
                        <FeatureIcon className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                        <span className="text-sm text-[var(--text-primary)]">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
