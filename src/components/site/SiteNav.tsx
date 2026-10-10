import { useState, useEffect } from 'react';
import { Car, Menu, X, LogIn } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export type SitePage = 'home' | 'services' | 'locations' | 'about' | 'contact' | 'book';

interface SiteNavProps {
  currentPage: SitePage;
  onNavigate: (page: SitePage) => void;
  onStaffLogin: () => void;
}

const navItems: { id: SitePage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'locations', label: 'Locations' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
];

export default function SiteNav({ currentPage, onNavigate, onStaffLogin }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (page: SitePage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shadow-lg shadow-red-900/20 group-hover:shadow-red-900/40 transition-shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className={`text-xl font-bold transition-colors block ${scrolled ? 'text-slate-900' : 'text-white'}`}>{siteConfig.name}</span>
              <span className={`text-[10px] font-medium transition-colors block ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>{siteConfig.tagline}</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNav(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentPage === item.id ? (scrolled ? 'text-red-600 bg-red-50' : 'text-white bg-white/10') : (scrolled ? 'text-slate-600 hover:text-red-600 hover:bg-slate-50' : 'text-white/80 hover:text-white hover:bg-white/10')}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => handleNav('book')} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-105 transition-all">Book a Service</button>
            <button onClick={onStaffLogin} className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              <LogIn className="w-4 h-4" /> Staff Portal
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700' : 'text-white'}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl border border-slate-100 p-4 mb-4 space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentPage === item.id ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:bg-slate-50'}`}>{item.label}</button>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button onClick={() => handleNav('book')} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg">Book a Service</button>
              <button onClick={() => { onStaffLogin(); setMobileOpen(false); }} className="w-full flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"><LogIn className="w-4 h-4" /> Staff Portal</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
