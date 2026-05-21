import { createClient } from '@supabase/supabase-js';
import { environment } from './environment';
const supabaseUrl = environment.SUPABASE_URL;
const supabaseKey =environment.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
