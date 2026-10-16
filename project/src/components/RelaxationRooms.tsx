import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Wind, 
  Sparkles,
  Waves,
  Trees,
  Mountain,
  Eye,
  Sliders,
  Maximize2,
  ArrowLeft
} from 'lucide-react';

type Scene = 'ocean' | 'forest' | 'mountain' | 'night';

const scenes: Record<Scene, { 
  name: string; 
  subtitle: string;
  image: string; 
  audio: string; 
  tint: string;
  gradient: string;
  icon: any;
}> = {
  ocean: {
    name: 'Ocean Waves',
    subtitle: 'Rhythmic tidal serenity & salt air breeze',
    image: 'https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg?auto=compress&cs=tinysrgb&w=1920',
    audio: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
    tint: 'bg-gradient-to-t from-sky-950/80 via-blue-900/30 to-teal-950/40',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Waves
  },
  forest: {
    name: 'Forest Morning',
    subtitle: 'Sunlit canopy, dew drops & distant bird songs',
    image: 'https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&w=1920',
    audio: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
    tint: 'bg-gradient-to-t from-emerald-950/80 via-teal-900/30 to-green-950/40',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Trees
  },
  mountain: {
    name: 'Calm Mountains',
    subtitle: 'Crisp alpine air, silent peaks & quiet majesty',
    image: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1920',
    audio: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3',
    tint: 'bg-gradient-to-t from-purple-950/80 via-indigo-900/30 to-slate-950/40',
    gradient: 'from-purple-500 to-indigo-500',
    icon: Mountain
  },
  night: {
    name: 'Starry Night',
    subtitle: 'Deep celestial stillness & cosmic tranquility',
    image: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=1920',
    audio: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
    tint: 'bg-gradient-to-t from-indigo-950/90 via-slate-950/60 to-purple-950/50',
    gradient: 'from-indigo-500 to-violet-500',
    icon: Sparkles
  }
};

