import { createClient } from "@supabase/supabase-js"

/**
 * WARNING: This client uses the service_role key which bypasses RLS.
 * ONLY use this on the server for administrative tasks like user management.
 */
export async function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Action requires administrative privileges.")
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
