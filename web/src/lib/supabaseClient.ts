import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kspbxnavhiiwoefphebh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcGJ4bmF2aGlpd29lZnBoZWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjYzNjQsImV4cCI6MjA2NDAwMjM2NH0.00kKPyb_0ypmnm7Ygcu02r6tqpODcu2f8glSis_nGEM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
