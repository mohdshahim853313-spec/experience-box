import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Lock, X } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { WritePage } from './pages/WritePage';
import { FollowingPage } from './pages/FollowingPage';
import { SpacesPage } from './pages/SpacesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { ReportBugPage } from './pages/ReportBugPage';
import { DonatePage } from './pages/DonatePage';
import { PostPage } from './pages/PostPage';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { initAuth } from './lib/auth';
import { supabase } from './lib/supabase';
import { useRealtimeNotifications } from './hooks/useRealtime';
import { seedDatabaseIfEmpty } from './seedData';

// Fallback pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <Layout>
      <div className="glass-card p-12 rounded-3xl text-center shadow-sm w-full mx-auto max-w-[800px] mt-8">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-2">This page is coming soon to ExperienceBox.</p>
      </div>
    </Layout>
  );
}

function LoginWall() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[99999] bg-[color:var(--bg-primary)] flex items-center justify-center p-4">
      <div className="bg-[color:var(--card-bg)] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-primary)]">Time's Up!</h2>
        <p className="text-[color:var(--text-secondary)] mb-8">
          You've been freely exploring the app. To continue reading and interacting, please log in or create an account.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
        >
          Log In Now
        </button>
      </div>
    </div>
  );
}

function SoftLoginPrompt({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[90000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[color:var(--card-bg)] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-200 dark:border-slate-800 relative">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-primary)]">Welcome!</h2>
        <p className="text-[color:var(--text-secondary)] mb-8">
          Please log in to experience all features, or you can explore the app freely for a bit.
        </p>
        <div className="flex flex-col gap-3">
            <button
              onClick={() => { onClose(); navigate('/login'); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors border-none"
            >
              Log In Now
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[color:var(--text-primary)] font-bold py-3 px-4 rounded-xl transition-colors border border-slate-300 dark:border-slate-600"
            >
              Not Now
            </button>
        </div>
      </div>
    </div>
  );
}

function ActionLoginPrompt({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[90000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[color:var(--card-bg)] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-200 dark:border-slate-800 relative">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-primary)]">Login Required</h2>
        <p className="text-[color:var(--text-secondary)] mb-8">
          You need to login first to perform this action.
        </p>
        <div className="flex flex-col gap-3">
            <button
              onClick={() => { onClose(); navigate('/login'); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors border-none"
            >
              Log In Now
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[color:var(--text-primary)] font-bold py-3 px-4 rounded-xl transition-colors border border-slate-300 dark:border-slate-600"
            >
              Not Now
            </button>
        </div>
      </div>
    </div>
  );
}

function AvatarViewer({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full flex items-center justify-center">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img 
          src={src} 
          alt="Profile Avatar" 
          className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain bg-slate-800" 
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

function AppContent() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [forceLoginWall, setForceLoginWall] = useState(false);
  const [showSoftPrompt, setShowSoftPrompt] = useState(false);
  const [showActionLogin, setShowActionLogin] = useState(false);
  const [avatarViewerSrc, setAvatarViewerSrc] = useState<string | null>(null);
  const [softPromptDismissed, setSoftPromptDismissed] = useState(
    sessionStorage.getItem('expbox_soft_prompt_dismissed') === 'true'
  );
  const location = useLocation();

  const isTrialExpired = sessionStorage.getItem('expbox_trial_expired') === 'true';
  
  // Conditionally show wall during render to avoid flickers
  const ENABLE_TRIAL = false;
  const showLoginWall = ENABLE_TRIAL && userId === null && 
    location.pathname !== '/login' && 
    (forceLoginWall || isTrialExpired);

  useEffect(() => {
    if (userId) {
      seedDatabaseIfEmpty();
    }
  }, [userId]);

  useEffect(() => {
    if (showLoginWall || showSoftPrompt || showActionLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showLoginWall, showSoftPrompt, showActionLogin]);

  // Init Auth and Sync Profile
  useEffect(() => {
    localStorage.removeItem('expbox_trial_expired'); // Cleanup old
    const unsubscribe = initAuth((user) => {
      setUserId(user.id);
      sessionStorage.removeItem('expbox_trial_expired');
      sessionStorage.removeItem('expbox_soft_prompt_dismissed');
      
      // Fetch user profile from database to sync
      if (supabase) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => {
            if (data) {
              // Sync local profile data so navbar/profile page instantly reflect DB
              const existingStr = window.localStorage.getItem("expbox_user_profile");
              const current = existingStr ? JSON.parse(existingStr) : {};
              const updated = {
                ...current,
                name: data.username || user.user_metadata?.display_name || "User",
                avatar: data.avatar_url || user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/notionists/svg?seed=Local",
                bio: data.bio || current.bio || "Building something new."
              };
              window.localStorage.setItem("expbox_user_profile", JSON.stringify(updated));
              window.dispatchEvent(new Event("local-storage"));
            }
          });
      }
    }, () => {
      setUserId(null); // Explicitly null when fully resolved as logged out
    });

    return unsubscribe;
  }, []);

  // Timer logic - DISABLED functionality as per request
  useEffect(() => {
    const ENABLE_TRIAL = false; // Disable times up feature for now
    if (!ENABLE_TRIAL) return;
    
    if (userId === null && location.pathname !== '/login') {
      if (sessionStorage.getItem('expbox_trial_expired')) {
        setForceLoginWall(true);
        return;
      }

      if (!softPromptDismissed) {
        setShowSoftPrompt(true);
      } else {
        const startTimeStr = sessionStorage.getItem('expbox_timer_start');
        const startTime = startTimeStr ? parseInt(startTimeStr, 10) : Date.now();
        if (!startTimeStr) {
           sessionStorage.setItem('expbox_timer_start', startTime.toString());
        }
        
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 120000 - elapsed); // 2 minutes

        const timer = setTimeout(() => {
          sessionStorage.setItem('expbox_trial_expired', 'true');
          setForceLoginWall(true);
        }, remaining);

        return () => clearTimeout(timer);
      }
    } else if (userId === null && location.pathname === '/login') {
      setShowSoftPrompt(false);
    }
  }, [userId, softPromptDismissed, location.pathname]);

  useEffect(() => {
    const handleForceLogin = () => {
      setForceLoginWall(true);
      sessionStorage.setItem('expbox_trial_expired', 'true'); // ensure subsequent renders know
    };
    window.addEventListener('trigger-login-wall', handleForceLogin);
    return () => window.removeEventListener('trigger-login-wall', handleForceLogin);
  }, []);

  useEffect(() => {
    const handleActionLogin = () => {
      setShowActionLogin(true);
    };
    window.addEventListener('trigger-action-login', handleActionLogin);
    return () => window.removeEventListener('trigger-action-login', handleActionLogin);
  }, []);

  useEffect(() => {
    const handleAvatarViewer = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.src) {
        setAvatarViewerSrc(customEvent.detail.src);
      }
    };
    window.addEventListener('trigger-avatar-viewer', handleAvatarViewer);
    return () => window.removeEventListener('trigger-avatar-viewer', handleAvatarViewer);
  }, []);

  // Realtime Notifications integration
  useRealtimeNotifications(userId, (payload) => {
    // Update local storage so navbar badge shows up
    const stored = localStorage.getItem("expbox_notifications");
    let currentNotifs = [];
    if (stored) {
      try {
        currentNotifs = JSON.parse(stored);
      } catch(e) {}
    }
    
    const newNotif = {
      id: payload.id,
      type: payload.type,
      user: {
        name: payload.actor_name || "Someone",
        avatar: payload.actor_avatar || "👤",
      },
      content: payload.content,
      time: "Just now",
      read: false,
    };
    
    localStorage.setItem("expbox_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    
    // Dispatch an event so components using useLocalStorage can sync (like Navbar)
    window.dispatchEvent(new Event("local-storage"));

    if (payload.type === 'comment') {
      toast.success(`New Comment: ${payload.content}`);
    } else if (payload.type === 'like') {
      toast.success(`New Like: ${payload.content}`);
    } else {
      toast.success(payload.content);
    }
  });

  const handleDismissSoftPrompt = () => {
    sessionStorage.setItem('expbox_soft_prompt_dismissed', 'true');
    sessionStorage.setItem('expbox_timer_start', Date.now().toString());
    setSoftPromptDismissed(true);
    setShowSoftPrompt(false);
  };

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />
      {avatarViewerSrc && <AvatarViewer src={avatarViewerSrc} onClose={() => setAvatarViewerSrc(null)} />}
      {showActionLogin && <ActionLoginPrompt onClose={() => setShowActionLogin(false)} />}
      {showSoftPrompt && <SoftLoginPrompt onClose={handleDismissSoftPrompt} />}
      {showLoginWall && <LoginWall />}
      
      {!showLoginWall && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/report-bug" element={<ReportBugPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

