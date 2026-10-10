import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '@/lib/auth';
import AuthPage from '@/components/AuthPage';
import Website from '@/components/site/Website';
import FeedbackPage from '@/components/site/FeedbackPage';
import App from '@/App';
import './index.css';

type AppView = 'website' | 'dashboard' | 'feedback';

function Root() {
  const { session, loading } = useAuth();
  const [view, setView] = useState<AppView>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard') return 'dashboard';
    if (hash === 'feedback') return 'feedback';
    return 'website';
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard') setView('dashboard');
      else if (hash === 'feedback') setView('feedback');
      else setView('website');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const goToDashboard = () => {
    window.location.hash = 'dashboard';
    setView('dashboard');
  };

  const goToWebsite = () => {
    window.location.hash = '';
    setView('website');
  };

  if (view === 'feedback') {
    return <FeedbackPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-red-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    if (!session) {
      return <AuthPage onBackToSite={goToWebsite} />;
    }
    return <App onExitToSite={goToWebsite} />;
  }

  return <Website onStaffLogin={goToDashboard} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);
