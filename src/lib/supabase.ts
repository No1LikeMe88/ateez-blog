import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yjfkaamnzvbtxbuhiovj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZmthYW1uenZidHhidWhpb3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjIxMzMsImV4cCI6MjA5NTA5ODEzM30.JbmfFT99RTMBqqHWCZUhPsNAlTyu6eMJgfcHysqjFlQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
