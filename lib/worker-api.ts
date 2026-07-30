export type WorkerClipRequest = {
  start_seconds: number;
  end_seconds: number;
};

export type UploadVideoRequest = {
  source_url?: string;
  source_type: 'youtube' | 'upload';
  source_id?: string;
  quality?: '480p' | '720p' | '1080p' | 'best';
  add_subtitles?: boolean;
  clips: WorkerClipRequest[];
};

export type UploadVideoResponse = {
  source_id: string;
};

export type ProcessClipsResponse = {
  job_id: string;
  status: string;
};

export type JobStatusResponse = {
  status: string;
  download_urls: string[];
  suggestions?: {
    start_seconds: number;
    end_seconds: number;
    reason: string;
  }[];
};

const getWorkerApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WORKER_API_URL?.trim();

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_WORKER_API_URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
};

const handleResponse = async <T>(response: Response, fallbackMessage: string): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || fallbackMessage);
  }

  return (await response.json()) as T;
};

export async function uploadVideo(file: File): Promise<UploadVideoResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${getWorkerApiBaseUrl()}/upload`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse<UploadVideoResponse>(response, 'Video upload failed.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the worker service.');
    }

    throw new Error('Unable to reach the worker service.');
  }
}

export async function processClips(payload: UploadVideoRequest): Promise<ProcessClipsResponse> {
  try {
    const response = await fetch(`${getWorkerApiBaseUrl()}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<ProcessClipsResponse>(response, 'Clip processing failed.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the worker service.');
    }

    throw new Error('Unable to reach the worker service.');
  }
}

export type VideoInfoResponse = {
  duration_seconds: number;
  title: string;
  thumbnail_url: string;
};

export async function getVideoInfo(sourceUrl: string): Promise<VideoInfoResponse> {
  try {
    const response = await fetch(`${getWorkerApiBaseUrl()}/video-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source_url: sourceUrl }),
    });

    return handleResponse<VideoInfoResponse>(response, 'Unable to fetch video information.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the worker service.');
    }

    throw new Error('Unable to reach the worker service.');
  }
}

export async function suggestClips(payload: { source_url?: string; source_id?: string }): Promise<ProcessClipsResponse> {
  try {
    const response = await fetch(`${getWorkerApiBaseUrl()}/suggest-clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<ProcessClipsResponse>(response, 'Unable to request AI clip suggestions.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the worker service.');
    }

    throw new Error('Unable to reach the worker service.');
  }
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  try {
    const response = await fetch(`${getWorkerApiBaseUrl()}/status/${jobId}`);

    return handleResponse<JobStatusResponse>(response, 'Unable to fetch job status.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Unable to reach the worker service.');
    }

    throw new Error('Unable to reach the worker service.');
  }
}
