import { Resend } from 'resend';

export function getResendApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable.');
  }

  return apiKey;
}

export const resend = new Resend(getResendApiKey());
