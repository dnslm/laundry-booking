export function getRedirectTarget(state: unknown): string {
  if (typeof state !== 'object' || state === null) {
    return '/booking';
  }

  const from = (state as { from?: unknown }).from;

  if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
    return from;
  }

  return '/booking';
}
