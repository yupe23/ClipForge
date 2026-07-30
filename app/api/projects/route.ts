import { NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const projectColumns = 'id, title, status, created_at, updated_at';
const maxProjectTitleLength = 120;

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAuthenticatedUser('GET /api/projects');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerSupabaseClient(session.token);
  const { data, error } = await supabase
    .from('projects')
    .select(projectColumns)
    .eq('user_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Unable to load projects', error);
    return NextResponse.json({ error: 'Unable to load projects.' }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const session = await getAuthenticatedUser('POST /api/projects');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { title?: unknown } | null;
  const title = typeof body?.title === 'string' ? body.title.trim() : '';

  if (!title) {
    return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
  }

  if (title.length > maxProjectTitleLength) {
    return NextResponse.json({ error: `Project title must be ${maxProjectTitleLength} characters or less.` }, { status: 400 });
  }

  const supabase = createServerSupabaseClient(session.token);
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      status: 'draft',
    })
    .select(projectColumns)
    .single();

  if (error) {
    console.error('Unable to create project', error);
    return NextResponse.json({ error: 'Unable to create project.' }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
