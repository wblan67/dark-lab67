// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://glhvidkqpnknpmwdiae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcnB0c3Nwc3R0cWJ4dXJkZmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDY0MTIsImV4cCI6MjA5NTM4MjQxMn0.vuPg5Up3zq6c-X-w0VtRI1kuYbefT-HsyVTRm22oWPc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
