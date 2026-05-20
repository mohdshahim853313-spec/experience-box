import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';

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
  return (
    <BrowserRouter>
      <ScrollToTop />
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
      </Routes>
    </BrowserRouter>
  );
}

