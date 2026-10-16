import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Heart, 
  Book, 
  Music, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Sparkles,
  ArrowRight,
  Wind,
  ShieldAlert,
  Compass,
  Check
} from 'lucide-react';
import BreathingExercise from './BreathingExercise';

const StressResults: React.FC = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

  useEffect(() => {
    const savedAssessment = localStorage.getItem('currentAssessment');
    if (savedAssessment) {
      const parsedAssessment = JSON.parse(savedAssessment);
      setAssessment(parsedAssessment);
    }
  }, []);

  if (!assessment) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-center max-w-md w-full border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No Active Assessment Data
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Please run the multimodal sensor assessment to generate your personalized stress diagnostic report.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Launch Assessment Now
          </button>
        </div>
      </div>
    );
  }

  const getStressConfig = (level: string) => {
    switch (level) {
      case 'low':
        return {
          gradient: 'from-emerald-700 via-teal-800 to-slate-950',
          accent: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          title: 'Low Stress Equilibrium',
          description: 'Your biological and emotional indicators reflect positive calm, low autonomic arousal, and high resilience.',
          goal: 'Maintain gentle restorative habits & celebrate daily ease',
          thoughts: [
            "Your balanced mindset provides a strong foundation for clarity.",
            "Today is an opportunity to enjoy your momentum and share kindness.",
            "Consistent self-care preserves this natural sense of peace."
          ],
          actions: [
            'Take a 2-minute gratitude break: note 3 moments that brought you ease.',
            'Play uplifting soundscapes in Relaxation Rooms.',
            'Sip cool water slowly—mindful hydration refreshes your cognitive focus.'
          ]
        };
      case 'medium':
        return {
          gradient: 'from-amber-700 via-orange-800 to-slate-950',
          accent: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          title: 'Moderate Stress Level',
          description: 'Your indicators reflect noticeable cognitive load and muscular tension. Deliberate decompression is recommended.',
          goal: 'Calm the autonomic nervous system & declutter priorities',
          thoughts: [
            "It is completely okay to pause—resting is an active part of healing.",
            "You don't need to resolve everything today. One gentle step is enough.",
            "Acknowledge your feelings without judging yourself for experiencing them."
          ],
          actions: [
            'Take a 10-minute walk away from digital screens.',
            'Write down 3 intrusive thoughts in Cognitive Explorer and reframe them.',
            'Engage in guided box breathing to lower acute physiological arousal.'
          ]
        };
      case 'high':
        return {
          gradient: 'from-rose-800 via-red-900 to-slate-950',
          accent: 'text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
          title: 'Elevated Stress & High Fatigue',
          description: 'Your multimodal sensors indicate acute nervous system tension, elevated vocal cadence, or significant emotional burden.',
          goal: 'Immediate sensory grounding & compassionate emotional comfort',
          thoughts: [
            "You are not alone—stress is a biological signal, never a personal failure.",
            "Right now, your only job is to breathe softly. Everything else can wait.",
            "You have survived intense storms before, and your resilience remains intact."
          ],
          actions: [
            'Listen to guided ocean waves in Relaxation Rooms for 10 minutes.',
            'Message a trusted loved one in your Support Circle.',
            'Step away from high-stimulus tasks and take physical rest.'
          ]
        };
      default:
        return getStressConfig('medium');
    }
  };

  const config = getStressConfig(assessment.overallStressLevel);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Results Diagnostic Hero */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-6 sm:p-8 text-white border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]`}>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.badge}`}>
                  {assessment.overallStressLevel.toUpperCase()} Stress State
                </span>
                <span className="text-xs text-white/60">
                  {new Date(assessment.date).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {config.title}
              </h1>
              <p className="text-sm text-white/80 mt-1 max-w-xl leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Score Ring Meter */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex flex-col items-center justify-center border border-white/20">
                <span className="text-2xl font-black text-white leading-none">
                  {assessment.stressLevel}
                </span>
                <span className="text-[10px] font-bold text-white/60 uppercase mt-0.5">/ 10</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Diagnostic Score</span>
                <div className={`text-xs font-bold ${config.accent} mt-0.5`}>
                  Goal: {config.goal}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multimodal Analysis Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Text Analysis */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-sky-600 dark:text-sky-400">
              <MessageCircle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">NLP Sentiment</h3>
            </div>
            {assessment.textAnalysis ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Valence:</span>
                  <span className="font-bold capitalize">{assessment.textAnalysis.analysis}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Stress Markers:</span>
                  <span className="font-bold">{assessment.textAnalysis.stressKeywords} detected</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Word Count:</span>
                  <span className="font-bold">{assessment.textAnalysis.wordCount} words</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Not recorded for this session.</p>
            )}
          </div>

          {/* 2. Voice Analysis */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-teal-600 dark:text-teal-400">
              <Activity className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Acoustic Pitch</h3>
            </div>
            {assessment.voiceAnalysis ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Vocal Pitch:</span>
                  <span className="font-bold">{Math.round(assessment.voiceAnalysis.pitch)} Hz</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Speech Cadence:</span>
                  <span className="font-bold">{assessment.voiceAnalysis.pace.toFixed(1)} wps</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Volume Level:</span>
                  <span className="font-bold">{Math.round(assessment.voiceAnalysis.volume)} dB</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Not recorded for this session.</p>
            )}
          </div>

          {/* 3. Facial Biometrics */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
              <Brain className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Facial Tension</h3>
            </div>
            {assessment.facialAnalysis ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Tension Score:</span>
                  <span className="font-bold">{assessment.facialAnalysis.stressLevel.toFixed(1)} / 10</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subjective Mood:</span>
                  <span className="font-bold capitalize">{assessment.mood}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Biometric Sync:</span>
                  <span className="font-bold text-emerald-600">Complete</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Not recorded for this session.</p>
            )}
          </div>

        </div>

        {/* Recommendations & Action Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Motivational Thoughts */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compassionate Mindset Anchors
              </h3>
            </div>

            <div className="space-y-3">
              {config.thoughts.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 leading-relaxed italic">
                  "{t}"
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Breathing Trigger */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Prescribed Recovery Actions
                </h3>
              </div>

              <div className="space-y-2.5">
                {config.actions.map((act, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Box Breathing Trigger */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/40 dark:to-blue-950/40 border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-between gap-3 mt-4">
              <div>
                <span className="text-xs font-bold text-teal-950 dark:text-teal-200 block">Box Breathing Reset (4-4-4-4)</span>
                <span className="text-[11px] text-teal-800 dark:text-teal-300">2-minute autonomic nervous system regulation</span>
              </div>
              <button
                onClick={() => setShowBreathingExercise(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 shadow-md transition-all cursor-pointer"
              >
                Start Exercise
              </button>
            </div>
          </div>

        </div>

        {/* Quick Route Navigators */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/chatbot')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Dr. MindBot</span>
          </button>

          <button
            onClick={() => navigate('/relaxation')}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>Relaxation Rooms</span>
          </button>

          <button
            onClick={() => navigate('/checklist')}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Daily Checklist</span>
          </button>
        </div>

      </main>

      {/* Guided Breathing Modal */}
      {showBreathingExercise && (
        <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
      )}
    </div>
  );
};

export default StressResults;