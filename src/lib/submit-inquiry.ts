export async function submitInquiry(payload: Record<string, unknown>) {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok || typeof result.reference !== 'string') {
    throw new Error(result.error || 'The form could not be saved. Please try again.');
  }

  return result as { reference: string; receivedAt: string };
}
