import { siteConfig, stats, standardOfService, processSteps, images } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';
import { Sparkles, Shield, Target, Users, ArrowRight, ScanLine, FileText, Smartphone, Building2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: SitePage) => void;
}

const values = [
  { icon: ScanLine, title: 'Diagnostic First', desc: 'Every vehicle gets a computerized scan and multi-point inspection before any repair recommendation.' },
  { icon: Shield, title: 'Transparency', desc: 'Clear pricing, honest diagnostics, and open communication. You always know what you\'re paying for and why.' },
  { icon: Target, title: 'Precision', desc: 'Certified technicians, state-of-the-art equipment, and computerized diagnostics ensure we get it right the first time.' },
  { icon: Users, title: 'Community', desc: 'Proudly serving Lagos with four branches. We treat every customer like a neighbor, because you are.' },
];

const standardIcons = [ScanLine, FileText, Smartphone, Building2];

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-slate-950 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-red-300 uppercase tracking-wide">About Us</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Automotive Precision & Trust</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Reliable car care without the guesswork. We deliver dealership-grade diagnostics, certified technician expertise, and upfront digital inspections across Lagos.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
              <p className="text-slate-500 leading-relaxed mb-4">{siteConfig.name} was founded with a simple mission: bring transparency and precision to auto repair in Lagos. No more guesswork, no more surprise invoices.</p>
              <p className="text-slate-500 leading-relaxed mb-4">Today, we operate four modern service branches across Lagos, staffed by certified technicians and equipped with computerized diagnostic tools. Every service follows our diagnostic-first policy — we inspect, we explain, you approve, then we repair.</p>
              <p className="text-slate-500 leading-relaxed mb-6">With our multi-branch warranty, work done at any location is backed at all four. That's our commitment to quality.</p>
              <button onClick={() => onNavigate('contact')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-lg shadow-red-900/20 hover:scale-105 transition-all">Get in Touch<ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl"><img src={images.about} alt={images.aboutAlt} className="w-full h-96 object-cover" /></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (<div key={stat.label} className="text-center"><p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">{stat.value}</p><p className="text-sm text-slate-500 mt-2">{stat.label}</p></div>))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Our core values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="flex items-start gap-4 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shrink-0"><value.icon className="w-6 h-6 text-white" /></div>
                <div><h3 className="text-lg font-bold text-slate-800 mb-1">{value.title}</h3><p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Standard of Service</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Our commitments to you</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardOfService.map((item, idx) => {
              const Icon = standardIcons[idx] ?? Shield;
              return (
                <div key={item.title} className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 mb-4"><Icon className="w-6 h-6 text-white" /></div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Frictionless Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">How {siteConfig.name} Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.num}><div className="text-5xl font-bold text-red-100 mb-3">{step.num}</div><h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3><p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Experience the {siteConfig.name} difference</h2>
          <p className="text-slate-500 mb-8">Join thousands of Lagos drivers who trust us with their vehicles.</p>
          <button onClick={() => onNavigate('book')} className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-xl shadow-red-900/30 hover:scale-105 transition-all">Book a Service<ArrowRight className="w-5 h-5" /></button>
        </div>
      </section>
    </div>
  );
}
