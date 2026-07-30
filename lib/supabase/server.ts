import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import type { Database } from './types';

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase URL and publishable key must be configured.');
  }

  return { supabasePublishableKey, supabaseUrl };
};

export function createServerSupabaseClient(accessToken: string) {
  const { supabasePublishableKey, supabaseUrl } = getSupabaseConfig();

  return createSupabaseClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      accessToken: async () => accessToken,
      auth: {
        persistSession: false,
      },
    }
  );
}
