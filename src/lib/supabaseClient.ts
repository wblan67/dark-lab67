import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://crprtdfvfrdiubctziej.supabase.co'
const supabaseAnonKey = 'sb_publishable_gSXwa7yIk_5zM-K6cQnIFA_okXcxYbL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)