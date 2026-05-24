import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
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

export default function App() {
  const [userId, setUserId] = useState<string | undefined>();

  // Init Auth and Sync Profile
  useEffect(() => {
    const unsubscribe = initAuth((user) => {
      setUserId(user.id);
      
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
      setUserId(undefined);
    });

    return unsubscribe;
  }, []);

  // Realtime Notifications integration
  useRealtimeNotifications(userId, (payload) => {
    if (payload.type === 'comment') {
      toast.success(`Someone commented on a post!`);
    } else if (payload.type === 'like') {
      toast.success(`Someone liked a post!`);
    }
  });

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" />
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
    </BrowserRouter>
  );
}

