import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export function createClient(){
    return createBrowserClient(supabaseUrl as string, supabseKey as string)
}