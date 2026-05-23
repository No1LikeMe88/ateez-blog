import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yjfkaamnzvbtxbuhiovj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZmthYW1uenZidHhidWhpb3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjQ0MjgsImV4cCI6MjA5NTEwMDQyOH0.J1Xl68185589-0cde-402d-a02f-b57383d3d3d3'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
