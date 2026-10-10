import { useEffect, useState } from 'react';
import SiteNav, { SitePage } from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import HomePage from '@/components/site/HomePage';
import ServicesPage from '@/components/site/ServicesPage';
import LocationsPage from '@/components/site/LocationsPage';
import AboutPage from '@/components/site/AboutPage';
import ContactPage from '@/components/site/ContactPage';
import BookPage from '@/components/site/BookPage';
import ChatbotWidget from '@/components/site/ChatbotWidget';

interface WebsiteProps {
  onStaffLogin: () => void;
}

export default function Website({ onStaffLogin }: WebsiteProps) {
  const [page, setPage] = useState<SitePage>('home');

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const handleNavigate = (p: SitePage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNav currentPage={page} onNavigate={handleNavigate} onStaffLogin={onStaffLogin} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={handleNavigate} />}
        {page === 'services' && <ServicesPage onNavigate={handleNavigate} />}
        {page === 'locations' && <LocationsPage onNavigate={handleNavigate} />}
        {page === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {page === 'contact' && <ContactPage />}
        {page === 'book' && <BookPage onNavigate={handleNavigate} />}
      </main>
      <SiteFooter onNavigate={handleNavigate} />
      <ChatbotWidget />
    </div>
  );
}
