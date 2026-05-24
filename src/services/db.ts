import { supabase } from '../lib/supabase';
import { MOCK_POSTS, Post } from './data';

export const MOCK_YOUR_SPACES = [
  { id: 1, name: "Startup Chronicles", members: "12.4k", icon: "🚀", unread: 3, role: "Admin" },
  { id: 2, name: "Design Systems", members: "8.2k", icon: "🎨", role: "Contributor" },
  { id: 3, name: "Digital Nomads", members: "45k", icon: "🌍", role: "Member" },
];

export const MOCK_DISCOVER_SPACES = [
  { id: 4, name: "Product Management", members: "89k", icon: "📈", description: "Discussions on product strategy, roadmap, and execution." },
  { id: 5, name: "Indie Hackers", members: "120k", icon: "💻", description: "Bootstrap your way to financial freedom and build in public." },
  { id: 6, name: "Philosophy & Life", members: "34k", icon: "🧠", description: "Deep conversations about the meaning of it all." },
  { id: 7, name: "Personal finance", members: "250k", icon: "💰", description: "Strategies for wealth building, investments, and financial independence." },
  { id: 8, name: "Web3 Builders", members: "15k", icon: "⛓️", description: "Building the decentralized future, one block at a time." },
];

export const MOCK_SUGGESTED_FOLLOWS = [
  { name: "Anjali Sharma", handle: "@anjalis", bio: "Product Designer @ Meta", followers: "12k" },
  { name: "Rahul Verma", handle: "@rahulv", bio: "Startup founder & angel investor", followers: "8.5k" },
  { name: "Priya Patel", handle: "@priyacodes", bio: "Senior Engineer. Writing about web dev.", followers: "24k" },
];

export async function fetchExperiences(): Promise<Post[]> {
  let combinedPosts: Post[] = [];
  
  if (supabase) {
    try {
      const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        combinedPosts = data.map(exp => ({
          ...exp,
          content: exp.context_situation || exp.content || '',
        })) as Post[];
      }
    } catch (err) {
      console.warn("Supabase fetch failed, using fallback.", err);
    }
  }

  // Load from local storage and mock data if db is empty or failed
  if (combinedPosts.length === 0) {
    combinedPosts = [...MOCK_POSTS];
  }
  
  try {
    const localPostsStr = localStorage.getItem('expbox_user_posts');
    if (localPostsStr) {
      const localPosts = JSON.parse(localPostsStr) as Post[];
      combinedPosts = [...localPosts, ...combinedPosts];
    }
  } catch(e) {}
  
  // Deduplicate and order by date
  const uniquePosts = Array.from(new Map(combinedPosts.map(item => [item.id, item])).values());
  uniquePosts.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return uniquePosts;
}

export async function createExperience(postData: Omit<Post, 'id'>, postId: string): Promise<void> {
  if (!supabase) return;
  try {
    const { content, author_name, author_avatar, ...rest } = postData as any;
    const dbPayload = {
      id: postId,
      ...rest,
      context_situation: content || '',
      what_was_tried: '',
      mistakes_made: '',
      final_outcome: '',
      secret_links: '',
      status: 'published'
    };
    
    // We omit author_name and author_avatar as those should probably come from profiles in a relational setup
    const { error } = await supabase.from('experiences').upsert(dbPayload);
    if (error) {
      console.error('Supabase Error: ', JSON.stringify(error));
      throw error;
    }
  } catch (err) {
    console.error('Supabase Error: ', err);
    throw err;
  }
}

export async function fetchDiscoverSpaces() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('discover_spaces').select('*');
      if (!error && data && data.length > 0) return data;
    } catch(err) {}
  }
  await new Promise(r => setTimeout(r, 400));
  return MOCK_DISCOVER_SPACES;
}

export async function fetchYourSpaces() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('your_spaces').select('*');
      if (!error && data && data.length > 0) return data;
    } catch(err) {}
  }
  await new Promise(r => setTimeout(r, 200));
  return MOCK_YOUR_SPACES;
}

export async function fetchSuggestedFollows() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('suggested_follows').select('*');
      if (!error && data && data.length > 0) return data;
    } catch(err) {}
  }
  await new Promise(r => setTimeout(r, 300));
  return MOCK_SUGGESTED_FOLLOWS;
}
