import { useState, useRef, ChangeEvent, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useLocalStorage, useIsMobile } from "../hooks/useShared";
import { Camera, User, Shield, Palette, Settings as SettingsIcon, LogOut, Moon, Sun, Monitor, Info, Mail, FileText, AlertCircle, Bug, Heart, ChevronRight, X, Upload, ArrowLeft, UserPlus, UserCheck, Users } from "lucide-react";
import { cn } from "../lib/utils";
import { MOCK_POSTS } from "../services/data";

const THEMES = [
  { id: "minimal", name: "Light Mode", icon: Sun, color: "bg-slate-500" },
  { id: "midnight", name: "Dark Mode", icon: Moon, color: "bg-slate-800" },
];

const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Shahim",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Alice",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Bob",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Charlie",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Daisy",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Ethan",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Fiona",
  "https://api.dicebear.com/7.x/notionists/svg?seed=George",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Hannah",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Ian",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Jane",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Kevin",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Leo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Maya",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Noah",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Olivia",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Paul",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Quinn",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Ryan",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Sophia",
];

const WRITERS_DB: Record<string, { name: string, email: string, avatar: string, bio: string }> = {
  "user_1": {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@experiencebox.io",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
    bio: "Tech entrepreneur, digital nomad, and former management consultant. Sharing real raw stories of startups."
  },
  "user_2": {
    name: "Michael Chen",
    email: "m.chen@experiencebox.io",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael",
    bio: "Educator & financial planner. Passionate about lifestyle design, slow living, and helping people in their 20s and 30s find balance."
  },
  "user_3": {
    name: "Jessica Walsh",
    email: "jess.walsh@experiencebox.io",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica",
    bio: "Director of Brand Strategy. Explorer of accidental success, corporate lessons, and dealing with chaos beautifully."
  },
  "user_5": {
    name: "David R.",
    email: "david.r@experiencebox.io",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David",
    bio: "Recovering VP in corporate finance. Now building creative writing platforms and mentoring instate creators."
  }
};

