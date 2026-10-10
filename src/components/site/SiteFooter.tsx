import { Car, Mail, Phone, Clock, MapPin, Facebook, Instagram, Twitter, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';

interface SiteFooterProps {
  onNavigate: (page: SitePage) => void;
}

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500"><Car className="w-5 h-5 text-white" /></div>
              <div className="leading-tight"><span className="text-xl font-bold text-white block">{siteConfig.name}</span><span className="text-[10px] text-slate-500 block">Automotive Precision & Trust</span></div>
            </div>
            <p className="text-sm leading-relaxed mb-4">Reliable car care without the guesswork. Dealership-grade diagnostics, certified technician expertise, and upfront digital inspections across Lagos.</p>
            <p className="text-xs text-slate-500 mb-2">{siteConfig.hoursFull}</p>
            <p className="text-xs text-slate-500">Central Booking: {siteConfig.phone}</p>
            <p className="text-xs text-slate-500">{siteConfig.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Core Services</h4>
            <ul className="space-y-2">
              <li className="text-sm">Oil & Filter Change</li><li className="text-sm">Brake Service & Pad Replacement</li><li className="text-sm">Battery Service & Electrical Testing</li><li className="text-sm">AC Service & Climate Control</li><li className="text-sm">Wheel Alignment & Balancing</li><li className="text-sm">Computerized Diagnostics</li>
            </ul>
            <button onClick={() => onNavigate('services')} className="text-xs font-medium text-red-400 hover:text-red-300 mt-3 flex items-center gap-1">View All Services →</button>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Our 4 Branches</h4>
            <ul className="space-y-3">
              <li className="text-xs text-slate-500"><p className="text-sm text-slate-300 font-medium">Lekki Phase 1 Center</p>Plot 14 Admiralty Way, Lekki Phase 1, Lagos</li>
              <li className="text-xs text-slate-500"><p className="text-sm text-slate-300 font-medium">Ikeja Commercial Hub Center</p>42 Mobolaji Bank Anthony Way, Ikeja, Lagos</li>
              <li className="text-xs text-slate-500"><p className="text-sm text-slate-300 font-medium">Surulere Central Workshop</p>88 Adeniran Ogunsanya Street, Surulere, Lagos</li>
              <li className="text-xs text-slate-500"><p className="text-sm text-slate-300 font-medium">Victoria Island Express Center</p>25 Adeola Odeku Street, Victoria Island, Lagos</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Company & Portals</h4>
            <ul className="space-y-2">
              {([['about', 'About AutoCare Plus'], ['contact', 'Contact & Support'], ['book', 'Book a Service Request'], ['contact', 'Customer Feedback Survey']] as [SitePage, string][]).map(([id, label], i) => (
                <li key={i}><button onClick={() => onNavigate(id)} className="text-sm hover:text-white transition-colors">{label}</button></li>
              ))}
            </ul>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Icon className="w-4 h-4 text-white" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 {siteConfig.name}. All rights reserved. Precision vehicle servicing & diagnostics.</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>ISO-Aligned Diagnostic Protocols</span>
            <span>•</span>
            <span>Certified Technicians</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
