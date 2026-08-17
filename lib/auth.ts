import 'server-only';

import { auth } from '@clerk/nextjs/server';

type SupabaseCompatibleClaims = {
  role?: unknown;
  sub?: unknown;
  [claim: string]: unknown;
};

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SupabaseCompatibleClaims;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(authContext = 'authenticated request') {
  const { getToken, userId } = await auth();

  console.log(`${authContext} Clerk auth userId`, { userId });

  if (!userId) {
    console.log(`${authContext} auth check failed`, { check: 'missing_clerk_user_id' });
    return null;
  }

  const token = await getToken();
  const claims = token ? decodeJwtPayload(token) : null;

  console.log(`${authContext} Clerk session token claims`, claims);

  if (!token) {
    console.log(`${authContext} auth check failed`, { check: 'missing_clerk_session_token', userId });
    return null;
  }

  if (claims?.role !== 'authenticated') {
    console.warn(`${authContext} Clerk session token may not be Supabase-compatible`, {
      role: claims?.role,
      userId,
    });
  }

  return { token, userId };
}
