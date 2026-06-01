// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://glhvidkqpnknpmwdiae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHZqZGtjcXBua25wbXdkaWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDIzNTQsImV4cCI6MjA5NTg3ODM1NH0.LY5aDC60NkNGLh94I-lnuo8vndrP4XODRtuCpeMiu4M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
