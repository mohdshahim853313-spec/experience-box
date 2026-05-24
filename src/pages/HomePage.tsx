import { useState, useEffect, useMemo, useRef } from "react";
import { Layout } from "../components/layout/Layout";
import { CategoryScroller } from "../components/feed/CategoryScroller";
import { PostCard } from "../components/feed/PostCard";
import { fetchExperiences } from "../services/db";
import { Post, CATEGORIES, MOCK_POSTS } from "../services/data";
import { Search, UserCircle, ArrowDownAZ } from "lucide-react";
import { useIsMobile, useLocalStorage } from "../hooks/useShared";
import { cn } from "../lib/utils";

const SORT_OPTIONS = ["Newest", "Most Upvoted", "Most Commented"] as const;
type SortOption = typeof SORT_OPTIONS[number];

function SortDropdown({ sortOption, setSortOption }: { sortOption: SortOption, setSortOption: (val: SortOption) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/50 border border-slate-200 text-slate-700 py-1.5 pl-4 pr-3 rounded-full text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        {sortOption}
        <svg className={cn("fill-current h-4 w-4 text-slate-400 transition-transform", isOpen ? "rotate-180" : "")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 p-1 glass-card">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => {
                setSortOption(opt);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm font-bold rounded-xl transition-colors",
                sortOption === opt 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const getPostUpvotes = (post: Post) => {
  const hash = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseVotes = (hash % 400) + 50;
  
  const upvotesStr = localStorage.getItem("expbox_upvotes");
  if (upvotesStr) {
    try {
      const upvotes = JSON.parse(upvotesStr);
      if (upvotes[post.id] !== undefined) {
         return upvotes[post.id];
      }
    } catch (e) {}
  }
  return baseVotes;
};

const getPostCommentsCount = (post: Post) => {
  const commentsStr = localStorage.getItem(`expbox_comments_${post.id}`);
  if (commentsStr) {
    try {
      const comments = JSON.parse(commentsStr);
      return comments.length;
    } catch (e) {}
  }
  return 0;
};

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const localPostsStr = localStorage.getItem('expbox_user_posts');
      const localPosts = localPostsStr ? JSON.parse(localPostsStr) as Post[] : [];
      return [...localPosts, ...MOCK_POSTS];
    } catch(e) {
      return MOCK_POSTS;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]); // "All Posts"
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [hiddenPosts, setHiddenPosts] = useLocalStorage<string[]>("expbox_hidden_posts", []);
  const [user] = useLocalStorage("expbox_user_profile", {
    name: "Mohd Shahim",
    email: "mohdshahim853313@gmail.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Shahim"
  });
  
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchExperiences();
        setPosts(data);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHidePost = (id: string) => {
    setHiddenPosts(prev => [...prev, id]);
  };

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      if (hiddenPosts.includes(post.id)) return false;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.teaser.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortOption) {
      case "Most Upvoted":
        result.sort((a, b) => getPostUpvotes(b) - getPostUpvotes(a));
        break;
      case "Most Commented":
        result.sort((a, b) => getPostCommentsCount(b) - getPostCommentsCount(a));
        break;
      case "Newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [posts, searchQuery, activeCategory, hiddenPosts, sortOption]);

  return (
    <Layout>
      <div className="flex flex-col mx-auto w-full">
        {/* Search/Ask Bar */}
        <div className="glass-card max-sm:border-x-0 max-sm:border-t-0 p-4 max-sm:rounded-none rounded-xl md:rounded-2xl shadow-sm flex items-center gap-4 border border-slate-200 md:mb-6 mb-1.5 z-10 relative">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-300">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What experience do you want to share or search?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-300 transition-colors rounded-full py-2 pl-4 pr-10 text-[14px] outline-none border border-slate-200 focus:border-indigo-300 text-slate-800"
            />
            {searchQuery && (
               <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg font-medium"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Action Bar: Category Scroller + Sort */}
        <div className="mb-6 px-4 md:px-0 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex-1 overflow-hidden">
            <CategoryScroller 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>
          
          <div className="relative flex-shrink-0 z-10 self-end md:self-auto ml-1">
            <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
          </div>
        </div>

        {/* Feed Layout */}
        <div className="flex-1 w-full">
          {isLoading && posts.length === 0 ? (
            <div className="flex items-center justify-center p-12 text-slate-500">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className={cn(
              "w-full px-0",
              isMobile ? "flex flex-col gap-[6px] bg-slate-200 pb-[6px]" : "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-transparent"
            )}>
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onHide={handleHidePost} />
              ))}
            </div>
          ) : (
            <div className="glass-card px-4 md:px-0 md:rounded-2xl p-12 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2">No experiences found</h3>
              <p className="text-slate-500 text-[15px]">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
