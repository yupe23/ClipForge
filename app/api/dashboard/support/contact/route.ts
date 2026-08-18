import { NextResponse } from 'next/server';

import { resend } from '@/lib/email';
import type { ContactSupportPayload } from '../../../../dashboard/support/contact/types';

const supportEmail = process.env.SUPPORT_EMAIL?.trim();
const requestWindowMs = 60 * 1000;
const maxRequestsPerWindow = 5;
const requestLog = new Map<string, number[]>();

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(request: Request) {
  const clientIp = getClientIp(request);
  const now = Date.now();
  const timestamps = requestLog.get(clientIp) ?? [];
  const recentTimestamps = timestamps.filter((timestamp) => now - timestamp < requestWindowMs);

  requestLog.set(clientIp, recentTimestamps);

  if (recentTimestamps.length >= maxRequestsPerWindow) {
    recentTimestamps.push(now);
    requestLog.set(clientIp, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  requestLog.set(clientIp, recentTimestamps);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Partial<ContactSupportPayload> | null;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (name.length > 100) {
    return NextResponse.json({ error: 'Name must be 100 characters or less.' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  if (subject.length > 150) {
    return NextResponse.json({ error: 'Subject must be 150 characters or less.' }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: 'Message must be between 10 and 5000 characters.' }, { status: 400 });
  }

  if (!supportEmail) {
    console.error('Missing SUPPORT_EMAIL environment variable.');
    return NextResponse.json({ error: 'Support email is not configured.' }, { status: 500 });
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
      to: supportEmail,
      replyTo: email,
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
