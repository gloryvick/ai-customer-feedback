import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/lib/siteConfig';
import { Mail, Phone, Clock, MapPin, Send, Loader2, CheckCircle2, AlertCircle, Headphones, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

type ContactMethod = 'whatsapp' | 'email' | 'chatbot';

export default function ContactPage() {
  const [method, setMethod] = useState<ContactMethod | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('contact_messages').insert({ name, email, subject, message });
    setSubmitting(false);
    if (insertError) { setError('Failed to send message. Please try again.'); return; }
    setSuccess(true); setName(''); setEmail(''); setSubject(''); setMessage('');
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Hello AutoCare Plus, I would like to get in touch.')}`;

  const contactOptions: { id: ContactMethod; icon: typeof Mail; title: string; desc: string; accent: string; badge: string }[] = [
    { id: 'whatsapp', icon: MessageCircle, title: 'WhatsApp', desc: 'Chat with us instantly on WhatsApp for quick questions, feedback, or complaints.', accent: 'from-emerald-500 to-green-400', badge: 'Fastest response' },
    { id: 'email', icon: Mail, title: 'Email Form', desc: 'Send us a detailed message and we\u2019ll get back to you within 24 hours.', accent: 'from-red-600 to-rose-500', badge: 'For detailed inquiries' },
    { id: 'chatbot', icon: Sparkles, title: 'Talk to Pulse', desc: 'Use our smart chatbot assistant for instant answers about services, branches, and more.', accent: 'from-violet-500 to-purple-400', badge: 'Instant answers' },
  ];

  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-slate-950 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-red-300 uppercase tracking-wide">Contact & Support</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">How can we help you?</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Choose how you\u2019d like to reach us \u2014 WhatsApp, email, or our smart chatbot assistant. We\u2019re here to help.</p>
        </div>
      </section>

      {/* Hotline banner */}
      <section className="py-6 bg-rose-50 border-y border-rose-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2"><Headphones className="w-5 h-5 text-rose-500" /><span className="text-sm font-bold text-slate-700">24/7 Breakdown & Tow Hotline</span></div>
          <a href={`tel:${siteConfig.hotline}`} className="text-lg font-bold text-rose-600 hover:text-rose-700 transition-colors">{siteConfig.hotline} <span className="text-sm font-normal text-slate-500">(24/7 Roadside Assistance)</span></a>
        </div>
      </section>

      {/* Contact method selector */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Step 1: Choose method */}
          {!method && (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose how to contact us</h2>
                <p className="text-sm text-slate-500">Select an option below \u2014 we\u2019ll connect you right away.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setMethod(opt.id)} className="group text-left bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.accent} mb-4 group-hover:scale-110 transition-transform`}>
                      <opt.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{opt.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{opt.badge}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{opt.desc}</p>
                    <span className="flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                      {opt.id === 'whatsapp' ? 'Open WhatsApp' : opt.id === 'email' ? 'Fill Form' : 'Start Chatting'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2a: WhatsApp */}
          {method === 'whatsapp' && (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setMethod(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
              </button>
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Chat on WhatsApp</h2>
                <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">Send us a message on WhatsApp and our team will respond. Perfect for quick questions, feedback, or complaints.</p>
                <div className="bg-white rounded-xl p-4 mb-6 border border-emerald-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">WhatsApp Number</p>
                  <p className="text-lg font-bold text-slate-800">{siteConfig.whatsappDisplay}</p>
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all">
                  <MessageCircle className="w-5 h-5" /> Open WhatsApp
                </a>
                <p className="text-xs text-slate-400 mt-4">You\u2019ll be redirected to WhatsApp with a pre-filled message.</p>
              </div>
            </div>
          )}

          {/* Step 2b: Email form */}
          {method === 'email' && (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setMethod(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
              </button>
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4"><CheckCircle2 className="w-7 h-7 text-emerald-500" /></div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Message sent!</h3>
                    <p className="text-sm text-slate-500 mb-6">We\u2019ll get back to you within 24 hours.</p>
                    <button onClick={() => { setSuccess(false); setMethod(null); }} className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline">Back to contact options</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2"><Mail className="w-5 h-5 text-red-500" /><h3 className="text-lg font-bold text-slate-800">Send us an email</h3></div>
                    {[{ label: 'Name', type: 'text', val: name, set: setName, ph: 'Your name' }, { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@email.com' }, { label: 'Subject', type: 'text', val: subject, set: setSubject, ph: 'How can we help?' }].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                        <input type={f.type} required value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Message</label>
                      <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Tell us more..." className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none" />
                    </div>
                    {error && (<div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100"><AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /><p className="text-sm text-rose-600">{error}</p></div>)}
                    <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-lg shadow-red-900/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Message<Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Step 2c: Chatbot */}
          {method === 'chatbot' && (
            <div className="max-w-2xl mx-auto">
              <button onClick={() => setMethod(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
              </button>
              <div className="bg-violet-50 rounded-2xl border border-violet-200 p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 mx-auto mb-6 shadow-lg shadow-violet-500/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Talk to Pulse</h2>
                <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">Our smart chatbot assistant is available right now. Look for the floating chat icon in the bottom-right corner of your screen and tap it to start chatting instantly.</p>
                <div className="bg-white rounded-xl p-4 mb-6 border border-violet-100 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-400"><Sparkles className="w-4 h-4 text-white" /></div>
                    <p className="text-sm font-bold text-slate-700">Pulse</p>
                  </div>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl rounded-bl-sm px-3.5 py-2.5 border border-slate-100">Hi! I\u2019m Pulse, your AutoCare Plus assistant. I can help you book a service, find a branch, answer questions, or hear your feedback. Tap the chat icon below to start!</p>
                </div>
                <p className="text-sm text-slate-500 mb-2 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online now</span>
                </p>
                <p className="text-xs text-slate-400">Tap the floating <Sparkles className="w-3.5 h-3.5 inline text-violet-400" /> icon in the bottom-right corner to open the chat.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact info section */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Mail, label: 'Email', value: siteConfig.email },
              { icon: Phone, label: 'Central Booking', value: siteConfig.phone },
              { icon: Clock, label: 'Hours', value: siteConfig.hoursFull },
              { icon: MapPin, label: 'Branches', value: 'Lekki · Ikeja · Surulere · Victoria Island' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shrink-0"><item.icon className="w-5 h-5 text-red-600" /></div>
                <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p><p className="text-sm text-slate-600">{item.value}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
