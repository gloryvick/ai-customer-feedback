import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const welcomeMessage: ChatMessage = {
  role: 'assistant',
  content: "Hi! I'm Pulse, your AutoCare Plus assistant. I can help you book a service, find a branch, answer questions about our services, or hear your feedback. How can I help you today?",
};

const quickPrompts = ['Book a service', 'What services do you offer?', 'Where are your branches?', 'What are your hours?'];

function generateResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) return "Great! You can book a service online by clicking the 'Book a Service' button in the navigation. Choose your preferred branch, service type, and date — our branch service advisor will verify bay timing with you.";
  if (lower.includes('service') || lower.includes('offer') || lower.includes('do you')) return "We offer 8 services: Oil & Filter Change, Brake Service & Pad Replacement, Battery Service & Electrical Testing, AC Service & Climate Control, Wheel Alignment & Balancing, Computerized Diagnostics, Suspension & Steering Repair, and Engine Tune-Up. Which service interests you?";
  if (lower.includes('location') || lower.includes('branch') || lower.includes('where') || lower.includes('address')) return "We have 4 branches across Lagos: Lekki Phase 1 (Plot 14 Admiralty Way), Ikeja (42 Mobolaji Bank Anthony Way), Surulere (88 Adeniran Ogunsanya St), and Victoria Island (25 Adeola Odeku St). Check the Locations page for more details!";
  if (lower.includes('hour') || lower.includes('open') || lower.includes('time')) return "Our hours are Monday through Saturday, 8:00 AM – 6:00 PM. We're closed on Sundays. You can book online anytime!";
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return "All service costs are provided via clear, itemized custom estimates following an initial diagnostic inspection by our certified technicians. No surprise invoices! Book a diagnostic for an accurate quote.";
  if (lower.includes('feedback') || lower.includes('review') || lower.includes('complaint') || lower.includes('visit')) return "We value your feedback! You can share your experience through our Contact page. Every review helps us improve our service quality.";
  if (lower.includes('tow') || lower.includes('breakdown') || lower.includes('emergency') || lower.includes('roadside')) return "For 24/7 breakdown and tow assistance, call our hotline at +234 (0) 1 234 9999. We're here to help anytime, day or night.";
  if (lower.includes('warranty') || lower.includes('guarantee')) return "All our work is backed by a multi-branch warranty. Service done at any of our 4 locations is honored at all four branches — Lekki, Ikeja, Surulere, and Victoria Island.";
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('call')) return "You can reach us at +234 (0) 1 234 5678 for central booking, or support@autocareplus.example. For 24/7 roadside assistance, call +234 (0) 1 234 9999.";
  if (lower.includes('thank')) return "You're welcome! Is there anything else I can help you with?";
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) return "Hello! Welcome to AutoCare Plus. How can I help you today?";
  return "I'm here to help with booking services, finding branches, answering questions about our services, or hearing your feedback. Could you tell me a bit more about what you're looking for?";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: generateResponse(text) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); handleSend(input); };

  return (
    <>
      <button onClick={() => setOpen(!open)} className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${open ? 'bg-slate-700 rotate-90' : 'bg-gradient-to-br from-red-600 to-rose-500 hover:scale-110 shadow-red-900/30'}`}>
        {open ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white animate-pulse" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-red-600 to-rose-500">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm"><Sparkles className="w-5 h-5 text-white" /></div>
            <div className="flex-1"><p className="text-sm font-bold text-white">Talk to Pulse</p><p className="text-xs text-red-100 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />Online now</p></div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-white" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-500 shrink-0 mr-2"><Sparkles className="w-3.5 h-3.5 text-white" /></div>}
                <div className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm shadow-sm'}`}>{msg.content}</div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-500 shrink-0"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
                <div className="flex items-center gap-1 px-3.5 py-3 bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm">
                  {[0, 150, 300].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => handleSend(prompt)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition-all">{prompt}</button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 bg-white">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all" />
            <button type="submit" disabled={typing || !input.trim()} className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-white disabled:opacity-40 hover:scale-105 transition-all shrink-0">
              {typing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
