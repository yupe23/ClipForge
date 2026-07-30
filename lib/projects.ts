import type { ProjectStatus } from '@/lib/supabase/types';

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

const parseProjectResponse = async (response: Response) => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? 'Unable to save project.');
  }

  return (await response.json()) as { project: Project };
};

export async function createProject(title: string) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  const { project } = await parseProjectResponse(response);
  return project;
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const { project } = await parseProjectResponse(response);
  return project;
}
