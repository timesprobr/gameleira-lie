import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://debxjjwpkeceqkdajiqi.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYnhqandwa2VjZXFrZGFqaXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzExMDQsImV4cCI6MjA5NDIwNzEwNH0.fmSxGBWY-2ymVuY8rdYypJPbKlzYH7zZvsUMXF1-5cI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
