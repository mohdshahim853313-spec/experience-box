import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { MOCK_POSTS } from "../services/data";
import { ArrowLeft, UserCircle, Share2, MoreHorizontal, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import { useLocalStorage, useIsMobile } from "../hooks/useShared";
import { cn } from "../lib/utils";

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const post = useMemo(() => {
    const localPostsStr = localStorage.getItem('expbox_user_posts');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    const allPosts = [...localPosts, ...MOCK_POSTS];
    return allPosts.find(p => p.id === id);
  }, [id]);

  // Use the same local storage keys to keep likes/comments synced
  const [upvotes, setUpvotes] = useLocalStorage<Record<string, number>>("expbox_upvotes", {});
  const [downvotes, setDownvotes] = useLocalStorage<Record<string, number>>("expbox_downvotes", {});
  const [follows, setFollows] = useLocalStorage<Record<string, boolean>>("expbox_follows", {});

  const baseVotes = useMemo(() => {
    if (!post) return 0;
    const hash = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 400) + 50;
  }, [post]);

  const currentUpvotes = post ? (upvotes[post.id] ?? baseVotes) : 0;
  const currentDownvotes = post ? (downvotes[post.id] ?? 0) : 0;
  
  const [isFollowing, setIsFollowing] = useState(post ? (follows[post.creator_id] || false) : false);

  const [userVotes, setUserVotes] = useLocalStorage<Record<string, 'up' | 'down' | null>>("expbox_user_votes", {});
  const userVote = post ? (userVotes[post.id] || null) : null;

  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useLocalStorage<any[]>(`expbox_comments_${id}`, []);

  const [showMenu, setShowMenu] = useState(false);
  const [savedPosts, setSavedPosts] = useLocalStorage<string[]>("expbox_saved_posts", []);
  const isSaved = post ? savedPosts.includes(post.id) : false;

  if (!post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto w-full text-center mt-20">
          <h1 className="text-2xl font-bold text-slate-800">Post not found</h1>
          <p className="text-slate-500 mt-2">The post you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-6 font-bold text-indigo-600 bg-indigo-50 px-6 py-2 rounded-full hover:bg-indigo-100"
          >
            Go Home
          </button>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    if (isSaved) {
      setSavedPosts(prev => prev.filter(pid => pid !== post.id));
    } else {
      setSavedPosts(prev => [...prev, post.id]);
    }
  };

  const handleUpvote = () => {
    if (userVote === 'up') {
      setUserVotes(prev => ({ ...prev, [post.id]: null }));
    } else {
      setUserVotes(prev => ({ ...prev, [post.id]: 'up' }));
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      setUserVotes(prev => ({ ...prev, [post.id]: null }));
    } else {
      setUserVotes(prev => ({ ...prev, [post.id]: 'down' }));
    }
  };

  const displayUpvotes = currentUpvotes + (userVote === 'up' ? 1 : 0);
  const displayDownvotes = currentDownvotes + (userVote === 'down' ? 1 : 0);
  const totalScore = Math.max(0, displayUpvotes - displayDownvotes);

  const handleFollow = () => {
    if (post.is_anonymous) return;
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    setFollows(prev => ({ ...prev, [post.creator_id]: newFollowState }));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.teaser, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      user: "You",
      date: new Date().toISOString(),
    };

    setPostComments(prev => [newComment, ...(prev || [])]);
    setCommentText("");
  };

  const displayName = post.is_anonymous ? "Anonymous User" : (post.author_name || "Unknown User");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full px-0 sm:px-0 mt-0 sm:mt-6">
        <article className="bg-[#ffffff] dark:bg-[#1a1a1b] sm:glass-card p-4 sm:p-6 md:p-8 rounded-none sm:rounded-2xl md:rounded-3xl border-0 sm:border sm:border-slate-200 border-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div 
              className={cn(
                "flex items-center gap-3",
                !post.is_anonymous && "cursor-pointer hover:opacity-80 transition-opacity"
              )}
              onClick={() => {
                if (!post.is_anonymous) {
                  navigate(post.creator_id === "local_user" ? "/profile" : `/profile/${post.creator_id}`);
                }
              }}
            >
              {post.is_anonymous || !post.author_avatar ? (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-slate-400" />
                </div>
              ) : (
                <img src={post.author_avatar} alt={displayName} className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-slate-200" />
              )}
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{displayName}</span>
                  {!post.is_anonymous && (
                    <button 
                      onClick={handleFollow}
                      className={cn("text-sm font-bold hover:underline", isFollowing ? "text-slate-500" : "text-blue-600")}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {post.category} • {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all p-2 rounded-full"
              >
                <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg py-1 z-20 overflow-hidden flex flex-col">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); handleSave(); }}
                      className="px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {isSaved ? "Remove Bookmark" : "Bookmark"}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); alert("Post reported."); }}
                      className="px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 leading-snug">
            {post.title}
          </h1>

          <div dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.teaser}</p>` }} className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed font-medium mb-10 whitespace-pre-wrap" />

          {/* Actions */}
          <div className="flex items-center justify-between py-4 border-t border-slate-100">
             <div className="flex border border-slate-200 rounded-full overflow-hidden bg-slate-50">
                <button 
                  onClick={handleUpvote}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 border-r border-slate-200 transition-all",
                    userVote === 'up' ? "bg-indigo-600 text-white" : "hover:bg-indigo-50"
                  )}
                >
                  <ArrowUp className={cn("w-4 h-4", userVote === 'up' ? "text-white fill-white" : "text-indigo-500")} strokeWidth={2.5} />
                  <span className={cn("text-xs font-bold", userVote === 'up' ? "text-white" : "text-slate-600")}>{totalScore}</span>
                </button>
                <button 
                  onClick={handleDownvote}
                  className={cn(
                    "px-4 py-2 transition-all",
                    userVote === 'down' ? "bg-red-600 text-white" : "hover:bg-slate-100"
                  )}
                >
                  <ArrowDown className={cn("w-4 h-4", userVote === 'down' ? "text-white" : "text-slate-500")} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  className="flex items-center gap-1.5 text-slate-500 px-3 py-2 rounded-full font-medium text-sm border border-transparent"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={2} />
                  <span>{postComments.length || 0}</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all px-3 py-2 rounded-full flex items-center gap-1.5"
                >
                  <Share2 className="w-5 h-5" strokeWidth={2} />
                  <span className="hidden sm:inline font-bold text-sm">Share</span>
                </button>
              </div>
          </div>
          
          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="font-bold text-slate-800 mb-4">Comments ({postComments.length})</h3>
            
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="flex-1 flex flex-col items-end gap-2">
                <textarea 
                  rows={2}
                  placeholder="What are your thoughts?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button 
                  disabled={!commentText.trim()}
                  className="bg-indigo-600 disabled:bg-slate-300 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Comment
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {postComments.length > 0 ? postComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">{c.user}</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{c.text}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 glass-card bg-slate-50/50 rounded-2xl border-dashed">
                  <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium">No comments yet. Join the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}