const MOCK_PEOPLE_LIST = [
  { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
  { id: "user_2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", bio: "Educator & slow living advocate" },
  { id: "user_3", name: "Jessica Walsh", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica", bio: "Director of Brand Strategy" },
  { id: "user_5", name: "David R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David", bio: "Recovering VP & content creator" },
  { id: "anjali_s", name: "Anjali Sharma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Anjali", bio: "Product Designer @ Meta" },
  { id: "rahul_v", name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rahul", bio: "Startup founder & angel investor" },
  { id: "priya_p", name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", bio: "Senior Engineer. Writing about web dev" },
];

export function ProfilePage() {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useLocalStorage("expbox_theme", "minimal");
  const [user, setUser] = useLocalStorage("expbox_user_profile", {
    name: "Mohd Shahim",
    email: "mohdshahim853313@gmail.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Shahim"
  });
  
  const isOwnProfile = !userId || userId === "local_user";
  const [activeTab, setActiveTab ] = useState<"posts" | "followers" | "following" | null>(null);
  const [follows, setFollows] = useLocalStorage<Record<string, boolean>>("expbox_follows", {});

  const activeUser = useMemo(() => {
    if (isOwnProfile) {
      return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: "Passionate storyteller on ExperienceBox. Sharing my actual, raw, unedited life realities.",
        id: "local_user"
      };
    }
    
    if (userId && WRITERS_DB[userId]) {
      return { ...WRITERS_DB[userId], id: userId };
    }
    
    // Fallback searching in posts
    const localPostsStr = localStorage.getItem('expbox_user_posts');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    const allPosts = [...localPosts, ...MOCK_POSTS];
    const foundPost = allPosts.find(p => p.creator_id === userId);
    
    if (foundPost) {
      return {
        id: userId!,
        name: foundPost.author_name || "Unknown Writer",
        email: `${foundPost.author_name?.toLowerCase().replace(/\s+/g, '') || "writer"}@experiencebox.io`,
        avatar: foundPost.author_avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${userId}`,
        bio: "Contributor on ExperienceBox sharing unedited reality checks and experiences."
      };
    }
    
    return {
      id: userId!,
      name: "Unknown Writer",
      email: "writer@experiencebox.io",
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${userId}`,
      bio: "Storyteller on ExperienceBox."
    };
  }, [userId, isOwnProfile, user]);

  const isFollowingActor = userId ? (follows[userId] || false) : false;
  
  const handleFollowToggle = () => {
    if (isOwnProfile || !userId) return;
    const newFollowState = !isFollowingActor;
    setFollows(prev => ({ ...prev, [userId]: newFollowState }));
  };

  const userStories = useMemo(() => {
    const localPostsStr = localStorage.getItem('expbox_user_posts');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    const allPosts = [...localPosts, ...MOCK_POSTS];
    return allPosts.filter(p => {
      if (isOwnProfile) {
        return p.creator_id === "local_user";
      }
      return p.creator_id === activeUser.id;
    });
  }, [activeUser.id, isOwnProfile]);

  const followersList = useMemo(() => {
    if (isOwnProfile) {
      return [
        { id: "anjali_s", name: "Anjali Sharma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Anjali", bio: "Product Designer @ Meta" },
        { id: "rahul_v", name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rahul", bio: "Startup founder & angel investor" },
        { id: "priya_p", name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", bio: "Senior Engineer. Writing about web dev" },
      ];
    }
    
    const list = [
      { id: "anjali_s", name: "Anjali Sharma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Anjali", bio: "Product Designer @ Meta" },
    ];
    
    if (activeUser.id !== "user_2") {
      list.push({ id: "user_2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", bio: "Educator & slow living advocate" });
    } else {
      list.push({ id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" });
    }
    
    if (isFollowingActor) {
      list.push({
        id: "local_user",
        name: user.name,
        avatar: user.avatar,
        bio: "Passionate storyteller on ExperienceBox. Sharing actual raw life realities."
      });
    }
    
    return list;
  }, [isOwnProfile, activeUser.id, isFollowingActor, user]);

  const followingList = useMemo(() => {
    if (isOwnProfile) {
      const followedList: any[] = [];
      MOCK_PEOPLE_LIST.forEach(person => {
        if (follows[person.id] === true) {
          followedList.push(person);
        }
      });
      if (followedList.length === 0) {
        return [
          { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
          { id: "user_2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", bio: "Educator & slow living advocate" }
        ];
      }
      return followedList;
    }
    
    const defaultFollowing: Record<string, any[]> = {
      "user_1": [
        { id: "user_3", name: "Jessica Walsh", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica", bio: "Director of Brand Strategy" },
        { id: "user_5", name: "David R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David", bio: "Recovering VP in corporate finance" },
      ],
      "user_2": [
        { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
        { id: "user_5", name: "David R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David", bio: "Recovering VP in corporate finance" },
      ],
      "user_3": [
        { id: "user_2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", bio: "Educator & slow living advocate" },
        { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
      ],
      "user_5": [
        { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
        { id: "user_3", name: "Jessica Walsh", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jessica", bio: "Director of Brand Strategy" },
      ],
    };
    return defaultFollowing[activeUser.id] || [
      { id: "user_1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", bio: "Tech entrepreneur, digital nomad" },
      { id: "user_2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", bio: "Educator & slow living advocate" }
    ];
  }, [isOwnProfile, activeUser.id, follows]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setPendingAvatar(dataUrl);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const saveAvatar = () => {
    setUser({ ...user, avatar: pendingAvatar });
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto w-full px-4 py-8 space-y-6">
        
        {/* Navigation back and header */}
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          {!isOwnProfile && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Writer Profile
            </span>
          )}
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center">
          <div 
            className={cn(
              "relative mb-4 group",
              isOwnProfile ? "cursor-pointer" : "cursor-default"
            )} 
            onClick={() => { 
              if (isOwnProfile) {
                setPendingAvatar(user.avatar); 
                setIsModalOpen(true); 
              }
            }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
              <img src={activeUser.avatar} alt={activeUser.name} className="w-full h-full object-cover" />
            </div>
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[color:var(--text-primary)]">{activeUser.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{activeUser.email}</p>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed mt-2">{activeUser.bio}</p>

          {/* Follow Button for Other User Profiles */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={cn(
                "mt-6 px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95",
                isFollowingActor 
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-slate-100" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
              )}
            >
              {isFollowingActor ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow Writer
                </>
              )}
            </button>
          )}

          {/* Stats Summary Bar */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 w-full justify-center">
            <button 
              onClick={() => setActiveTab("posts")} 
              className={cn("flex flex-col items-center transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50", activeTab === "posts" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400")}
            >
              <span className="text-xl font-extrabold">{userStories.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Stories</span>
            </button>
            <button 
              onClick={() => setActiveTab("followers")} 
              className={cn("flex flex-col items-center transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50", activeTab === "followers" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400")}
            >
              <span className="text-xl font-extrabold">{followersList.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Followers</span>
            </button>
            <button 
              onClick={() => setActiveTab("following")} 
              className={cn("flex flex-col items-center transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50", activeTab === "following" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400")}
            >
              <span className="text-xl font-extrabold">{followingList.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Following</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Panel */}
        {activeTab && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            {/* Current Tab List Render */}
            <div className="space-y-4">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {userStories.length > 0 ? userStories.map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => navigate(`/post/${story.id}`)}
                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100/70 dark:hover:border-indigo-500/30 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {story.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(story.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {story.teaser}
                    </p>
                  </div>
                )) : (
                  <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-sm">No stories posted yet by this creator.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {followersList.length > 0 ? followersList.map(follower => (
                  <div 
                    key={follower.id}
                    onClick={() => {
                      if (follower.id === "local_user") {
                        navigate("/profile");
                      } else {
                        navigate(`/profile/${follower.id}`);
                        setActiveTab("posts");
                      }
                    }}
                    className="p-4 rounded-2xl flex items-center justify-between gap-3 border border-slate-150 hover:border-indigo-150 dark:border-slate-800 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img src={follower.avatar} alt={follower.name} className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-700 object-cover flex-shrink-0 bg-slate-50 dark:bg-slate-800" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">
                          {follower.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{follower.bio}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 flex-shrink-0" />
                  </div>
                )) : (
                  <div className="text-center py-10 col-span-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 w-full bg-white/50 dark:bg-slate-900/20">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-sm">No followers yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {followingList.length > 0 ? followingList.map(person => (
                  <div 
                    key={person.id}
                    onClick={() => {
                      if (person.id === "local_user") {
                        navigate("/profile");
                      } else {
                        navigate(`/profile/${person.id}`);
                        setActiveTab("posts");
                      }
                    }}
                    className="p-4 rounded-2xl flex items-center justify-between gap-3 border border-slate-150 hover:border-indigo-150 dark:border-slate-800 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full border border-slate-100 dark:border-slate-700 object-cover flex-shrink-0 bg-slate-50 dark:bg-slate-800" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">
                          {person.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{person.bio}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 flex-shrink-0" />
                  </div>
                )) : (
                  <div className="text-center py-10 col-span-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 w-full bg-white/50 dark:bg-slate-900/20">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium text-sm">Not following anyone yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Local user profile modifications modal */}
        {isOwnProfile && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-full rounded-3xl shadow-2xl flex flex-col glass-card border border-slate-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-900">Choose Profile Picture</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-100 shadow-md overflow-hidden mb-4 bg-slate-50">
                    <img src={pendingAvatar} alt="Pending Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-indigo-600 font-semibold px-4 py-2 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload from device
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                </div>

                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Or choose an avatar</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {PREDEFINED_AVATARS.map((avatar, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setPendingAvatar(avatar)}
                        className={cn(
                          "w-full aspect-square rounded-full overflow-hidden border-2 transition-all p-1",
                          pendingAvatar === avatar ? "border-indigo-600 bg-indigo-50" : "border-transparent hover:bg-slate-100"
                        )}
                      >
                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 flex-shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveAvatar}
                  className="flex-1 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Grid (Only visible on own settings page) */}
        {isOwnProfile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Palette className="w-5 h-5" />
                  <h2 className="font-bold">App Theme</h2>
                </div>
                <div className="space-y-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        theme === t.id 
                          ? "border-indigo-600 bg-indigo-50/50" 
                          : "border-slate-200 hover:bg-white/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg text-white", t.color)}>
                          <t.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-800">{t.name}</span>
                      </div>
                      {theme === t.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <SettingsIcon className="w-5 h-5" />
                  <h2 className="font-bold">Account Settings</h2>
                </div>
                <button className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-white/50 rounded-xl transition-all">
                    <Shield className="w-5 h-5 opacity-60" />
                    <span className="font-medium">Privacy Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout Session</span>
                </button>
              </div>
            </div>

            {/* About & Support (Only visible on own profile) */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Info className="w-5 h-5" />
                <h2 className="font-bold">About & Support</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/about" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 opacity-60" />
                    <span className="font-medium">About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <Link to="/contact" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 opacity-60" />
                    <span className="font-medium">Contact Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <Link to="/privacy" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 opacity-60" />
                    <span className="font-medium">Privacy Policy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <Link to="/terms" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 opacity-60" />
                    <span className="font-medium">Terms & Conditions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <Link to="/disclaimer" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 opacity-60" />
                    <span className="font-medium">Disclaimer</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                
                <Link to="/report-bug" className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <Bug className="w-5 h-5 text-red-500 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Report a Bug</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link to="/donate" className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:shadow-sm rounded-xl font-bold transition-all">
                  <Heart className="w-5 h-5 fill-rose-600" />
                  <span>Donate to keep us going</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
