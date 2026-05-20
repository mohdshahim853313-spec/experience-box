import React from "react";
import { Layout } from "../components/layout/Layout";
import { PostCard } from "../components/feed/PostCard";
import { MOCK_POSTS } from "../services/data";
import { Users, Search, Star, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";

export function FollowingPage() {
  // Only show a subset of posts for the "followed" feed
  const followedPosts = MOCK_POSTS.slice(0, 3);
  
  const suggestedFollows = [
    { name: "Anjali Sharma", handle: "@anjalis", bio: "Product Designer @ Meta", followers: "12k" },
    { name: "Rahul Verma", handle: "@rahulv", bio: "Startup founder & angel investor", followers: "8.5k" },
    { name: "Priya Patel", handle: "@priyacodes", bio: "Senior Engineer. Writing about web dev.", followers: "24k" },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full px-4 md:px-0">
        {/* Main Feed Column */}
        <div className="flex-1 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2.5 rounded-full">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Following</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Stories from people you follow</p>
            </div>
          </div>

          <div className="space-y-6">
            {followedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            
            {followedPosts.length === 0 && (
              <div className="glass-card flex flex-col items-center justify-center p-12 text-center border-dashed">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">You aren't following anyone yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  Discover great writers, thought leaders, and creators to fill your feed with inspiring stories.
                </p>
                <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors">
                  Find people to follow
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
          {/* Internal Search */}
          <div className="glass-card p-1 rounded-full flex items-center bg-white/50 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search people..." 
              className="flex-1 bg-transparent py-2 text-sm font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 bg-white/50">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Suggested for you
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {suggestedFollows.map((person, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 group">
                  <div className="flex gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-white flex items-center justify-center font-bold text-indigo-700 flex-shrink-0">
                      {person.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {person.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mb-0.5">{person.handle}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{person.bio}</p>
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <button className="w-full py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                View all suggestions
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium flex flex-wrap gap-x-3 gap-y-2 px-2">
            <a href="#" className="hover:text-slate-600 transition-colors">About</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <span>© 2026 ExperienceBox</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
