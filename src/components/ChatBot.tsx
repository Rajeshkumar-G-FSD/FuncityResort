import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Check, CalendarCheck } from 'lucide-react';
import { answerFor, greetingByTime, QUICK_REPLIES } from '../data/botKnowledge';

export interface ChatLead {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
}

interface ChatBotProps {
  onBookNow: (lead: ChatLead) => void;
}

type Step = 'chat' | 'name' | 'phone' | 'whatsapp' | 'whatsappNum' | 'email' | 'ready';

const WA_SAME_CHIP = 'Yes — same as mobile';
const WA_DIFF_CHIP = 'No — different number';

interface Msg {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
  action?: 'book';
}

const now = () =>
  new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

const digits = (s: string) => s.replace(/[^\d]/g, '');
const isMobile10 = (s: string) => digits(s).length === 10;
const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s.trim());
const bookingIntent = (s: string) =>
  /\b(book|booking|reserve|reservation|book a room|book now)\b/i.test(s);

export const ChatBot: React.FC<ChatBotProps> = ({ onBookNow }) => {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>('chat');
  const [lead, setLead] = useState<ChatLead>({ name: '', phone: '', whatsapp: '', email: '' });

  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const push = (m: Omit<Msg, 'id' | 'time'>) =>
    setMessages((prev) => [...prev, { ...m, id: ++idRef.current, time: now() }]);

  const botSay = (text: string, action?: 'book') => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ from: 'bot', text, action });
    }, 550 + Math.min(text.length * 6, 700));
  };

  // greet on first open
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      push({
        from: 'bot',
        text: `${greetingByTime()}! 👋 Welcome to Funcity Resort, Ooty.\nAsk me anything about the rooms, rates, location or booking — or tap a button below.`,
      });
    }
  }, [open, greeted]);

  // autoscroll
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  const beginCapture = () => {
    setStep('name');
    botSay("Great — let's get you booked. What's your full name?");
  };

  const handleUser = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    push({ from: 'user', text });

    if (step !== 'chat' && /^(cancel|stop|later)$/i.test(text)) {
      setStep('chat');
      botSay('No problem — ask me anything, or tap “Book a room” whenever you’re ready.');
      return;
    }

    switch (step) {
      case 'chat':
        if (bookingIntent(text)) beginCapture();
        else botSay(answerFor(text));
        break;

      case 'name':
        if (text.replace(/[^a-z ]/gi, '').trim().length < 2) {
          botSay('Please share your name as it should appear on the booking.');
          return;
        }
        setLead((l) => ({ ...l, name: text }));
        setStep('phone');
        botSay(`Thanks ${text.split(' ')[0]}! Type your 10-digit mobile number — it sends on its own.`);
        break;

      case 'phone': {
        if (!isMobile10(text)) {
          botSay('Please enter a valid 10-digit mobile number.');
          return;
        }
        const mob = digits(text).slice(-10);
        setLead((l) => ({ ...l, phone: mob, whatsapp: mob }));
        setStep('whatsapp');
        botSay('Is your WhatsApp number the same as this mobile number?');
        break;
      }

      case 'whatsapp': {
        if (/^(y|yes|same|correct|ya|✅)/i.test(text) || text === WA_SAME_CHIP) {
          setLead((l) => ({ ...l, whatsapp: l.phone }));
          setStep('email');
          botSay('And your email id? (optional — reply “skip” if you’d rather not)');
        } else if (isMobile10(text)) {
          setLead((l) => ({ ...l, whatsapp: digits(text).slice(-10) }));
          setStep('email');
          botSay('And your email id? (optional — reply “skip” if you’d rather not)');
        } else if (/^(n|no|different|not)/i.test(text) || text === WA_DIFF_CHIP) {
          setStep('whatsappNum');
          botSay('Please enter your 10-digit WhatsApp number.');
        } else {
          botSay('Reply “yes”, tap a button, or type your 10-digit WhatsApp number.');
        }
        break;
      }

      case 'whatsappNum': {
        if (!isMobile10(text)) {
          botSay('Please enter a valid 10-digit WhatsApp number.');
          return;
        }
        setLead((l) => ({ ...l, whatsapp: digits(text).slice(-10) }));
        setStep('email');
        botSay('And your email id? (optional — reply “skip” if you’d rather not)');
        break;
      }

      case 'email': {
        const skip = /^(skip|no|none|later|na|n\/a)$/i.test(text);
        if (!skip && !isEmail(text)) {
          botSay('Please enter a valid email (e.g. name@example.com), or reply “skip”.');
          return;
        }
        const finalLead: ChatLead = { ...lead, email: skip ? '' : text.trim() };
        setLead(finalLead);
        setStep('ready');
        setTyping(true);
        window.setTimeout(() => {
          setTyping(false);
          const emailLine = finalLead.email ? `\n✉️ ${finalLead.email}` : '';
          const waLine =
            finalLead.whatsapp === finalLead.phone
              ? `\n📞 ${finalLead.phone} (mobile & WhatsApp)`
              : `\n📞 ${finalLead.phone} (mobile)\n💬 ${finalLead.whatsapp} (WhatsApp)`;
          push({
            from: 'bot',
            text: `All set!\n\n👤 ${finalLead.name}${waLine}${emailLine}\n\nTap Book Now to choose your dates and rooms.`,
            action: 'book',
          });
        }, 600);
        break;
      }

      default:
        botSay(answerFor(text));
    }
  };

  const onQuick = (q: string) => {
    if (q === 'Book a room') {
      push({ from: 'user', text: q });
      if (step === 'chat') beginCapture();
      return;
    }
    handleUser(q); // works for WhatsApp yes/no chips too
  };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = input;
    setInput('');
    handleUser(v);
  };

  const doBook = () => {
    onBookNow(lead);
    setOpen(false);
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Funcity Resort"
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ff3b30] border-2 border-white" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[380px] h-[70vh] max-h-[560px] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-3.5 py-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="/images/funcity_logo.png" alt="" className="w-7 h-7 object-contain" />
            </span>
            <div className="flex-grow min-w-0">
              <p className="font-bold leading-tight">Funcity Resort</p>
              <p className="text-[11px] text-white/70 leading-tight">online · replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 bg-[#efeae2]"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-lg px-2.5 py-1.5 text-[13px] leading-snug shadow-sm whitespace-pre-line ${
                    m.from === 'user'
                      ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                      : 'bg-white text-[#111b21] rounded-tl-none'
                  }`}
                >
                  {m.text}
                  {m.action === 'book' && (
                    <button
                      onClick={doBook}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-xs py-2 rounded-lg hover:brightness-105 active:scale-95 transition-all"
                    >
                      <CalendarCheck className="w-4 h-4" /> Book Now
                    </button>
                  )}
                  <span className="block text-[10px] text-[#667781] text-right mt-0.5">
                    {m.time}
                    {m.from === 'user' && <Check className="w-3 h-3 inline ml-0.5 -mt-0.5" />}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#9aa2a7] rounded-full animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#9aa2a7] rounded-full animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1.5 h-1.5 bg-[#9aa2a7] rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Quick replies (free chat) */}
            {step === 'chat' && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => onQuick(q)}
                    className="bg-white border border-[#25D366]/40 text-[#075E54] rounded-full px-3 py-1 text-[11px] font-semibold hover:bg-[#25D366]/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* WhatsApp same-as-mobile choice */}
            {step === 'whatsapp' && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => onQuick(WA_SAME_CHIP)}
                  className="flex items-center gap-1.5 bg-white border border-[#25D366]/50 text-[#075E54] rounded-full px-3 py-1 text-[11px] font-semibold hover:bg-[#25D366]/10"
                >
                  <Check className="w-3 h-3" /> {WA_SAME_CHIP}
                </button>
                <button
                  onClick={() => onQuick(WA_DIFF_CHIP)}
                  className="bg-white border border-[#25D366]/40 text-[#075E54] rounded-full px-3 py-1 text-[11px] font-semibold hover:bg-[#25D366]/10"
                >
                  {WA_DIFF_CHIP}
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2">
            <input
              value={input}
              inputMode={
                step === 'phone' || step === 'whatsappNum' ? 'numeric' : 'text'
              }
              onChange={(e) => {
                const v = e.target.value;
                setInput(v);
                // auto-send once a 10-digit number is entered
                if (
                  (step === 'phone' || step === 'whatsapp' || step === 'whatsappNum') &&
                  digits(v).length === 10
                ) {
                  setInput('');
                  handleUser(v);
                }
              }}
              placeholder={
                step === 'chat'
                  ? 'Type a message'
                  : step === 'whatsapp'
                    ? 'Tap a button, or type the WhatsApp number'
                    : step === 'phone' || step === 'whatsappNum'
                      ? 'Type 10 digits — sends automatically'
                      : 'Type your answer… (or “cancel”)'
              }
              className="flex-grow bg-white rounded-full px-4 py-2 text-sm text-[#111b21] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 hover:brightness-105 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
