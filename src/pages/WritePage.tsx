import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout } from '../components/layout/Layout';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Share, Image as ImageIcon, ArrowLeft, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { createExperience } from '../services/db';
import { useLocalStorage } from '../hooks/useShared';
import { initAuth, requireAuthAction } from '../lib/auth';
import { supabase } from '../lib/supabase';

const CATEGORY_DETAILS = [
  { id: "Experiences", emoji: "🧘‍♂️", bg: "bg-amber-100", name: "Experience", desc: "Personal journey" },
  { id: "Mistakes", emoji: "❌", bg: "bg-red-100", name: "Mistake", desc: "What went wrong" },
  { id: "Ground Reality", emoji: "🌍", bg: "bg-emerald-100", name: "Ground Reality", desc: "Truth vs Hype" },
  { id: "Reality Check", emoji: "🎭", bg: "bg-purple-100", name: "Reality Check", desc: "Expectation vs Reality" },
  { id: "Embarrassing", emoji: "🙈", bg: "bg-pink-100", name: "Embarrassing", desc: "Cringe moments" },
];

export function WritePage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [isCustomCatOpen, setIsCustomCatOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [draftStatus, setDraftStatus] = useState<'Draft saved' | 'Saving...' | ''>('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const navigate = useNavigate();
  const [user] = useLocalStorage("expbox_user_profile", {
    name: "Mohd Shahim",
    email: "mohdshahim853313@gmail.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Shahim"
  });

  useEffect(() => {
    if (editId) {
      const existingPostsStr = localStorage.getItem("expbox_user_posts");
      const existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : [];
      const postToEdit = existingPosts.find((p: any) => p.id === editId);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content || '');
        setCategory(postToEdit.category);
        setShowEditor(true);
      }
    }
  }, [editId]);

  // Load Draft
  useEffect(() => {
    if (!editId) {
      const savedDraft = localStorage.getItem('expbox_write_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.title || draft.content) {
            setTitle(draft.title || '');
            setContent(draft.content || '');
            if (draft.category) {
              setCategory(draft.category);
            }
          }
        } catch(e) {}
      }
    }
  }, []);

  // Auto-Save Draft
  useEffect(() => {
    if (!showEditor || editId || (!title.trim() && !content.trim())) return;

    setDraftStatus('Saving...');
    const timer = setTimeout(() => {
      const draft = {
        title,
        content,
        category,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('expbox_write_draft', JSON.stringify(draft));
      
      setDraftStatus('Draft saved');
      setTimeout(() => {
        setDraftStatus('');
      }, 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, content, category, showEditor, editId]);

  const CATEGORIES = [
    "Reality Check",
    "Mistakes",
    "Embarrassing",
    "Ground Reality",
    "Experiences"
  ];

  useEffect(() => {
    if (showEditor && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Tell your unedited, raw reality...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link'],
            ['clean']
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        setContent(quillRef.current?.root.innerHTML || '');
      });
      
      // If content was restored or already exists, set it
      if (content) {
        quillRef.current.root.innerHTML = content;
      }
    }
  }, [showEditor]);

  const handlePublish = async () => {
    requireAuthAction(async () => {
      const existingPostsStr = localStorage.getItem("expbox_user_posts");
      let existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : [];
      
      // get user from Supabase
      let currentUser = null;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        currentUser = session?.user;
      }
      
      const uid = currentUser?.id || "11111111-1111-1111-1111-111111111111";
      const authorName = currentUser?.user_metadata?.display_name || user?.name || "Local User";
      const authorAvatar = currentUser?.user_metadata?.avatar_url || user?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Local";

      if (editId) {
        existingPosts = existingPosts.map((p: any) => {
          if (p.id === editId) {
            const updated = {
              ...p,
              title: title.trim(),
              teaser: quillRef.current?.getText().substring(0, 200) + "...",
              content: content,
              category: category,
            };
            if (currentUser) {
              // Note: In a full app we'd call an update function on DB here
              createExperience(updated, editId).catch(console.error);
            }
            return updated;
          }
          return p;
        });
      } else {
        const newPostId = "u_" + Date.now().toString();
        const newPost = {
          title: title.trim(),
          teaser: quillRef.current?.getText().substring(0, 200) + "...",
          content: content,
          category: category,
          price: 0,
          created_at: new Date().toISOString(),
          creator_id: uid,
          is_anonymous: false,
          author_name: authorName,
          author_avatar: authorAvatar
        };
        
        if (currentUser) {
          await createExperience(newPost as any, newPostId);
        }
        existingPosts.push({ id: newPostId, ...newPost });
      }
      
      if (!editId) {
        localStorage.removeItem('expbox_write_draft');
      }
      localStorage.setItem("expbox_user_posts", JSON.stringify(existingPosts));
      navigate("/");
    });
  };
  
  const handleCustomCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim()) {
      setCategory(customCategory.trim());
      setIsCustomCatOpen(false);
      setShowEditor(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto w-full px-4 sm:px-0 mb-12 py-8 sm:py-0">
        {!showEditor ? (
          <div>
            <div className="text-center mb-10 mt-4 sm:mt-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Choose Category</h1>
              <p className="text-slate-500 text-lg">What would you like to share today?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {CATEGORY_DETAILS.map(cat => (
                <motion.div 
                  key={cat.id} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer" 
                  onClick={() => { setCategory(cat.id); setShowEditor(true); }}
                >
                  <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110", cat.bg)} style={{filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"}}>
                    <span className="text-4xl">{cat.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                  <p className="text-slate-500 mb-8">{cat.desc}</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="w-full bg-indigo-50/30 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                     ✍️ Write This
                  </motion.button>
                </motion.div>
              ))}

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white p-8 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center text-center hover:border-indigo-200 cursor-pointer" 
                onClick={() => setIsCustomCatOpen(true)}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 mt-2">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Custom</h3>
                <p className="text-slate-500 mb-8">Create your own category</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="w-full bg-indigo-50/30 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    ✨ Add New
                </motion.button>
              </motion.div>
            </div>
            
            {/* Custom Category Modal */}
            {isCustomCatOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 glass-card" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Custom Category</h2>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      onClick={() => setIsCustomCatOpen(false)} 
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 rounded-full transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <form onSubmit={handleCustomCategorySubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Category Name</label>
                      <input 
                        type="text" 
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Daily Thoughts"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        type="button"
                        onClick={() => setIsCustomCatOpen(false)}
                        className="flex-1 py-3 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        type="submit"
                        disabled={!customCategory.trim()}
                        className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-colors"
                      >
                        Continue
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  onClick={() => {
                    if (editId) {
                      navigate(-1);
                    } else {
                      setShowEditor(false);
                    }
                  }}
                  className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 rounded-full transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">Write a Story</h1>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">in {category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {draftStatus && (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">
                    {draftStatus}
                  </span>
                )}
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  onClick={handlePublish}
                  disabled={!title.trim() || !content.trim() || content === '<p><br></p>'}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm",
                    title.trim() && content.trim() && content !== '<p><br></p>'
                      ? "bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none hover:bg-indigo-700" 
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                  )}
                >
                  <Share className="w-4 h-4" />
                  {editId ? "Save Changes" : "Publish"}
                </motion.button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
              {/* Editor Header / Meta */}
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 space-y-4 transition-colors">
                <input
                  type="text"
                  placeholder="Story Title..."
                  className="w-full text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none bg-transparent transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Editor Body */}
              <div className="write-editor">
                <div ref={editorRef} className="h-[400px] border-0" />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
