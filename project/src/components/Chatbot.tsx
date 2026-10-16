import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Phone, 
  AlertTriangle, 
  Download, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Heart, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Wind,
  Brain,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { User } from '../types/User';
import { useI18n } from '../i18n';

interface ChatbotProps {
  user: User;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ user }) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user.firstName || 'there'}! I'm Dr. MindBot, your 24/7 empathetic mental health companion. I'm here to listen without judgment, guide you through grounding exercises, and offer evidence-based coping tools. How are you feeling right now?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem('chat_session_id');
    if (existing) return existing;
    const id = Math.random().toString(36).slice(2);
    localStorage.setItem('chat_session_id', id);
    return id;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load/save history
  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const botResponses = {
    emergency: [
      "I hear how much pain you're in right now. Your safety and life matter deeply. Please connect with emergency care immediately—call or text 988 anytime, day or night.",
      "You do not have to carry this overwhelming weight alone. Please reach out to the Crisis Text Line (Text HOME to 741741) or a loved one who can be by your side right now.",
      "If you are having thoughts of self-harm or feel unsafe, please call 911 or head to the nearest emergency room. There are compassionate professionals waiting to support you."
    ],
    stress: [
      "Stress is your nervous system's way of signaling high demand. Let's take a slow breath together: inhale for 4 seconds, and exhale for 6 seconds.",
      "When everything feels urgent, remember: you only need to navigate the single next minute. What is the one thing causing the most pressure right now?",
      "Would you like to try a quick grounding exercise or break down what's currently on your plate into manageable micro-steps?"
    ],
    anxiety: [
      "Anxiety can feel physically overwhelming, but it is temporary and you are safe in this moment. Let's try the 5-4-3-2-1 technique: name 3 things you can physically see around you right now.",
      "Notice your feet resting on the floor and the air filling your lungs. Your nervous system will settle. What physical sensation in your body is speaking the loudest right now?",
      "Remember: anxious thoughts are mental events, not objective facts. You don't have to believe everything your worried mind produces."
    ],
    positive: [
      "It brings genuine warmth to hear you're feeling good today! Celebrating these moments builds emotional resilience.",
      "What contributed most to this sense of ease or happiness? Savoring it helps encode positive neural pathways.",
      "Keep this positive momentum close to your heart—you deserve to feel balanced, proud, and light."
    ],
    general: [
      "I'm right here with you. Tell me more about what has been on your mind lately.",
      "Your emotional journey is completely valid. What would offer you the most comfort or relief right now?",
      "Taking even a few minutes to reflect on how you feel is a powerful act of self-care. I'm listening."
    ]
  };

  const getRandomResponse = (category: string): string => {
    const responses = botResponses[category as keyof typeof botResponses] || botResponses.general;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const detectIntent = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('emergency') || lowerText.includes('crisis') || lowerText.includes('harm') || lowerText.includes('suicide') || lowerText.includes('kill myself')) {
      return 'emergency';
    } else if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('pressure') || lowerText.includes('exhaust')) {
      return 'stress';
    } else if (lowerText.includes('anxious') || lowerText.includes('anxiety') || lowerText.includes('panic') || lowerText.includes('fear')) {
      return 'anxiety';
    } else if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('better') || lowerText.includes('calm')) {
      return 'positive';
    }
    return 'general';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (preset?: string) => {
    const textToSend = (preset ?? inputText).trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const intent = detectIntent(textToSend);
      const response = getRandomResponse(intent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const emergencyContacts = [
    { 
      name: 'Suicide & Crisis Lifeline', 
      number: '988', 
      href: 'tel:988',
      desc: '24/7 • Free & Confidential',
      action: 'Call or Text'
    },
    { 
      name: 'Crisis Text Line', 
      number: 'HOME to 741741', 
      href: 'sms:741741?body=HOME',
      desc: '24/7 • SMS Crisis Counselor',
      action: 'Text'
    },
    { 
      name: 'SAMHSA Treatment Referral', 
      number: '1-800-662-4357', 
      href: 'tel:18006624357',
      desc: '24/7 • Mental Health Care',
      action: 'Call'
    }
  ];

  const quickPrompts = [
    'I feel anxious about work deadlines',
    'Guide me through a 2-min box breathing reset',
    'How do I stop spiraling thoughts?',
    'I feel emotionally exhausted today',
    'Help me practice 5-4-3-2-1 grounding'
  ];

  const clearChat = () => {
    const starter: Message = {
      id: '1',
      text: `Hello ${user.firstName || 'there'}! I'm Dr. MindBot. How can I support your wellbeing today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([starter]);
    localStorage.setItem('chat_history', JSON.stringify([starter]));
  };

  const exportChat = () => {
    const blob = new Blob([JSON.stringify({ sessionId, messages }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcare-chat-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 select-none">
      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-emerald-800 to-slate-950 p-6 sm:p-8 text-white border border-teal-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(20,184,166,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-teal-200 mb-3">
                <Bot className="w-3.5 h-3.5 text-emerald-300" />
                <span>AI Mental Health & Grounding Companion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                AI Counselor Suite
              </h1>
              <p className="text-sm text-teal-100/80 mt-1 max-w-xl leading-relaxed">
                Empathetic, evidence-based Cognitive Behavioral Therapy (CBT) and real-time grounding exercises available 24/7 in a confidential environment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-xs font-semibold text-teal-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dr. MindBot Active</span>
              </div>

              <button
                onClick={exportChat}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs"
                title="Download transcript"
              >
                <Download className="w-3.5 h-3.5 text-teal-300" />
                <span>Export Chat</span>
              </button>

              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400/40 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                <span>Clear History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Conversation Suite: Synchronized Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Safety Net & Companion Dossier (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5 h-[680px]">
            
            {/* 1. Companion Clinical Capabilities Card */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Dr. MindBot System
                    </h3>
                    <p className="text-[11px] text-slate-400">Multimodal CBT Grounding</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  Ready
                </span>
              </div>

              {/* Supported Therapeutic Modalities */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Box Breathing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">5-4-3-2-1 Sensory</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">CBT Reframing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">Panic De-escalation</span>
                </div>
              </div>

              {/* Session Telemetry Strip */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confidential In-Session</span>
                </span>
                <span className="font-mono">{messages.length} messages</span>
              </div>
            </div>

            {/* 2. 24/7 Crisis Support Card (Compact, High-Authority, Beautifully Styled) */}
            <div className="flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-rose-200/80 dark:border-rose-950/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      24/7 Crisis Lifelines
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Toll-Free
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  If you are in acute distress, certified compassionate professionals are standing by:
                </p>

                <div className="space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.href}
                      className="group p-2.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between transition-colors block cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[11px] font-bold text-rose-950 dark:text-rose-200 block truncate">
                          {contact.name}
                        </span>
                        <div className="text-xs font-black text-rose-700 dark:text-rose-400 font-mono">
                          {contact.number}
                        </div>
                        <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block">
                          {contact.desc}
                        </span>
                      </div>
                      
                      <div className="w-7 h-7 rounded-lg bg-rose-200/70 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <PhoneCall className="w-3.5 h-3.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Non-judgmental, anonymous, and available 365 days a year.
              </p>
            </div>

          </div>

          {/* Right Column: Chat Console Pane (lg:col-span-8) */}
          <div className="lg:col-span-8 h-[680px]">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 h-full flex flex-col overflow-hidden">
              
              {/* Counselor Header */}
              <div className="p-4 sm:p-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white">Dr. MindBot</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/20">
                        AI Counselor
                      </span>
                    </div>
                    <p className="text-xs text-teal-100/80">
                      Private, Empathetic & Multimodal Grounding
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Active Session</span>
                  </div>
                </div>
              </div>

              {/* Quick Suggestions Chips Bar (Zero scrollbars) */}
              <div 
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto overflow-y-hidden scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Suggestions:
                </span>
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 text-slate-600 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages Stream */}
              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {messages.map((message) => {
                  const isUser = message.sender === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                      <div className={`max-w-md sm:max-w-xl flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                          isUser 
                            ? 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700'
                        }`}>
                          {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-xs'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/50 dark:border-slate-700/60'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <span className={`block text-[10px] mt-1.5 ${isUser ? 'text-teal-100/70 text-right' : 'text-slate-400'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2.5 animate-fadeIn">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-teal-600 animate-pulse" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Console */}
              <div className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your reflection or question (e.g., 'I feel overwhelmed by tasks')..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    className={`px-4 py-3 rounded-2xl font-bold text-white transition-all shadow-md flex items-center justify-center shrink-0 ${
                      inputText.trim() && !isTyping
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 cursor-pointer shadow-teal-600/25 hover:scale-102'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 px-1">
                  <span>Press Enter ↵ to send</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Private & Secure Session</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Chatbot;