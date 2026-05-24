import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Share, Image as ImageIcon, ArrowLeft, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { createExperience } from '../services/db';
import { useLocalStorage } from '../hooks/useShared';
import { initAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const CATEGORY_DETAILS = [
  { id: "Experiences", emoji: "🧘‍♂️", name: "Experience", desc: "Personal journey" },
  { id: "Mistakes", emoji: "❌", name: "Mistake", desc: "What went wrong" },
  { id: "Ground Reality", emoji: "🌍", name: "Ground Reality", desc: "Truth vs Hype" },
  { id: "Reality Check", emoji: "🎭", name: "Reality Check", desc: "Expectation vs Reality" },
  { id: "Embarrassing", emoji: "🙈", name: "Embarrassing", desc: "Cringe moments" },
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
              setShowEditor(true);
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
            ['link', 'image'],
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
    const existingPostsStr = localStorage.getItem("expbox_user_posts");
    let existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : [];
    
    // get user from Supabase
    let currentUser = null;
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      currentUser = session?.user;
    }
    
    const uid = currentUser?.id || "local_user";
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
                <div 
                  key={cat.id} 
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer" 
                  onClick={() => { setCategory(cat.id); setShowEditor(true); }}
                >
                  <div className="text-6xl mb-4" style={{filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"}}>{cat.emoji}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                  <p className="text-slate-500 mb-8">{cat.desc}</p>
                  <button className="w-full bg-[#f1f5f9] text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
                     ✍️ Write This
                  </button>
                </div>
              ))}

              <div 
                className="bg-white p-8 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1 hover:border-indigo-200 cursor-pointer" 
                onClick={() => setIsCustomCatOpen(true)}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 mt-2">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Custom</h3>
                <p className="text-slate-500 mb-8">Create your own category</p>
                <button className="w-full bg-[#f1f5f9] text-slate-700 hover:bg-slate-100 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
                    ✨ Add New
                </button>
              </div>
            </div>
            
            {/* Custom Category Modal */}
            {isCustomCatOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 glass-card" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Custom Category</h2>
                    <button onClick={() => setIsCustomCatOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
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
                      <button 
                        type="button"
                        onClick={() => setIsCustomCatOpen(false)}
                        className="flex-1 py-3 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!customCategory.trim()}
                        className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all"
                      >
                        Continue
                      </button>
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
                <button 
                  onClick={() => {
                    if (editId) {
                      navigate(-1);
                    } else {
                      setShowEditor(false);
                    }
                  }}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">Write a Story</h1>
                  <p className="text-sm text-indigo-600 font-medium">in {category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {draftStatus && (
                  <span className="text-xs font-medium text-slate-400 italic">
                    {draftStatus}
                  </span>
                )}
                
                <button 
                  onClick={handlePublish}
                  disabled={!title.trim() || !content.trim() || content === '<p><br></p>'}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm",
                    title.trim() && content.trim() && content !== '<p><br></p>'
                      ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Share className="w-4 h-4" />
                  {editId ? "Save Changes" : "Publish"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {/* Editor Header / Meta */}
              <div className="p-6 sm:p-8 border-b border-slate-100 space-y-4">
                <input
                  type="text"
                  placeholder="Story Title..."
                  className="w-full text-3xl sm:text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
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
