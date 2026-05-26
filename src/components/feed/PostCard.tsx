import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../services/data";
import { useLocalStorage, useIsMobile } from "../../hooks/useShared";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreHorizontal, UserCircle, IndianRupee, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";
import { requireAuthAction } from "../../lib/auth";

interface PostCardProps {
  post: Post;
  onHide?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onHide }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // States stored in localStorage
  const [upvotes, setUpvotes] = useLocalStorage<Record<string, number>>("expbox_upvotes", {});
  const [downvotes, setDownvotes] = useLocalStorage<Record<string, number>>("expbox_downvotes", {});
  const [follows, setFollows] = useLocalStorage<Record<string, boolean>>("expbox_follows", {});

  const currentUpvotes = upvotes[post.id] ?? (post.initial_upvotes || 0);
  const currentDownvotes = downvotes[post.id] ?? 0;
  const [isFollowing, setIsFollowing] = useState(follows[post.creator_id] || false);

  // User's own vote state
  const [userVotes, setUserVotes] = useLocalStorage<Record<string, 'up' | 'down' | null>>("expbox_user_votes", {});
  const userVote = userVotes[post.id] || null;

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useLocalStorage<any[]>(`expbox_comments_${post.id}`, []);

  // Menu and Save state
  const [showMenu, setShowMenu] = useState(false);
  const [savedPosts, setSavedPosts] = useLocalStorage<string[]>("expbox_saved_posts", []);
  const isSaved = savedPosts.includes(post.id);

  const handleSave = () => {
    if (isSaved) {
      setSavedPosts(prev => prev.filter(id => id !== post.id));
    } else {
      setSavedPosts(prev => [...prev, post.id]);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuthAction(() => {
      if (userVote === 'up') {
        setUserVotes(prev => ({ ...prev, [post.id]: null }));
      } else {
        setUserVotes(prev => ({ ...prev, [post.id]: 'up' }));
      }
    });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuthAction(() => {
      if (userVote === 'down') {
        setUserVotes(prev => ({ ...prev, [post.id]: null }));
      } else {
        setUserVotes(prev => ({ ...prev, [post.id]: 'down' }));
      }
    });
  };

  const displayUpvotes = currentUpvotes + (userVote === 'up' ? 1 : 0);
  const displayDownvotes = currentDownvotes + (userVote === 'down' ? 1 : 0);
  const totalScore = displayUpvotes - displayDownvotes;

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuthAction(() => {
      if (post.is_anonymous) return;
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      setFollows(prev => ({ ...prev, [post.creator_id]: newFollowState }));
    });
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
    requireAuthAction(() => {
      if (!commentText.trim()) return;

      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        user: "You",
        date: new Date().toISOString(),
      };

      setPostComments(prev => [newComment, ...(prev || [])]);
      setCommentText("");
    });
  };

  const displayName = post.is_anonymous ? "Anonymous User" : (post.author_name || "Unknown User");
  
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass-card p-4 sm:p-5 max-sm:rounded-none rounded-2xl max-sm:border-x-0 border border-slate-200 flex flex-col h-full relative",
        showMenu ? "z-50" : "z-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className={cn(
            "flex items-center gap-2",
            !post.is_anonymous && "cursor-pointer hover:opacity-80 transition-opacity"
          )}
          onClick={(e) => {
            if (!post.is_anonymous) {
              e.stopPropagation();
              navigate(post.creator_id === "local_user" ? "/profile" : `/profile/${post.creator_id}`);
            }
          }}
        >
          {post.is_anonymous || !post.author_avatar ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-slate-400" />
            </div>
          ) : (
            <img src={post.author_avatar} alt={displayName} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{displayName}</span>
              {!post.is_anonymous && (
                <button 
                  onClick={handleFollow}
                  className={cn("text-xs font-bold hover:underline", isFollowing ? "text-slate-500" : "text-blue-600")}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            {/* Category / Badge */}
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {post.category} {isMobile && `• ${new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
            </span>
          </div>
        </div>
        
        {/* Mobile Hide/Close Button */}
        {isMobile && onHide && (
          <button 
            onClick={() => onHide(post.id)}
            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content Area - Clickable to expand */}
      <div 
        className="cursor-pointer group/content"
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover/content:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        <div className="mb-4">
          <div className={cn(
            "text-slate-600 text-[15px] leading-relaxed",
          )}>
            <div className="inline">
              {post.teaser}
            </div>
            <span className="text-blue-600 font-bold text-sm inline ml-1 group-hover/content:underline">
              (more)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between">
         {/* Upvote Pill */}
         <div className="flex border border-slate-200 rounded-full overflow-hidden bg-white/50 backdrop-blur-sm">
            <button 
              onClick={handleUpvote}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-200 transition-all active:scale-95",
                userVote === 'up' ? "bg-indigo-600 text-white" : "bg-slate-50 hover:bg-indigo-50"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4", userVote === 'up' ? "text-white fill-white" : "text-indigo-500")} strokeWidth={2.5} />
              <span className={cn("text-xs font-bold", userVote === 'up' ? "text-white" : "text-slate-600")}>{displayUpvotes}</span>
            </button>
            <button 
              onClick={handleDownvote}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 transition-all active:scale-95",
                userVote === 'down' ? "bg-red-600 text-white" : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              <ThumbsDown className={cn("w-4 h-4", userVote === 'down' ? "text-white fill-white" : "text-slate-500")} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex gap-1 md:gap-2">
            <button 
               onClick={() => setShowComments(!showComments)}
               className={cn(
                 "flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all px-3 py-1.5 rounded-full font-medium text-xs md:text-sm",
                 showComments && "text-indigo-600 bg-indigo-50"
               )}
            >
              <MessageCircle className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
              <span>{postComments.length || 0}</span>
            </button>

            <button 
              onClick={handleShare}
              className="text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all p-2 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 hidden sm:flex"
            >
              <Share2 className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2} />
              <span className="text-xs md:text-sm font-medium">Share</span>
            </button>
            <button 
              onClick={handleShare}
              className="text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all p-2 rounded-full sm:hidden"
            >
              <Share2 className="w-5 h-5" strokeWidth={2} />
            </button>

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
                  <div className="absolute right-0 bottom-[calc(100%+8px)] sm:bottom-auto sm:top-full mb-2 w-48 bg-[var(--card-bg)] border border-slate-200 shadow-xl rounded-lg py-1 z-20 overflow-hidden flex flex-col">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); handleSave(); }}
                      className="px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {isSaved ? "Remove Bookmark" : "Bookmark"}
                    </button>
                    {post.creator_id === "local_user" && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); navigate(`/write?edit=${post.id}`); }}
                        className="px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Edit story
                      </button>
                    )}
                    {!isMobile && onHide && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onHide(post.id); }}
                        className="px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Hide story
                      </button>
                    )}
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
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          <form onSubmit={handleComment} className="flex gap-2">
            <input 
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
              Post
            </button>
          </form>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {postComments.length > 0 ? postComments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 bg-slate-50 rounded-xl p-2.5 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-700">{c.user}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 text-xs py-4 italic">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse mb-4 md:mb-0">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full theme-skeleton" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 theme-skeleton rounded" />
            <div className="h-3 w-20 theme-skeleton rounded" />
          </div>
        </div>
      </div>
      <div>
        <div className="h-6 w-3/4 theme-skeleton rounded mb-3" />
        <div className="h-4 w-full theme-skeleton rounded mb-2" />
        <div className="h-4 w-5/6 theme-skeleton rounded mb-4" />
      </div>
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <div className="w-12 h-6 theme-skeleton rounded-full" />
        <div className="w-12 h-6 theme-skeleton rounded-full" />
        <div className="w-12 h-6 theme-skeleton rounded-full" />
      </div>
    </div>
  );
}
