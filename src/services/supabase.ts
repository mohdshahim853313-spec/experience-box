import { createClient } from '@supabase/supabase-js';
import { MOCK_POSTS, Post } from './data';

// Determine if we have real supabase credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Helper to gracefully fallback to mock data if no DB is configured
export async function fetchExperiences(): Promise<Post[]> {
  let combinedPosts: Post[] = [];
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data && data.length > 0) {
        combinedPosts = data as Post[];
      }
    } catch (err) {
      console.warn("Real Supabase fetch failed or returned 0 items, falling back to mock data.", err);
      combinedPosts = MOCK_POSTS;
    }
  } else {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    combinedPosts = MOCK_POSTS;
  }

  try {
    const localPostsStr = localStorage.getItem('expbox_user_posts');
    if (localPostsStr) {
      const localPosts = JSON.parse(localPostsStr) as Post[];
      combinedPosts = [...localPosts, ...combinedPosts];
    }
  } catch(e) {}
  
  // order by date
  combinedPosts.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return combinedPosts;
}
