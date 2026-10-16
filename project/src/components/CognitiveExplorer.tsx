import React, { useMemo, useState } from 'react';
import { 
  Brain, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  Check, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  History,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

type DistortionKey =
  | 'allOrNothing'
  | 'overgeneralization'
  | 'catastrophizing'
  | 'mindReading'
  | 'shouldStatements'
  | 'personalization'
  | 'mentalFilter';

type Distortion = {
  key: DistortionKey;
  name: string;
  badge: string;
  description: string;
  example: string;
  reframes: string[];
  questions: string[];
};

const distortions: Distortion[] = [
  {
    key: 'allOrNothing',
    name: 'All-or-Nothing Thinking',
    badge: 'Black & White',
    description:
      'Viewing outcomes in rigid extremes. If a situation isn’t flawless, you interpret it as an absolute failure.',
    example: '“If I don’t handle this presentation flawlessly, I’m totally incompetent.”',
    reframes: [
      'What would a nuanced, realistic middle ground look like?',
      'Progress and learning count tremendously, even when things aren’t perfect.'
    ],
    questions: [
      'What evidence exists of partial progress and positive effort?',
      'How would I talk to a close friend who said this about themselves?'
    ],
  },
  {
    key: 'overgeneralization',
    name: 'Overgeneralization',
    badge: 'Always / Never',
    description:
      'Taking a single unfavorable event and assuming it is an endless pattern of defeat.',
    example: '“I stumbled over my words once—I am terrible at public speaking forever.”',
    reframes: [
      'One stumble does not determine my lifelong capability.',
      'I can acknowledge an off moment without assuming it is permanent.'
    ],
    questions: [
      'What recent counter-examples disprove this "always/never" thought?',
      'What small adjustment can I make next time?'
    ],
  },
  {
    key: 'catastrophizing',
    name: 'Catastrophizing',
    badge: 'Worst Case',
    description:
      'Magnifying the worst possible scenario and assuming you will be completely unable to cope.',
    example: '“If this project is delayed, I will lose my job and my life will unravel.”',
    reframes: [
      'What is the most probable realistic outcome based on facts?',
      'Even in tough circumstances, I have resilience, resources, and adaptability.'
    ],
    questions: [
      'How have I successfully resolved high-pressure moments before?',
      'What supports are available if unexpected hurdles arise?'
    ],
  },
  {
    key: 'mindReading',
    name: 'Mind Reading',
    badge: 'Assumptions',
    description:
      'Arbitrarily concluding that someone is reacting negatively to you without confirming facts.',
    example: '“They took 3 hours to respond—they must be angry or disappointed in me.”',
    reframes: [
      'I cannot read thoughts without direct communication.',
      'There are numerous neutral reasons for delays that have nothing to do with me.'
    ],
    questions: [
      'What verifiable facts do I actually possess right now?',
      'Can I ask a gentle check-in question rather than suffering through assumptions?'
    ],
  },
  {
    key: 'shouldStatements',
    name: '“Should” Statements',
    badge: 'Rigid Rules',
    description:
      'Demanding that reality bend to harsh mental rules (“I should never feel stressed”), creating guilt and frustration.',
    example: '“I should always be productive—any rest means I am falling behind.”',
    reframes: [
      'Rest is productive. Humans require recharge cycles.',
      'I can replace rigid “should” demands with compassionate “I prefer” or “I choose”.'
    ],
    questions: [
      'Whose unrealistically harsh standard am I holding myself to?',
      'What happens if I replace "should" with "it would be nice, but I am human"?'
    ],
  },
  {
    key: 'personalization',
    name: 'Personalization',
    badge: 'Self-Blame',
    description:
      'Assuming total personal blame for an external event that you were not primarily responsible for.',
    example: '“The team meeting was low-energy—maybe I ruined the collaborative mood.”',
    reframes: [
      'Many external variables influence group energy beyond my presence.',
      'I can take healthy responsibility for my own actions without absorbing everything.'
    ],
    questions: [
      'What portion of this situation is genuinely mine to control?',
      'What other factors (fatigue, external stress, deadlines) could be at play?'
    ],
  },
  {
    key: 'mentalFilter',
    name: 'Mental Filter',
    badge: 'Tunnel Vision',
    description:
      'Dwelling exclusively on a single negative detail while completely filtering out everything positive.',
    example: '“Ten people complimented my report, but I can only fixate on the one critique.”',
    reframes: [
      'I choose to see the full panoramic reality, not just the single flaw.',
      'Constructive critique can coexist with genuine praise and success.'
    ],
    questions: [
      'What parts went genuinely well that I am tempted to ignore?',
      'Can I absorb constructive tips without letting them erase my victories?'
    ],
  },
];

type JournalEntry = {
  id: string;
  distortionKey: DistortionKey;
  originalThought: string;
  reframe: string;
  createdAt: string;
};

const JOURNAL_KEY = 'cognitive_explorer_entries';

const CognitiveExplorer: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<DistortionKey>('allOrNothing');
  const [originalThought, setOriginalThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]'); } catch { return []; }
  });

  const selectedDistortion = useMemo(
    () => distortions.find((item) => item.key === selectedKey) ?? distortions[0],
    [selectedKey]
  );

  const saveEntry = () => {
    if (!originalThought.trim() || !reframe.trim()) return;
    const entry: JournalEntry = {
      id: Math.random().toString(36).slice(2),
      distortionKey: selectedKey,
      originalThought: originalThought.trim(),
      reframe: reframe.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
      return next;
    });
    setOriginalThought('');
    setReframe('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Cognitive Explorer Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950 p-6 sm:p-8 text-white border border-amber-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200 mb-3">
                <Brain className="w-3.5 h-3.5 text-amber-300" />
                <span>CBT Cognitive Reframing Lab</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Cognitive Explorer
              </h1>
              <p className="text-sm text-amber-100/80 mt-1 max-w-xl">
                Identify automatic unhelpful thought loops, recognize the cognitive trap, and deliberately forge compassionate, evidence-based reframes.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Reframed Thoughts</span>
                <div className="text-xl font-black text-white leading-none mt-0.5">
                  {entries.length} <span className="text-xs font-semibold text-amber-300">Logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distortion Selector Pills Grid */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Select a Cognitive Distortion Pattern
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {distortions.map((item) => {
              const isSelected = selectedKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedKey(item.key)}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md scale-102 ring-1 ring-amber-400'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Anatomy Card: The Trap vs The Antidote */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Anatomy of {selectedDistortion.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* The Automatic Negative Trap */}
            <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Mental Trap
              </span>
              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed mb-4">
                {selectedDistortion.description}
              </p>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/40 text-xs italic text-rose-900 dark:text-rose-300">
                Example: {selectedDistortion.example}
              </div>
            </div>

            {/* The Compassionate Antidote */}
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Compassionate Antidote
              </span>
              <ul className="space-y-2 text-xs text-teal-900 dark:text-teal-200">
                {selectedDistortion.reframes.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Self-Inquiry Guiding Questions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Socratic Inquiry Questions:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {selectedDistortion.questions.map((q, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 flex items-start gap-2">
                  <span className="font-bold text-amber-500">?</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Reframing Workshop */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Practice Workshop: Reframe Your Thought
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                1. Automatic Thought (What are you telling yourself?)
              </label>
              <textarea
                rows={3}
                value={originalThought}
                onChange={(e) => setOriginalThought(e.target.value)}
                placeholder="e.g., If I make any mistake on this task, everyone will think I'm a failure..."
                className="w-full p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-xs resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                2. Compassionate Reframe (What is a balanced, grounded view?)
              </label>
              <textarea
                rows={3}
                value={reframe}
                onChange={(e) => setReframe(e.target.value)}
                placeholder="e.g., Mistakes are natural steps in learning. I am valued for my effort and care..."
                className="w-full p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-xs resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {isSaved ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Reframe saved to journal!
                </span>
              ) : (
                'Transformed thoughts reinforce positive neural pathways.'
              )}
            </span>

            <button
              onClick={saveEntry}
              disabled={!originalThought.trim() || !reframe.trim()}
              className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-md ${
                originalThought.trim() && reframe.trim()
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Save Reframe</span>
            </button>
          </div>
        </div>

        {/* Reframing Journal History */}
        {entries.length > 0 && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reframing Journal ({entries.length})
              </h3>
            </div>

            <div className="space-y-3">
              {entries.slice(0, 8).map((entry) => {
                const dist = distortions.find((d) => d.key === entry.distortionKey);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        {dist?.name || entry.distortionKey}
                      </span>
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200/60 dark:border-rose-900/40">
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-rose-600">Thought:</span>
                        "{entry.originalThought}"
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 border border-teal-200/60 dark:border-teal-900/40">
                        <span className="font-bold text-[10px] uppercase block mb-0.5 text-teal-600">Reframe:</span>
                        "{entry.reframe}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CognitiveExplorer;
