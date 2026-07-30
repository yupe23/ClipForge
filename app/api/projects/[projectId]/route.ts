import { NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProjectStatus } from '@/lib/supabase/types';

const projectStatuses = new Set<ProjectStatus>(['draft', 'ready', 'processing', 'completed', 'failed']);
const projectIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const projectColumns = 'id, title, status, created_at, updated_at';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { projectId: string } }) {
  const session = await getAuthenticatedUser();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!projectIdPattern.test(params.projectId)) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
  const status = body?.status;

  if (typeof status !== 'string' || !projectStatuses.has(status as ProjectStatus)) {
    return NextResponse.json({ error: 'Valid project status is required.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient(session.token);
  const { data, error } = await supabase
    .from('projects')
    .update({ status: status as ProjectStatus })
    .eq('id', params.projectId)
    .eq('user_id', session.userId)
    .select(projectColumns)
    .single();

  if (error) {
    const statusCode = error.code === 'PGRST116' ? 404 : 500;
    if (statusCode === 500) {
      console.error('Unable to update project', error);
    }

    return NextResponse.json(
      { error: statusCode === 404 ? 'Project not found.' : 'Unable to update project.' },
      { status: statusCode },
    );
  }

  return NextResponse.json({ project: data });
}
