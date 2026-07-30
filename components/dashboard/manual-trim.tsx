'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

type Clip = {
  id: string;
  start: number;
  end: number;
};

type ManualTrimProps = {
  videoUrl: string;
  duration?: number;
  sourceType: 'youtube' | 'upload';
  onClipsChange?: (clips: Clip[]) => void;
};

const formatTime = (value: number) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safeValue % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

const parseMmSs = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(':');

  if (parts.length !== 2) {
    return null;
  }

  const [minutes, seconds] = parts;
  const minuteValue = Number.parseInt(minutes, 10);
  const secondValue = Number.parseInt(seconds, 10);

  if (Number.isNaN(minuteValue) || Number.isNaN(secondValue)) {
    return null;
  }

  if (minuteValue < 0 || secondValue < 0 || secondValue >= 60) {
    return null;
  }

  return minuteValue * 60 + secondValue;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const getInitialRangeEnd = (nextDuration: number) => (nextDuration > 0 ? nextDuration : 0);

const getYouTubeVideoId = (url: string) => {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    }

    if (parsedUrl.hostname === 'youtu.be' || parsedUrl.hostname === 'www.youtu.be') {
      return parsedUrl.pathname.replace(/^\//, '');
    }
  } catch {
    // Fall back to a simple regex for non-URL strings.
  }

  const match = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?#]+)/i);

  return match?.[1] ?? null;
};

