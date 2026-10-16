import React, { useEffect, useMemo, useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  RefreshCw, 
  Compass, 
  MessageSquare,
  Shield,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

type Emotion = 'anxious' | 'sad' | 'angry' | 'overwhelmed' | 'lonely' | 'hopeful';

type StoryStep = {
  id: string;
  prompt: string;
  choices: Array<{ id: string; text: string; next: string }>;
  therapistHint?: string;
};

type SavedProgress = {
  emotion: Emotion;
  path: string[];
};

const STORAGE_KEY = 'story_therapy_progress';

const baseSteps: Record<Emotion, StoryStep[]> = {
  anxious: [
    {
      id: 'start',
      prompt: "You're standing at the entrance of a quiet garden. Your chest feels tight, thoughts racing. A sign reads: 'One step at a time.'",
      therapistHint: 'Ground yourself by noticing details around you. Choose the gentlest next step.',
      choices: [
        { id: 'c1', text: 'Notice the soft sound of leaves', next: 'leaves' },
        { id: 'c2', text: 'Focus on your breath rhythm', next: 'breath' }
      ]
    },
    {
      id: 'leaves',
      prompt: 'You hear soft rustling. It reminds you that change can be gentle. A small path opens ahead through dappled sunlight.',
      therapistHint: 'Anchor to sensory cues when anxiety spikes; it tells your nervous system you are safe in this moment.',
      choices: [
        { id: 'c3', text: 'Follow the path slowly', next: 'path' },
        { id: 'c4', text: 'Sit under a tree and rest', next: 'rest' }
      ]
    },
    {
      id: 'breath',
      prompt: 'You place a hand on your chest and breathe in… 4… hold… 4… out… 4… hold… 4. Your racing thoughts soften into stillness.',
      therapistHint: 'Box breathing reduces sympathetic nervous arousal within minutes.',
      choices: [
        { id: 'c5', text: 'Keep breathing and observe thoughts pass', next: 'path' },
        { id: 'c6', text: 'Name 3 things you can see around you', next: 'rest' }
      ]
    },
    {
      id: 'path',
      prompt: 'The path leads to a clear pond reflecting the sky. You see a calmer version of yourself looking back with kindness.',
      choices: [
        { id: 'c7', text: 'Offer yourself kind words', next: 'affirm' },
        { id: 'c8', text: 'Skim a stone across the water to release worry', next: 'release' }
      ]
    },
    {
      id: 'rest',
      prompt: 'You rest in the shade. The solid ground supports you. Your body remembers safety and releases unnecessary tension.',
      choices: [
        { id: 'c9', text: 'Continue forward when ready', next: 'path' },
        { id: 'c10', text: 'Conclude and carry this peace forward', next: 'END' }
      ]
    },
    {
      id: 'affirm',
      prompt: 'Quietly, you say: "I am safe in this moment. I don’t need all the answers right now, only the next gentle step."',
      choices: [
        { id: 'c11', text: 'Carry these words with you into today', next: 'END' }
      ]
    },
    {
      id: 'release',
      prompt: 'The ripples expand outward then fade into glass stillness. Like intrusive thoughts when you let them pass. Your chest feels lighter.',
      choices: [
        { id: 'c12', text: 'Notice this lighter feeling in your body', next: 'END' }
      ]
    }
  ],
  sad: [
    {
      id: 'start',
      prompt: 'Rain taps gently on a window. Inside, a warm lamp is lit especially for you. There is nowhere you need to rush.',
      therapistHint: 'Sadness asks for softness, warmth, and validation without judgment.',
      choices: [
        { id: 'c1', text: 'Wrap yourself in a warm blanket', next: 'blanket' },
        { id: 'c2', text: 'Write a compassionate note to yourself', next: 'letter' }
      ]
    },
    { id: 'blanket', prompt: 'Comfort wraps around you. You remember a time you felt deeply cared for. That warmth still lives inside you.', choices: [ { id: 'c3', text: 'Hold that memory gently', next: 'END' } ] },
    { id: 'letter', prompt: 'You write: "Dear me, I see your pain. You have survived difficult storms before. I am right here with you."', choices: [ { id: 'c4', text: 'Fold the letter close to your heart', next: 'END' } ] }
  ],
  angry: [
    { id: 'start', prompt: 'You stand by a rushing river with a fierce current. Your fists slowly unclench as you draw in a deep breath.', choices: [ { id: 'c1', text: 'Place a heavy stone down on the riverbank', next: 'stone' }, { id: 'c2', text: 'Shout your frustration into the open sky', next: 'voice' } ] },
    { id: 'stone', prompt: 'You set the stone down into the mud. Some heavy burdens are not yours to carry forever. Your palms open.', choices: [ { id: 'c3', text: 'Walk forward lighter and clearer', next: 'END' } ] },
    { id: 'voice', prompt: 'Your voice echoes across the water, then quiets into peaceful space. You feel room inside yourself for deliberate choice.', choices: [ { id: 'c4', text: 'Breathe deeply into that new space', next: 'END' } ] }
  ],
  overwhelmed: [
    { id: 'start', prompt: 'A dense maze of endless tasks surrounds you. Suddenly, a soft warm light illuminates just one single stone ahead.', therapistHint: 'Choose one small thing. Everything else can wait for now.', choices: [ { id: 'c1', text: 'Take the illuminated step', next: 'one' }, { id: 'c2', text: 'Sit and take a calm pause first', next: 'pause' } ] },
    { id: 'one', prompt: 'You complete just that one thing. Immediate relief arrives. Momentum is built by single drops, not floods.', choices: [ { id: 'c3', text: 'Acknowledge your progress with pride', next: 'END' } ] },
    { id: 'pause', prompt: 'You pause, sip cool water, and exhale slowly. Your nervous system settles from fight-or-flight back into balance.', choices: [ { id: 'c4', text: 'Now take one gentle step forward', next: 'one' } ] }
  ],
  lonely: [
    { id: 'start', prompt: 'You light a lantern on a dark hilltop. In the distance, across the valley, another lantern glows warmly in response.', therapistHint: 'Connection can be nurtured in micro-moments of shared humanity.', choices: [ { id: 'c1', text: 'Send a kind, warm thought outward', next: 'out' }, { id: 'c2', text: 'Plan a gentle reach-out to someone you care about', next: 'reach' } ] },
    { id: 'out', prompt: 'A comforting warmth expands in your chest. You are never as alone as your anxious thoughts convince you.', choices: [ { id: 'c3', text: 'Hold this warmth in your heart', next: 'END' } ] },
    { id: 'reach', prompt: 'You draft a simple message: "Thinking of you—no need to reply immediately." The bridge is built.', choices: [ { id: 'c4', text: 'Save this to send when you feel ready', next: 'END' } ] }
  ],
  hopeful: [
    { id: 'start', prompt: 'Golden morning sunlight pours through fresh leaves. You feel an open door and possibility in front of you.', choices: [ { id: 'c1', text: 'Step forward with clear intention', next: 'forward' }, { id: 'c2', text: 'Name a guiding core value for today', next: 'value' } ] },
    { id: 'forward', prompt: 'With each deliberate stride, your inner trust grows. Action fuels confidence far better than waiting.', choices: [ { id: 'c3', text: 'Carry this vibrant momentum into your day', next: 'END' } ] },
    { id: 'value', prompt: 'You choose: kindness, courage, or curiosity. This becomes your steady compass through whatever arises.', choices: [ { id: 'c4', text: 'Walk forward with your compass', next: 'END' } ] }
  ]
};

const emotionMeta: Record<Emotion, { label: string; icon: string; color: string }> = {
  anxious: { label: 'Anxiety', icon: '🍃', color: 'from-amber-500 to-orange-600' },
  sad: { label: 'Sadness', icon: '🌧️', color: 'from-sky-500 to-blue-600' },
  angry: { label: 'Anger', icon: '🔥', color: 'from-rose-500 to-red-600' },
  overwhelmed: { label: 'Overwhelm', icon: '🌊', color: 'from-indigo-500 to-purple-600' },
  lonely: { label: 'Loneliness', icon: '🏮', color: 'from-purple-500 to-violet-600' },
  hopeful: { label: 'Hope', icon: '🌱', color: 'from-emerald-500 to-teal-600' }
};

const reflectAI = (freeText: string, emotion: Emotion): string => {
  const text = freeText.toLowerCase();
  const stress = /(stress|anx|panic|overwhelm|worry)/.test(text);
  const sadness = /(sad|down|tired|exhaust|empty|lonely)/.test(text);
  const anger = /(angry|mad|irritat|frustrat|rage)/.test(text);
  const hope = /(hope|better|okay|calm|relief)/.test(text);
  if (stress) return 'I hear tension and heavy worry. Let’s slow down together—try a single gentle breath right now. You are doing enough.';
  if (sadness) return 'There is real heaviness here. Thank you for honoring your truth. Softness and rest are completely welcome.';
  if (anger) return 'Your anger makes sense given what you’ve been carrying. It is safe to set down that burden here and choose your response.';
  if (hope) return 'I notice wonderful glimmers of ease. Let’s anchor them—what helped you feel this spark of light?';
  
  switch (emotion) {
    case 'anxious': return 'Let’s take this one manageable, gentle step at a time.';
    case 'sad': return 'Be gentle with your spirit today—sadness asks for warmth and stillness.';
    case 'angry': return 'There’s room for your feeling here, and space for wise choice too.';
    case 'overwhelmed': return 'One thing at a time is always enough for now.';
    case 'lonely': return 'You are seen and valued here. Micro-moments of connection make a difference.';
    case 'hopeful': return 'Align with your values and step forward with confidence.';
  }
};

const StoryTherapy: React.FC = () => {
  const [emotion, setEmotion] = useState<Emotion>(() => (localStorage.getItem('story_emotion') as Emotion) || 'anxious');
  const [steps, setSteps] = useState<StoryStep[]>(() => baseSteps[emotion]);
  const [currentId, setCurrentId] = useState<string>(() => (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.path?.slice(-1)[0]) || 'start');
  const [freeText, setFreeText] = useState('');
  const [aiNote, setAiNote] = useState('');

  const current = useMemo(() => steps.find(s => s.id === currentId) || steps[0], [steps, currentId]);

  useEffect(() => {
    setSteps(baseSteps[emotion]);
    setCurrentId('start');
    localStorage.setItem('story_emotion', emotion);
  }, [emotion]);

  const saveProgress = (nextId: string) => {
    const saved: SavedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || { emotion, path: [] };
    const next = { emotion, path: [...(saved.path || []), nextId] } as SavedProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const choose = (next: string) => {
    if (next === 'END') {
      setCurrentId('END');
      setAiNote('Story chapter complete. Notice how your body feels now. You can revisit this sanctuary anytime.');
      saveProgress('END');
      return;
    }
    setCurrentId(next);
    saveProgress(next);
  };

  const reflect = () => {
    if (!freeText.trim()) return;
    const note = reflectAI(freeText, emotion);
    setAiNote(note);
  };

  const resetSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentId('start');
    setAiNote('');
    setFreeText('');
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Story Therapy Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-800 via-blue-900 to-slate-950 p-6 sm:p-8 text-white border border-sky-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(14,165,233,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-sky-200 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                <span>Choice-Driven Narrative Healing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Story Therapy
              </h1>
              <p className="text-sm text-sky-100/80 mt-1 max-w-xl">
                Therapeutic storytelling transports your mind into comforting metaphoric realms, helping you reframe emotional bottlenecks through gentle choices.
              </p>
            </div>

            <button
              onClick={resetSession}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-white/90 hover:bg-black/60 text-xs font-bold transition-all shadow-xl"
            >
              <RefreshCw className="w-4 h-4 text-sky-300" />
              <span>Reset Journey</span>
            </button>
          </div>
        </div>

        {/* Emotion Portal Selector */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Choose your emotional starting point
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {(Object.keys(emotionMeta) as Emotion[]).map((e) => {
              const meta = emotionMeta[e];
              const isSelected = emotion === e;
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmotion(e)}
                  className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 shadow-md scale-105'
                      : 'border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 hover:-translate-y-0.5'
                  }`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Interactive Story Chamber */}
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          {/* Narrative Prompt Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/40 dark:from-slate-800/60 dark:to-sky-950/20 border border-slate-200/80 dark:border-slate-800">
            {currentId === 'END' ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Sanctuary Reached
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Thank you for walking this gentle path. You have honored your feelings and made room for inner calm.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed font-serif sm:font-sans">
                  "{current.prompt}"
                </p>

                {current.therapistHint && (
                  <div className="mt-5 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider block">Therapist Insight</span>
                      <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5 leading-relaxed">
                        {current.therapistHint}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Choices Grid */}
          {currentId !== 'END' && (
            <div className="mt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                Choose your next step:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {current.choices.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => choose(ch.next)}
                    className="group p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {ch.text}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reflection Section */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Share anything that came up for you (Optional)</span>
            </label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm leading-relaxed resize-none transition-all"
              placeholder="What thoughts or body sensations arose during this chapter?..."
            />

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={reflect}
                disabled={!freeText.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  freeText.trim()
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reflect with AI</span>
              </button>
            </div>

            {aiNote && (
              <div className="mt-4 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{aiNote}</span>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default StoryTherapy;
