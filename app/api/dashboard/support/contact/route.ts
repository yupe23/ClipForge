import { NextResponse } from 'next/server';

import type { ContactSupportPayload } from '../../../dashboard/support/contact/types';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<ContactSupportPayload> | null;

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!email || !message) {
    return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
