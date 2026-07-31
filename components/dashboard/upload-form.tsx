'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { getVideoInfo, uploadVideo } from '@/lib/worker-api';

type UploadFormProps = {
  onVideoSubmit?: (video: { videoUrl: string; duration: number; title?: string }) => void;
  onVideoReady?: (video: {
    source_type: 'youtube' | 'upload';
    source_url?: string;
    source_id?: string;
    duration?: number;
  }) => void;
};

export function UploadForm({ onVideoSubmit, onVideoReady }: UploadFormProps) {
  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isFetchingVideoInfo, setIsFetchingVideoInfo] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);

    if (selectedFile) {
      setIsUploading(true);

      try {
        const objectUrl = URL.createObjectURL(selectedFile);
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.src = objectUrl;

        const uploadResult = await uploadVideo(selectedFile);
        const resolvedDuration = await new Promise<number>((resolve) => {
          tempVideo.onloadedmetadata = () => {
            const resolvedDuration = Number.isFinite(tempVideo.duration)
              ? Math.max(1, Math.floor(tempVideo.duration))
              : 600;

            resolve(resolvedDuration);
          };

          tempVideo.onerror = () => {
            resolve(600);
          };
        });

        onVideoSubmit?.({ videoUrl: objectUrl, duration: resolvedDuration, title: selectedFile.name });
        onVideoReady?.({ source_type: 'upload', source_id: uploadResult.source_id });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to upload the video.';
        setUploadError(message);
      } finally {
        setIsUploading(false);
      }

      return;
    }

    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      return;
    }

    setIsFetchingVideoInfo(true);

    try {
      const result = await getVideoInfo(trimmedUrl);

      onVideoSubmit?.({ videoUrl: trimmedUrl, duration: result.duration_seconds, title: result.title });
      onVideoReady?.({
        source_type: 'youtube',
        source_url: trimmedUrl,
        duration: result.duration_seconds,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch video information.';
      setUploadError(message);
    } finally {
      setIsFetchingVideoInfo(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">YouTube URL</label>
        <input
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        <div className="h-px flex-1 bg-[var(--border)]" />
        or
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="space-y-2">
        <label htmlFor="video-upload" className="text-sm font-medium text-[var(--text-primary)]">
          Upload a video file
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-md border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-8 text-sm text-[var(--text-secondary)]"
        />
      </div>

      {uploadError ? (
        <p className="rounded-md border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">
          {uploadError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isUploading || isFetchingVideoInfo}>
          {isUploading ? 'Uploading…' : isFetchingVideoInfo ? 'Fetching video info...' : 'Start repurposing'}
        </Button>
        <Button type="button" variant="secondary">
          Save draft
        </Button>
      </div>
    </form>
  );
}
