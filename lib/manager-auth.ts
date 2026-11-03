import { timingSafeEqual } from 'crypto';

export function managerAuthError(request: Request): Response | null {
  const password = process.env.GUEST_MANAGER_PASSWORD;
  if (!password) {
    return Response.json(
      { error: 'Guest manager is not configured. Set GUEST_MANAGER_PASSWORD on the server.' },
      { status: 503 }
    );
  }

  const authorization = request.headers.get('authorization') ?? '';
  const provided = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';
  const expectedBuffer = Buffer.from(password);
  const providedBuffer = Buffer.from(provided);
  const matches =
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer);

  if (!matches) {
    return Response.json({ error: 'Invalid manager password.' }, { status: 401 });
  }

  return null;
}
