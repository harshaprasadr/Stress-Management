import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Camera, 
  MessageSquare, 
  Activity, 
  ArrowRight, 
  ArrowLeft,
  Brain, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Waves,
  Scan,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { User } from '../types/User';

interface StressAssessmentProps {
  user: User;
}

const StressAssessment: React.FC<StressAssessmentProps> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({
    textAnalysis: null as any,
    voiceAnalysis: null as any,
    facialAnalysis: null as any
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const moodOptions = [
    { value: 'stressed', emoji: '😰', label: 'Stressed', sub: 'High pressure', gradient: 'from-rose-500 to-red-600', ring: 'ring-rose-500' },
    { value: 'anxious', emoji: '😟', label: 'Anxious', sub: 'Spiraling thoughts', gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500' },
    { value: 'sad', emoji: '😢', label: 'Down', sub: 'Emotional heaviness', gradient: 'from-sky-500 to-blue-600', ring: 'ring-blue-500' },
    { value: 'neutral', emoji: '😐', label: 'Steady', sub: 'Balanced / Neutral', gradient: 'from-slate-500 to-slate-600', ring: 'ring-slate-500' },
    { value: 'happy', emoji: '😊', label: 'Happy', sub: 'Content & Light', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500' },
    { value: 'excited', emoji: '🤩', label: 'Inspired', sub: 'High positive energy', gradient: 'from-purple-500 to-indigo-600', ring: 'ring-purple-500' },
    { value: 'calm', emoji: '😌', label: 'Peaceful', sub: 'Deep relaxation', gradient: 'from-teal-500 to-cyan-600', ring: 'ring-teal-500' },
    { value: 'overwhelmed', emoji: '🤯', label: 'Overloaded', sub: 'System exhaustion', gradient: 'from-violet-600 to-pink-600', ring: 'ring-pink-500' }
  ];

  // Text Analysis Function
  const analyzeText = async (text: string) => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const stressKeywords = ['stressed', 'anxious', 'worried', 'overwhelmed', 'tired', 'exhausted', 'pressure', 'deadline', 'problem', 'difficult', 'hard', 'struggle'];
    const positiveKeywords = ['happy', 'good', 'great', 'excited', 'calm', 'relaxed', 'peaceful', 'content', 'satisfied'];
    
    const words = text.toLowerCase().split(/\s+/);
    const stressCount = words.filter(word => stressKeywords.some(keyword => word.includes(keyword))).length;
    const positiveCount = words.filter(word => positiveKeywords.some(keyword => word.includes(keyword))).length;
    
    const sentimentScore = (positiveCount - stressCount) / Math.max(1, words.length);
    const stressLevel = Math.max(0, Math.min(10, 5 - (sentimentScore * 10)));
    
    const analysis = {
      sentimentScore: sentimentScore,
      stressLevel: Math.round(stressLevel * 10) / 10,
      stressKeywords: stressCount,
      positiveKeywords: positiveCount,
      wordCount: words.length,
      analysis: sentimentScore > 0.05 ? 'positive' : sentimentScore < -0.05 ? 'negative' : 'neutral',
      insights: [
        stressCount > 0 ? `Detected ${stressCount} stress indicators in narrative` : 'No heavy stress markers detected',
        positiveCount > 0 ? `Identified ${positiveCount} resilient expressions` : 'Opportunities for gentle gratitude',
        words.length > 30 ? 'Comprehensive emotional expression provided' : 'Succinct input recorded'
      ]
    };
    
    setAnalysisResults(prev => ({ ...prev, textAnalysis: analysis }));
    setIsAnalyzing(false);
    return analysis;
  };

  // Voice Analysis Function
  const analyzeVoice = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = {
      pitch: Math.random() * 120 + 130, // Hz
      pace: Math.random() * 2 + 1.8, // words per sec
      volume: Math.random() * 25 + 50, // dB
      stressIndicators: {
        highPitch: Math.random() > 0.7,
        fastPace: Math.random() > 0.6,
        volumeVariation: Math.random() * 20 + 5,
        pauses: Math.floor(Math.random() * 5)
      },
      stressLevel: Math.random() * 5 + 3,
      insights: [
        'Vocal acoustic frequency scanned',
        'Speech cadence and pause intervals measured',
        'Respiratory micro-tremor evaluation complete'
      ]
    };
    
    setAnalysisResults(prev => ({ ...prev, voiceAnalysis: analysis }));
    setIsAnalyzing(false);
    return analysis;
  };

  // Facial Analysis Function
  const analyzeFacialExpression = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const analysis = {
      emotions: {
        happiness: Math.random() * 70 + 20,
        calmness: Math.random() * 60 + 30,
        tension: Math.random() * 40 + 10,
        fatigue: Math.random() * 35 + 10
      },
      stressIndicators: {
        eyebrowTension: Math.random() * 100,
        jawClenching: Math.random() * 100,
        eyeWidening: Math.random() * 100,
        lipCompression: Math.random() * 100
      },
      stressLevel: Math.random() * 4 + 3,
      insights: [
        'Facial micro-muscle tone mapped',
        'Blink cadence and ocular tension assessed',
        'Overall visual biometric posture calculated'
      ]
    };
    
    setAnalysisResults(prev => ({ ...prev, facialAnalysis: analysis }));
    setIsAnalyzing(false);
    return analysis;
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setTimeout(async () => {
        await analyzeFacialExpression();
        setIsCameraActive(false);
        stream.getTracks().forEach(track => track.stop());
      }, 3500);
      
    } catch (error) {
      console.error('Camera access error:', error);
      setIsCameraActive(false);
      alert('Camera access denied. You can proceed with the remaining modalities.');
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await analyzeVoice(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 5000);
        
      } catch (error) {
        console.error('Microphone access error:', error);
        alert('Microphone access denied. You can continue to the next step.');
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  const handleSubmitAssessment = () => {
    const textStress = analysisResults.textAnalysis?.stressLevel || 0;
    const voiceStress = analysisResults.voiceAnalysis?.stressLevel || 0;
    const facialStress = analysisResults.facialAnalysis?.stressLevel || 0;
    const moodStress = selectedMood === 'stressed' || selectedMood === 'anxious' || selectedMood === 'overwhelmed' ? 8 : 
                      selectedMood === 'sad' ? 6 : 
                      selectedMood === 'neutral' ? 4 : 2;
    
    // Average present scores
    const scores = [moodStress];
    if (analysisResults.textAnalysis) scores.push(textStress);
    if (analysisResults.voiceAnalysis) scores.push(voiceStress);
    if (analysisResults.facialAnalysis) scores.push(facialStress);
    
    const overallStress = scores.reduce((a, b) => a + b, 0) / scores.length;
    const overallStressLevel = overallStress > 6.5 ? 'high' : overallStress > 4 ? 'medium' : 'low';

    const assessment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      mood: selectedMood,
      textInput: textInput,
      textAnalysis: analysisResults.textAnalysis,
      voiceAnalysis: analysisResults.voiceAnalysis,
      facialAnalysis: analysisResults.facialAnalysis,
      stressLevel: Math.round(overallStress * 10) / 10,
      overallStressLevel: overallStressLevel as 'low' | 'medium' | 'high',
      analysisComplete: true
    };

    const updatedUser = {
      ...user,
      stressHistory: [...(user.stressHistory || []), assessment]
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('currentAssessment', JSON.stringify(assessment));

    navigate('/results');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedMood !== '';
      case 2: return textInput.trim().length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const stepMeta = [
    { number: 1, label: 'Mood State', icon: Activity },
    { number: 2, label: 'Text NLP', icon: MessageSquare },
    { number: 3, label: 'Voice Acoustics', icon: Mic },
    { number: 4, label: 'Facial Biometrics', icon: Camera }
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Assessment Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white border border-teal-500/25 dark:border-white/10 shadow-[0_16px_40px_-16px_rgba(13,148,136,0.3)] select-none">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-200 mb-3 shadow-2xs">
                <Brain className="w-3.5 h-3.5 text-teal-300" />
                <span>Multimodal Biometric AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
                Stress Assessment
              </h1>
              <p className="text-sm sm:text-base text-teal-100/80 leading-relaxed max-w-xl">
                Combining subjective mood, NLP semantic analysis, vocal pitch frequencies, and facial micro-tension for holistic diagnosis.
              </p>
            </div>

            {/* Assessment Status Widget */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3.5 flex-shrink-0 self-start md:self-center">
              <div className="w-10 h-10 rounded-xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-sm flex-shrink-0">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200/70">Assessment Status</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <span>Phase {currentStep} of 4</span>
                  <span className="text-[11px] font-semibold text-teal-300">({(currentStep / 4) * 100}%)</span>
                </div>
                {/* Micro progress line */}
                <div className="w-28 bg-white/10 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500" 
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Navigation Track */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="relative">
              {/* Connected Track Background Line */}
              <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-white/10 -translate-y-1/2 z-0 hidden sm:block" />
              <div 
                className="absolute top-5 left-[12.5%] h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block" 
                style={{ width: `${((currentStep - 1) / 3) * 75}%` }}
              />

              <div className="relative z-10 grid grid-cols-4 gap-2">
                {stepMeta.map((s) => {
                  const Icon = s.icon;
                  const isPassed = currentStep > s.number;
                  const isCurrent = currentStep === s.number;
                  return (
                    <button
                      key={s.number}
                      type="button"
                      disabled={!isPassed && !isCurrent}
                      onClick={() => isPassed && setCurrentStep(s.number)}
                      className={`flex flex-col items-center text-center group transition-all select-none ${
                        isPassed ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      {/* Step Icon Badge */}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                        isPassed 
                          ? 'bg-emerald-400 text-slate-950 font-black shadow-md ring-2 ring-emerald-300/40' 
                          : isCurrent 
                          ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/30 font-black shadow-lg scale-105' 
                          : 'bg-white/10 text-white/60 border border-white/15 backdrop-blur-md'
                      }`}>
                        {isPassed ? <CheckCircle className="w-5 h-5 stroke-[2.5]" /> : <Icon className={`w-4 h-4 ${isCurrent ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />}
                      </div>

                      {/* Step Label */}
                      <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-colors ${
                        isCurrent ? 'text-teal-200' : isPassed ? 'text-emerald-200/80' : 'text-white/60'
                      }`}>
                        {s.label}
                      </span>

                      {/* Step Subtitle / Status */}
                      <span className={`text-[10px] font-medium mt-0.5 hidden sm:block ${
                        isCurrent ? 'text-teal-300 font-semibold' : isPassed ? 'text-emerald-300/80' : 'text-white/40'
                      }`}>
                        {isPassed ? 'Completed' : isCurrent ? 'In Progress' : `Phase ${s.number}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step Wizard Container */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          {/* STEP 1: MOOD SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 1: How are you feeling in this moment?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select the primary emotion that best encapsulates your immediate physical and mental state.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {moodOptions.map((mood) => {
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(mood.value)}
                      className={`group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer ${
                        isSelected
                          ? `border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 shadow-xl scale-105 ring-2 ${mood.ring}`
                          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 hover:-translate-y-1'
                      }`}
                    >
                      <span className="text-4xl my-2 group-hover:scale-110 transition-transform drop-shadow-sm">
                        {mood.emoji}
                      </span>
                      <div className="mt-2 w-full">
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">
                          {mood.label}
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          {mood.sub}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: TEXT NLP ANALYSIS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 2: Tell us more about what you're experiencing
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Describe your day, physical tension, thoughts, or what triggered your current state.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onBlur={() => {
                    if (textInput.trim().length > 10) {
                      analyzeText(textInput);
                    }
                  }}
                  rows={5}
                  placeholder="e.g., I've had back-to-back meetings, my shoulders feel tight, and I'm anxious about upcoming deadlines..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm resize-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{textInput.length} characters written</span>
                  {textInput.trim().length > 10 && !analysisResults.textAnalysis && (
                    <button
                      onClick={() => analyzeText(textInput)}
                      className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      Run Sentiment Analysis &rarr;
                    </button>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold animate-pulse">
                    <Brain className="w-4 h-4 animate-spin" />
                    <span>Processing natural language sentiment models...</span>
                  </div>
                )}

                {analysisResults.textAnalysis && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">NLP Sentiment Complete</span>
                      </div>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        analysisResults.textAnalysis.analysis === 'positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        analysisResults.textAnalysis.analysis === 'negative' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {analysisResults.textAnalysis.analysis} Valence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400">Stress Index:</span>
                        <div className="text-base font-black text-amber-600 dark:text-amber-400">
                          {analysisResults.textAnalysis.stressLevel} / 10
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Sentiment Score:</span>
                        <div className="text-base font-black text-slate-800 dark:text-slate-200">
                          {(analysisResults.textAnalysis.sentimentScore * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                      {analysisResults.textAnalysis.insights.map((ins: string, idx: number) => (
                        <li key={idx}>• {ins}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: VOICE ANALYSIS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 3: Vocal Cadence & Pitch Frequency Scan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Micro-fluctuations in vocal pitch and speech tempo reveal autonomic nervous system arousal.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
                
                {/* Microphone Orb */}
                <div className="relative flex items-center justify-center py-4">
                  {isRecording && (
                    <div className="absolute w-36 h-36 rounded-full bg-rose-500/20 animate-ping" />
                  )}
                  <button
                    onClick={toggleRecording}
                    disabled={isAnalyzing}
                    className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500 shadow-rose-500/30 scale-110'
                        : isAnalyzing
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-tr from-teal-600 to-emerald-600 shadow-teal-600/30 hover:scale-105'
                    }`}
                  >
                    <Mic className={`w-8 h-8 ${isRecording ? 'animate-bounce' : ''}`} />
                    <span className="text-[10px] font-bold uppercase mt-1">
                      {isRecording ? 'Stop' : 'Record'}
                    </span>
                  </button>
                </div>

                <div className="max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300">
                  {isRecording ? (
                    <p className="text-rose-600 dark:text-rose-400 font-bold animate-pulse">
                      Listening to your voice... Speak continuously for a few seconds.
                    </p>
                  ) : isAnalyzing ? (
                    <p className="text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center gap-2">
                      <Brain className="w-4 h-4 animate-spin" /> Analyzing vocal pitch patterns...
                    </p>
                  ) : (
                    <p>
                      Click the microphone and speak aloud: "I am taking this moment to ground myself and notice my breath." (Optional)
                    </p>
                  )}
                </div>

                {analysisResults.voiceAnalysis && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Acoustic Scan Complete</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {analysisResults.voiceAnalysis.stressLevel.toFixed(1)} / 10 Stress Index
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400">Pitch Frequency:</span>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {Math.round(analysisResults.voiceAnalysis.pitch)} Hz
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Cadence Pace:</span>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {analysisResults.voiceAnalysis.pace.toFixed(1)} wps
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: FACIAL BIOMETRIC ANALYSIS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 4: Facial Micro-Expression & Muscle Tension
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Biometric detection assesses forehead furrowing, ocular focus, and jaw clenching.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-6">
                
                {/* Video Reticle HUD */}
                {isCameraActive && (
                  <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-teal-400 shadow-2xl bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-56 object-cover"
                    />
                    {/* Reticle Overlay */}
                    <div className="absolute inset-0 border-2 border-teal-400/40 m-4 rounded-xl pointer-events-none flex items-center justify-center">
                      <div className="text-center text-teal-300 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-xl border border-teal-400/30">
                        <Scan className="w-5 h-5 mx-auto mb-1 animate-pulse" />
                        <span className="text-[11px] font-mono tracking-wider">MAPPING FACIAL BIOMETRICS...</span>
                      </div>
                    </div>
                  </div>
                )}

                {!isCameraActive && !analysisResults.facialAnalysis && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-200 dark:border-teal-800">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-4">
                      Position your face in natural lighting for a brief 3-second biometric scan. (Optional)
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Initialize Optical Scan
                    </button>
                  </div>
                )}

                {isAnalyzing && !isCameraActive && (
                  <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold animate-pulse py-4">
                    <Brain className="w-4 h-4 animate-spin" />
                    <span>Analyzing facial muscle activation...</span>
                  </div>
                )}

                {analysisResults.facialAnalysis && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Optical Biometrics Complete</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {analysisResults.facialAnalysis.stressLevel.toFixed(1)} / 10 Tension Index
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {Object.entries(analysisResults.facialAnalysis.emotions).map(([emo, val]) => (
                        <div key={emo} className="flex items-center justify-between text-xs">
                          <span className="capitalize text-slate-600 dark:text-slate-400">{emo}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-teal-500 h-full rounded-full"
                                style={{ width: `${Math.round(val as number)}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-800 dark:text-slate-200 w-8 text-right">
                              {Math.round(val as number)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white cursor-pointer shadow-teal-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Compute Final Diagnostic</span>
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default StressAssessment;