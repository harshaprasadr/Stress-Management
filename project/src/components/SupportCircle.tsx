import React, { useEffect, useMemo, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Clock, 
  Copy, 
  CheckCircle2, 
  Trash2, 
  Send, 
  Sparkles, 
  MessageCircleHeart,
  Lock,
  HeartHandshake,
  Check,
  Quote
} from 'lucide-react';

type ContactStatus = 'pending' | 'approved';

type Contact = {
  id: string;
  name: string;
  relationship: string;
  status: ContactStatus;
  inviteCode: string;
  addedAt: string;
};

type Reflection = {
  id: string;
  contactId: string;
  contactName: string;
  weekKey: string;
  message: string;
  createdAt: string;
};

const CONTACTS_KEY = 'support_circle_contacts';
const REFLECTIONS_KEY = 'support_circle_reflections';
const WEEKS_KEY = 'weekly_report_weeks';

const defaultPrompts = [
  'What strength did you notice in me this week?',
  'Share a small moment when you felt proud of me recently.',
  'What reminds you that I am resilient, even during tough stretches?',
  'Offer a grounding sentence I can read when stress rises.',
  'What act of self-kindness would you want me to practice right now?'
];

const SupportCircle: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try { return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]'); } catch { return []; }
  });
  const [reflections, setReflections] = useState<Reflection[]>(() => {
    try { return JSON.parse(localStorage.getItem(REFLECTIONS_KEY) || '[]'); } catch { return []; }
  });
  const [availableWeeks, setAvailableWeeks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(WEEKS_KEY) || '[]'); } catch { return []; }
  });

  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [reflectionMessage, setReflectionMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    const handler = () => {
      try {
        const weekList = JSON.parse(localStorage.getItem(WEEKS_KEY) || '[]');
        setAvailableWeeks(weekList);
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addContact = (name: string, rel: string) => {
    if (!name.trim() || !rel.trim()) return;
    const newContact: Contact = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      relationship: rel.trim(),
      status: 'pending',
      inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      addedAt: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
    setContactName('');
    setRelationship('');
  };

  const updateStatus = (id: string, status: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setReflections((prev) => prev.filter((r) => r.contactId !== id));
  };

  const saveReflection = (contactId: string, weekKey: string, message: string) => {
    if (!contactId || !weekKey || !message.trim()) return;
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;
    const entry: Reflection = {
      id: Math.random().toString(36).slice(2),
      contactId,
      contactName: contact.name,
      weekKey,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    setReflections((prev) => [entry, ...prev]);
    setReflectionMessage('');
  };

  const approvedContacts = useMemo(() => contacts.filter((c) => c.status === 'approved'), [contacts]);

  useEffect(() => {
    if (!selectedContactId && approvedContacts.length > 0) {
      setSelectedContactId(approvedContacts[0].id);
    }
  }, [approvedContacts, selectedContactId]);

  useEffect(() => {
    if (!selectedWeek && availableWeeks.length > 0) {
      setSelectedWeek(availableWeeks[0]);
    }
  }, [availableWeeks, selectedWeek]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`StressLytix Support Circle Invite Code: ${code}`);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {}
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Support Sanctuary Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-6 sm:p-8 text-white border border-emerald-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-200 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Double-Consent Safe Haven</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Support Circle
              </h1>
              <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
                Invite trusted contacts (mentors, partners, therapists) to share brief, grounded reflections on your recovery journey. Protected by secure invite codes and mutual consent.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Trusted Circle</span>
                <div className="text-xl font-black text-white leading-none mt-0.5">
                  {approvedContacts.length} <span className="text-xs font-semibold text-emerald-300">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Contact Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Add a Trusted Person
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Name or initials (e.g. Alex M.)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <input
              type="text"
              placeholder="Relationship (e.g. Mentor, Partner, Therapist)"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button
              onClick={() => addContact(contactName, relationship)}
              disabled={!contactName.trim() || !relationship.trim()}
              className={`p-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                contactName.trim() && relationship.trim()
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Generate Invite Code</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Only invite people you deeply trust with your mental health. You can pause or revoke access at any time.
          </p>
        </div>

        {/* Contacts & Reflections Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Trusted Contacts List */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Circle Members ({contacts.length})
                </h3>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No contacts invited yet. Add someone you trust above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                          {contact.relationship}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Added {new Date(contact.addedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Code: {contact.inviteCode}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(contact.inviteCode)}
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                      >
                        {copiedCode === contact.inviteCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode === contact.inviteCode ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => updateStatus(contact.id, contact.status === 'approved' ? 'pending' : 'approved')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          contact.status === 'approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {contact.status === 'approved' ? 'Active' : 'Pending'}
                      </button>

                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove Contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Record a Reflection Card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircleHeart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Record a Partner's Reflection
              </h3>
            </div>

            {approvedContacts.length === 0 ? (
              <p className="text-xs text-slate-500">
                You must have at least one approved contact to log reflections.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">From Contact</label>
                    <select
                      value={selectedContactId}
                      onChange={(e) => setSelectedContactId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                    >
                      {approvedContacts.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.relationship})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Week</label>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
                    >
                      {availableWeeks.length > 0 ? (
                        availableWeeks.map((w, idx) => <option key={idx} value={w}>{w}</option>)
                      ) : (
                        <option value="Current Week">Current Week</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Reflection Note</label>
                  <textarea
                    rows={4}
                    value={reflectionMessage}
                    onChange={(e) => setReflectionMessage(e.target.value)}
                    placeholder="Enter what your trusted friend shared..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-xs resize-none"
                  />
                </div>

                <button
                  onClick={() => saveReflection(selectedContactId, selectedWeek || 'Current Week', reflectionMessage)}
                  disabled={!reflectionMessage.trim()}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                    reflectionMessage.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Reflection to Report</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Shared Reflections Feed */}
        {reflections.length > 0 && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <Quote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Words of Encouragement & Reflections ({reflections.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reflections.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
                >
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed mb-4">
                    "{r.message}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-200/50 dark:border-slate-700">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">— {r.contactName}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SupportCircle;
