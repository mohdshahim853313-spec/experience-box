import { createClient } from '@supabase/supabase-js';
import { MOCK_POSTS, Post } from './data';

// Keep the mock spaces from SpacesPage, we'll use them as fallbacks
export const MOCK_YOUR_SPACES = [
  { id: 1, name: "Startup Chronicles", members: "12.4k", icon: "🚀", unread: 3, role: "Admin" },
  { id: 2, name: "Design Systems", members: "8.2k", icon: "🎨", role: "Contributor" },
  { id: 3, name: "Digital Nomads", members: "45k", icon: "🌍", role: "Member" },
];

export const MOCK_DISCOVER_SPACES = [
  { id: 4, name: "Product Management", members: "89k", icon: "📈", description: "Discussions on product strategy, roadmap, and execution." },
  { id: 5, name: "Indie Hackers", members: "120k", icon: "💻", description: "Bootstrap your way to financial freedom and build in public." },
  { id: 6, name: "Philosophy & Life", members: "34k", icon: "🧠", description: "Deep conversations about the meaning of it all." },
  { id: 7, name: "Personal Finance", members: "250k", icon: "💰", description: "Strategies for wealth building, investments, and financial independence." },
  { id: 8, name: "Web3 Builders", members: "15k", icon: "⛓️", description: "Building the decentralized future, one block at a time." },
  { id: 9, name: "Fitness Journey", members: "67k", icon: "🏋️", description: "Share your progress, routines, and diet tips with the community." },
  { id: 10, name: "Creative Writing", members: "42k", icon: "✍️", description: "A safe space to share your stories, poems, and fiction." },
  { id: 11, name: "Machine Learning", members: "105k", icon: "🤖", description: "Latest trends, papers, and practical applications of AI/ML." },
];

// Suggested follows mock
export const MOCK_SUGGESTED_FOLLOWS = [
  { name: "Anjali Sharma", handle: "@anjalis", bio: "Product Designer @ Meta", followers: "12k" },
  { name: "Rahul Verma", handle: "@rahulv", bio: "Startup founder & angel investor", followers: "8.5k" },
  { name: "Priya Patel", handle: "@priyacodes", bio: "Senior Engineer. Writing about web dev.", followers: "24k" },
];

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

export async function fetchDiscoverSpaces() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('discover_spaces').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn("Supabase fetch spaces failed, using mock", err);
    }
  } else {
    await new Promise(r => setTimeout(r, 400));
  }
  return MOCK_DISCOVER_SPACES;
}

export async function fetchYourSpaces() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('your_spaces').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn("Supabase fetch your spaces failed, using mock", err);
    }
  } else {
    await new Promise(r => setTimeout(r, 200));
  }
  return MOCK_YOUR_SPACES;
}

export async function fetchSuggestedFollows() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('suggested_follows').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn("Supabase fetch suggested follows failed, using mock", err);
    }
  } else {
    await new Promise(r => setTimeout(r, 300));
  }
  return MOCK_SUGGESTED_FOLLOWS;
}
