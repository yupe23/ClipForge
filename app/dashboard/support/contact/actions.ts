import type { ContactSupportPayload } from './types';

export async function submitContactSupportRequest(
  payload: ContactSupportPayload,
): Promise<{ success: boolean }> {
  const response = await fetch('/api/dashboard/support/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? 'Unable to submit support request.');
  }

  return { success: result.success ?? true };
}

export async function handleContactSupportSubmit(
  payload: ContactSupportPayload,
): Promise<{ success: boolean }> {
  return submitContactSupportRequest(payload);
}