const RelaxationRooms: React.FC = () => {
  const navigate = useNavigate();
  const [scene, setScene] = useState<Scene>(() => (localStorage.getItem('relax_scene') as Scene) || 'ocean');
  const [lighting, setLighting] = useState<'day' | 'night'>(() => (localStorage.getItem('relax_light') as any) || 'day');
  const [musicOn, setMusicOn] = useState<boolean>(() => localStorage.getItem('relax_music') !== 'off');
  const [volume, setVolume] = useState<number>(0.4);
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('relax_scene', scene);
    localStorage.setItem('relax_light', lighting);
    localStorage.setItem('relax_music', musicOn ? 'on' : 'off');
  }, [scene, lighting, musicOn]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.src = scenes[scene].audio;
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [scene, musicOn]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Breathing Guide Loop
  useEffect(() => {
    if (!breathingActive) return;

    let timer: NodeJS.Timeout;
    const cycle = () => {
      // 4s Inhale -> 4s Hold -> 4s Exhale -> 2s Rest
      setBreathPhase('Inhale');
      setBreathCount(4);
      timer = setTimeout(() => {
        setBreathPhase('Hold');
        setBreathCount(4);
        timer = setTimeout(() => {
          setBreathPhase('Exhale');
          setBreathCount(4);
          timer = setTimeout(() => {
            setBreathPhase('Rest');
            setBreathCount(2);
            timer = setTimeout(cycle, 2000);
          }, 4000);
        }, 4000);
      }, 4000);
    };

    cycle();

    return () => clearTimeout(timer);
  }, [breathingActive]);

  const bgFilter = useMemo(() => {
    if (lighting === 'day') return 'brightness-100 contrast-105';
    return 'brightness-60 contrast-125 saturate-90';
  }, [lighting]);

  return (
    <div className="relative w-screen h-screen min-h-screen bg-slate-950 overflow-hidden select-none">
      {/* 4K Cinematic Scene Background */}
      <img 
        src={scenes[scene].image} 
        alt={scenes[scene].name} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${bgFilter}`} 
      />

      {/* Atmospheric Ambient Tint Overlay */}
      <div className={`absolute inset-0 ${scenes[scene].tint} transition-colors duration-1000 pointer-events-none`} />

      {/* Ambient Vignette & Depth Glow */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />

      {/* Top Floating Bar: Back Button & Breathing Guide */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-30">
        
        {/* Left Side: Back Arrow to Dashboard */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Back Button to Dashboard */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl backdrop-blur-2xl bg-black/60 hover:bg-black/85 border border-white/20 hover:border-white/40 text-white shadow-2xl transition-all duration-200 group cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-xs font-bold tracking-wide">Dashboard</span>
          </button>
        </div>

        {/* Right Side: Breathing Guide Button Trigger */}
        <button
          onClick={() => setBreathingActive(!breathingActive)}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-2xl border transition-all duration-300 shadow-2xl cursor-pointer ${
            breathingActive 
              ? 'bg-teal-500/80 border-teal-300 text-white shadow-teal-500/30' 
              : 'bg-black/60 border-white/20 hover:border-white/40 text-white hover:bg-black/85'
          }`}
        >
          <Wind className={`w-4 h-4 ${breathingActive ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold">
            {breathingActive ? 'Breathing Guide: Active' : 'Start Breath Sync'}
          </span>
        </button>
      </div>

      {/* Central Breathing Guide Orb (Toggled) */}
      {breathingActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            <div 
              className={`absolute rounded-full border border-teal-300/30 transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'w-72 h-72 sm:w-80 sm:h-80 bg-teal-400/10 scale-125' 
                  : breathPhase === 'Hold' 
                  ? 'w-72 h-72 sm:w-80 sm:h-80 bg-cyan-400/20 scale-125 animate-pulse' 
                  : 'w-48 h-48 sm:w-56 sm:h-56 bg-teal-900/10 scale-90'
              }`} 
            />
            <div 
              className={`absolute rounded-full border border-teal-400/20 transition-all duration-700 ${
                breathPhase === 'Inhale' 
                  ? 'w-88 h-88 sm:w-96 sm:h-96 scale-110' 
                  : breathPhase === 'Hold' 
                  ? 'w-88 h-88 sm:w-96 sm:h-96 scale-110' 
                  : 'w-36 h-36 scale-75'
              }`} 
            />

            {/* Glowing Core Orb */}
            <div 
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full backdrop-blur-2xl border-2 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.35)] transition-all duration-1000 ${
                breathPhase === 'Inhale' 
                  ? 'bg-gradient-to-tr from-teal-500/40 to-cyan-400/40 border-teal-300 scale-110' 
                  : breathPhase === 'Hold' 
                  ? 'bg-gradient-to-tr from-cyan-500/40 to-blue-400/40 border-cyan-300 scale-105' 
                  : 'bg-gradient-to-tr from-emerald-600/30 to-teal-700/30 border-teal-400/50 scale-95'
              }`}
            >
              <Wind className="w-7 h-7 text-teal-200 mb-1 animate-pulse" />
              <span className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase">
                {breathPhase}
              </span>
              <span className="text-xs font-semibold text-teal-200/90 mt-1">
                {breathPhase === 'Inhale' ? 'Fill lungs gently' : breathPhase === 'Hold' ? 'Rest in stillness' : breathPhase === 'Exhale' ? 'Release tension' : 'Pause softly'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Audio Waves Indicator (when playing) */}
      {musicOn && (
        <div className="absolute top-20 right-6 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/80">
          <Music className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Audio Playing</span>
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 bg-teal-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-teal-400 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-teal-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-teal-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: '450ms' }} />
          </div>
        </div>
      )}

      {/* Bottom Floating Glassmorphism Control Hub */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-20 transition-all duration-300">
        <div className="relative backdrop-blur-2xl bg-black/60 border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4 sm:p-5 text-white overflow-hidden">
          
          {/* Subtle Top Accent Glow */}
          <div className={`absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r ${scenes[scene].gradient} opacity-80 rounded-full blur-[1px]`} />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* 1. Scene Selector Pills (Zero scrollers) */}
            <div 
              className="flex items-center gap-2 overflow-x-auto overflow-y-hidden w-full lg:w-auto py-1.5 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider mr-1 hidden sm:inline flex-shrink-0">
                Scene
              </span>
              {(Object.keys(scenes) as Scene[]).map((key) => {
                const s = scenes[key];
                const Icon = s.icon;
                const isActive = scene === key;
                return (
                  <button
                    key={key}
                    onClick={() => setScene(key)}
                    className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isActive 
                        ? `bg-gradient-to-r ${s.gradient} text-white shadow-lg shadow-black/40 ring-2 ring-white/30 border border-white/20` 
                        : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 2. Controls Group (Lighting + Audio + Volume) */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
              
              {/* Day / Night Switch */}
              <div className="flex items-center bg-white/10 rounded-2xl p-1 border border-white/10">
                <button
                  onClick={() => setLighting('day')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    lighting === 'day' 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => setLighting('night')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    lighting === 'night' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Night</span>
                </button>
              </div>

              {/* Ambient Music Toggle & Volume */}
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl p-1 px-2 border border-white/10">
                <button
                  onClick={() => setMusicOn(!musicOn)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    musicOn 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'bg-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {musicOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{musicOn ? 'Sound On' : 'Muted'}</span>
                </button>

                {/* Volume Slider */}
                {musicOn && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <span className="text-[10px] text-white/60 w-6 font-mono">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default RelaxationRooms;
