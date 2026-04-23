import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Cliente com service_role — bypassa RLS.
// Usar APENAS em Server Actions e Route Handlers confiáveis.
export const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
