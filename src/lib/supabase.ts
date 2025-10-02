import { createClient } from '@supabase/supabase-js';

// Fallback values để tránh crash khi thiếu env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Kiểm tra xem có env vars thật không
export const hasValidSupabaseConfig = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

// Tạo client với fallback
export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data cho khi không có Supabase
export const mockData = {
  career_matrix_templates: [
    {
      id: '1',
      name: 'Ma trận mẫu',
      description: 'Ma trận phát triển nghề nghiệp mẫu',
      created_at: new Date().toISOString(),
    }
  ],
  career_matrix_cells: [],
  career_matrix_arrows: [],
};

// Wrapper functions với fallback
export const safeSupabaseCall = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<{ data: T | null; error: any }> => {
  if (!hasValidSupabaseConfig()) {
    console.warn('Supabase not configured, using mock data');
    return { data: fallbackData, error: null };
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { data: fallbackData, error };
  }
};
