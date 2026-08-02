import { NextResponse } from 'next/server';

import { resend } from '@/lib/email';
import type { ContactSupportPayload } from '../../../dashboard/support/contact/types';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<ContactSupportPayload> | null;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!email || !message) {
    return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  const details = [
    `Name: ${name || 'Not provided'}`,
    `Email: ${email}`,
    `Subject: ${subject || 'No subject provided'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const htmlMessage = [
    `<p><strong>Name:</strong> ${name || 'Not provided'}</p>`,
    `<p><strong>Email:</strong> ${email}</p>`,
    `<p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>`,
    '<p><strong>Message:</strong></p>',
    `<p>${message.replace(/\n/g, '<br />')}</p>`,
  ].join('');

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'clipforge.app10@gmail.com',
      reply_to: email,
      subject: 'Support request - ClipForge',
      text: details,
      html: htmlMessage,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Unable to send support email.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unable to send support email', error);
    return NextResponse.json({ error: 'Unable to send support email.' }, { status: 500 });
  }
}