export function ManualTrim({ videoUrl, duration = 0, sourceType, onClipsChange }: ManualTrimProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const timelineRef = React.useRef<HTMLDivElement | null>(null);
  const dragHandleRef = React.useRef<'start' | 'end' | null>(null);
  const undoTimerRef = React.useRef<number | null>(null);

  const initialEnd = getInitialRangeEnd(duration);

  const [videoDuration, setVideoDuration] = React.useState(duration || 0);
  const [playbackTime, setPlaybackTime] = React.useState(0);
  const [selectedRange, setSelectedRange] = React.useState({ start: 0, end: initialEnd });
  const [clips, setClips] = React.useState<Clip[]>([]);
  const [lastRemovedClip, setLastRemovedClip] = React.useState<Clip | null>(null);
  const [startInput, setStartInput] = React.useState(formatTime(0));
  const [endInput, setEndInput] = React.useState(formatTime(initialEnd));
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    const nextDuration = duration || 0;
    const nextRangeEnd = getInitialRangeEnd(nextDuration);

    setVideoDuration(nextDuration);
    setSelectedRange({ start: 0, end: nextRangeEnd });
    setStartInput(formatTime(0));
    setEndInput(formatTime(nextRangeEnd));
  }, [duration]);

  React.useEffect(() => {
    onClipsChange?.(clips);
  }, [clips, onClipsChange]);

  React.useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    const handleTimeUpdate = () => setPlaybackTime(video.currentTime);
    const handleLoadedMetadata = () => {
      const nextDuration = Number.isFinite(video.duration) ? video.duration : duration || 0;
      const nextRangeEnd = getInitialRangeEnd(nextDuration);

      setVideoDuration(nextDuration);
      setSelectedRange({ start: 0, end: nextRangeEnd });
      setStartInput(formatTime(0));
      setEndInput(formatTime(nextRangeEnd));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [duration]);

  React.useEffect(() => {
    if (selectedRange.start > selectedRange.end) {
      setSelectedRange((current) => ({ start: current.end, end: current.start }));
    }
  }, [selectedRange]);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragHandleRef.current || !timelineRef.current) {
        return;
      }

      const bounds = timelineRef.current.getBoundingClientRect();
      const ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const nextPosition = ratio * videoDuration;

      setSelectedRange((current) => {
        if (dragHandleRef.current === 'start') {
          const start = Math.min(nextPosition, current.end - 0.1);
          return { start: Math.max(0, start), end: current.end };
        }

        const end = Math.max(nextPosition, current.start + 0.1);
        return { start: current.start, end: Math.min(videoDuration, end) };
      });
    };

    const handlePointerUp = () => {
      dragHandleRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [videoDuration]);

  React.useEffect(() => {
    setStartInput(formatTime(selectedRange.start));
    setEndInput(formatTime(selectedRange.end));
  }, [selectedRange]);

  const handleTimelineSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (sourceType === 'youtube' || !timelineRef.current || !videoRef.current || videoDuration === 0) {
      return;
    }

    const bounds = timelineRef.current.getBoundingClientRect();
    const ratio = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const nextTime = ratio * videoDuration;

    videoRef.current.currentTime = nextTime;
    setPlaybackTime(nextTime);
  };

  const handleDragStart = (handle: 'start' | 'end') => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragHandleRef.current = handle;
    setIsDragging(true);
  };

  const handleInputChange = (type: 'start' | 'end', value: string) => {
    const parsed = parseMmSs(value);

    if (parsed === null) {
      return;
    }

    const maxDuration = Math.max(videoDuration, 0);
    const nextValue = clamp(parsed, 0, maxDuration);

    setSelectedRange((current) => {
      if (type === 'start') {
        const maxStart = Math.max(current.end - 1, 0);
        const start = Math.min(nextValue, maxStart);
        return { start: Math.max(0, start), end: current.end };
      }

      const minEnd = Math.min(current.start + 1, maxDuration);
      const end = Math.max(nextValue, minEnd);
      return { start: current.start, end: Math.min(maxDuration, end) };
    });
  };

  const addClip = () => {
    if (selectedRange.end <= selectedRange.start) {
      return;
    }

    const clip: Clip = {
      id: `${selectedRange.start}-${selectedRange.end}-${Date.now()}`,
      start: selectedRange.start,
      end: selectedRange.end,
    };

    setClips((current) => [...current, clip]);
  };

  const removeClip = (clipId: string) => {
    setClips((current) => {
      const removedClip = current.find((clip) => clip.id === clipId);

      if (!removedClip) {
        return current;
      }

      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }

      setLastRemovedClip(removedClip);
      undoTimerRef.current = window.setTimeout(() => {
        setLastRemovedClip(null);
        undoTimerRef.current = null;
      }, 4500);

      return current.filter((clip) => clip.id !== clipId);
    });
  };

  const undoRemoveClip = () => {
    if (!lastRemovedClip) {
      return;
    }

    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    setClips((current) => [...current, lastRemovedClip]);
    setLastRemovedClip(null);
  };

  const rangeWidth = videoDuration > 0 ? ((selectedRange.end - selectedRange.start) / videoDuration) * 100 : 0;
  const startPosition = videoDuration > 0 ? (selectedRange.start / videoDuration) * 100 : 0;
  const endPosition = videoDuration > 0 ? (selectedRange.end / videoDuration) * 100 : 0;
  const youtubeVideoId = sourceType === 'youtube' ? getYouTubeVideoId(videoUrl) : null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text-primary)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[#0B0D10]">
          {sourceType === 'youtube' && youtubeVideoId ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black"
              src={videoUrl}
              controls
              preload="metadata"
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Timeline</span>
            <span>{formatTime(playbackTime)} / {formatTime(videoDuration)}</span>
          </div>

          <div
            ref={timelineRef}
            className="relative h-12 cursor-pointer rounded-lg border border-[var(--border)] bg-[#11141A]"
            onPointerDown={handleTimelineSeek}
          >
            <div className="absolute inset-y-0 left-0 right-0 flex items-center px-3">
              <div className="h-1.5 w-full rounded-full bg-[var(--border)]" />
            </div>

            <div
              className="absolute inset-y-0 rounded-lg bg-[var(--accent)]/25"
              style={{ left: `${startPosition}%`, width: `${rangeWidth}%` }}
            />

            <button
              type="button"
              aria-label="Set trim start"
              onPointerDown={handleDragStart('start')}
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-[var(--surface)]"
              style={{ left: `calc(${startPosition}% - 10px)` }}
            />

            <button
              type="button"
              aria-label="Set trim end"
              onPointerDown={handleDragStart('end')}
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-[var(--surface)]"
              style={{ left: `calc(${endPosition}% - 10px)` }}
            />

            <div
              className="pointer-events-none absolute -top-2 -translate-x-1/2 rounded bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--text-primary)]"
              style={{ left: `${startPosition}%` }}
            >
              {formatTime(selectedRange.start)}
            </div>

            <div
              className="pointer-events-none absolute -top-2 -translate-x-1/2 rounded bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--text-primary)]"
              style={{ left: `${endPosition}%` }}
            >
              {formatTime(selectedRange.end)}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span>Start time</span>
              <input
                value={startInput}
                onChange={(event) => {
                  setStartInput(event.target.value);
                  handleInputChange('start', event.target.value);
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[#0B0D10] px-3 py-2 text-[var(--text-primary)] outline-none"
                placeholder="00:00"
              />
            </label>

            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
              <span>End time</span>
              <input
                value={endInput}
                onChange={(event) => {
                  setEndInput(event.target.value);
                  handleInputChange('end', event.target.value);
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[#0B0D10] px-3 py-2 text-[var(--text-primary)] outline-none"
                placeholder="00:00"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={addClip} disabled={selectedRange.end <= selectedRange.start}>
              Add Clip
            </Button>
            <span className="text-xs text-[var(--text-secondary)]">
              {isDragging ? 'Dragging selection…' : 'Click the timeline to seek the preview'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Selected clips</h3>
            <span className="text-xs text-[var(--text-secondary)]">{clips.length} added</span>
          </div>

          <div className="space-y-3">
            {clips.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[#11141A] px-4 py-6 text-sm text-[var(--text-secondary)]">
                No clips added yet. Choose a range and press Add Clip.
              </div>
            ) : (
              clips.map((clip) => (
                <div
                  key={clip.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[#11141A] p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {formatTime(clip.start)} - {formatTime(clip.end)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Duration: {formatTime(clip.end - clip.start)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeClip(clip.id)}
                      className="gap-1.5"
                    >
                      <span aria-hidden="true">×</span>
                      <span className="sr-only">Remove clip</span>
                    </Button>
                    <Button type="button" variant="secondary" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {lastRemovedClip ? (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-lg shadow-black/20">
              <span>Clip removed</span>
              <Button type="button" variant="secondary" size="sm" onClick={undoRemoveClip}>
                Undo
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
