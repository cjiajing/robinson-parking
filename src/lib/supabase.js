// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jlolrohbptdjlbehxwki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsb2xyb2hicHRkamxiZWh4d2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTA2NjcsImV4cCI6MjA4NjM2NjY2N30.wh0OX1CJh8v-AB0o0DZX8_62_wSlDIxZVjhTUEP2104'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
