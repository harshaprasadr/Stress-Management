import React, { useEffect, useRef, useState } from 'react';
import { 
  PenTool, 
  Eraser, 
  Save, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon, 
  Palette, 
  BookOpen, 
  Download,
  Trash2,
  Maximize2,
  CheckCircle2,
  X,
  Layers,
  HeartHandshake
} from 'lucide-react';

type JournalEntry = {
  id: string;
  date: string;
  prompt?: string;
  text: string;
};

const JOURNAL_KEY = 'creative_journal_entries';

const prompts = [
  'Draw how your stress feels today in shapes, flowing lines, and textures.',
  'Write about one small, gentle win or quiet moment from this week.',
  'Create a mood collage with contrasting colors and freeform strokes.',
  'Sketch a quiet sanctuary or safe place where your mind feels completely calm.',
  'Write a warm, compassionate note to your future self when times get busy.',
  'Visualize breathing out tension: what color and shape does it take?'
];

const colorPalette = [
  { name: 'Sapphire', color: '#2563eb' },
  { name: 'Teal', color: '#0d9488' },
  { name: 'Emerald', color: '#16a34a' },
  { name: 'Coral', color: '#f43f5e' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Obsidian', color: '#1e293b' }
];

const CreativeStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [size, setSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [prompt, setPrompt] = useState<string>('');
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]'); } catch { return []; }
  });
  const [isSaved, setIsSaved] = useState(false);
  const [previewEntry, setPreviewEntry] = useState<{ id: string; url: string; prompt?: string; text: string; date: string } | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!prompt) setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [prompt]);

  const refreshPrompt = () => {
    const next = prompts.filter(p => p !== prompt);
    setPrompt(next[Math.floor(Math.random() * next.length)]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const getTouchCoordinates = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  };

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    lastPos.current = coords;
    draw(coords.x, coords.y, false);
  };

  const onUp = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    draw(coords.x, coords.y, true);
    lastPos.current = coords;
  };

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getTouchCoordinates(e);
    lastPos.current = coords;
    draw(coords.x, coords.y, false);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const coords = getTouchCoordinates(e);
    draw(coords.x, coords.y, true);
    lastPos.current = coords;
  };

  const draw = (x: number, y: number, isLine: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const strokeColor = isEraser ? '#ffffff' : color;
    const strokeSize = isEraser ? size * 2.5 : size;

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isLine && lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, strokeSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `mindful-artwork-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveEntry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const id = Math.random().toString(36).slice(2);
    const date = new Date().toISOString();
    const entry: JournalEntry = { id, date, prompt, text };
    const next = [entry, ...entries].slice(0, 30);
    setEntries(next);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    localStorage.setItem(`creative_image_${id}`, dataUrl);
    setText('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const deleteEntry = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = entries.filter(item => item.id !== id);
    setEntries(next);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    localStorage.removeItem(`creative_image_${id}`);
    if (previewEntry?.id === id) setPreviewEntry(null);
  };

  const openPreview = (item: JournalEntry) => {
    const url = localStorage.getItem(`creative_image_${item.id}`);
    if (url) {
      setPreviewEntry({
        id: item.id,
        url,
        prompt: item.prompt,
        text: item.text,
        date: item.date
      });
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 select-none">
      <main className="max-w-6xl mx-auto space-y-6">
        
        {/* Creative Easel Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-950 p-6 sm:p-8 text-white border border-indigo-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-200 mb-3">
                <Palette className="w-3.5 h-3.5 text-indigo-300" />
                <span>Expressive Art & Mindful Journal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Creative Studio
              </h1>
              <p className="text-sm text-indigo-100/80 mt-1 max-w-xl leading-relaxed">
                Activate right-hemisphere cognitive flow with freeform drawing and stream-of-consciousness journaling to release emotional tension.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshPrompt}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 text-white/90 text-xs font-bold transition-all shadow-xl cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-indigo-300" />
                <span>Shuffle Prompt</span>
              </button>

              <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>{entries.length} Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Inspiration Banner (Anchors both panels equally) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200/80 dark:border-indigo-800/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Today's Guided Focus
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                "{prompt}"
              </p>
            </div>
          </div>

          <button
            onClick={refreshPrompt}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-center"
          >
            <span>Change</span>
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Studio Workspace: Synchronized Side-by-Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 1. Digital Easel Canvas Card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Expression Easel</h2>
                    <p className="text-[11px] text-slate-400">Tactile digital canvas</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={downloadCanvas}
                    title="Download Artwork"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={clearCanvas}
                    title="Clear Canvas"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tools & Palette Dock */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 mb-4">
                {/* Palette Swatches */}
                <div className="flex items-center gap-1.5">
                  {colorPalette.map((p) => {
                    const isSelected = !isEraser && color === p.color;
                    return (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => {
                          setColor(p.color);
                          setIsEraser(false);
                        }}
                        style={{ backgroundColor: p.color }}
                        className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                          isSelected ? 'scale-110 ring-2 ring-indigo-500 shadow-xs' : 'hover:scale-105 opacity-90 hover:opacity-100'
                        }`}
                        title={p.name}
                      />
                    );
                  })}
                  
                  {/* Custom Color Input */}
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600 cursor-pointer">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        setIsEraser(false);
                      }}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      title="Custom Color"
                    />
                    <div 
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>

                {/* Brush / Eraser & Stroke Controls */}
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => setIsEraser(!isEraser)}
                    className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      isEraser 
                        ? 'bg-rose-500 text-white shadow-xs' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Eraser</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Size:</span>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400 w-6 text-right">
                      {size}p
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas Board (Standardized 390px height) */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200/80 dark:border-slate-700 shadow-inner bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  onMouseDown={onDown}
                  onMouseUp={onUp}
                  onMouseLeave={onUp}
                  onMouseMove={onMove}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onUp}
                  className="w-full h-[360px] sm:h-[390px] bg-white cursor-crosshair touch-none"
                />
              </div>
            </div>

            {/* Canvas Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-indigo-500" />
                <span>Expressive strokes & non-verbal release</span>
              </span>
              <span>800 × 500 Hi-Res Canvas</span>
            </div>
          </div>

          {/* 2. Mindful Journal Card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Reflective Journal</h2>
                    <p className="text-[11px] text-slate-400">Stream-of-consciousness writing</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {text.length} chars
                  </span>
                  {text && (
                    <button
                      onClick={() => setText('')}
                      className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Context Prompt Chip */}
              <div className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-900 dark:text-purple-200 truncate">
                  Topic: {prompt}
                </span>
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 shrink-0 ml-2">
                  Active Focus
                </span>
              </div>

              {/* Textarea (Standardized 390px height to match canvas perfectly) */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your unfiltered thoughts, translate what your drawing represents, or release what you're holding inside today..."
                  className="w-full h-[360px] sm:h-[390px] p-4 text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Save Studio Session Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isSaved ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                    <span>Artwork & journal saved!</span>
                  </span>
                ) : (
                  <span>Archives canvas & reflection together.</span>
                )}
              </span>

              <button
                onClick={saveEntry}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </button>
            </div>
          </div>

        </div>

        {/* Gallery of Past Creations */}
        {entries.length > 0 && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Studio Archives & Past Creations ({entries.length})
                  </h3>
                  <p className="text-xs text-slate-400">Click any artwork to open high-resolution gallery view</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {entries.map((item) => {
                const imgUrl = localStorage.getItem(`creative_image_${item.id}`);
                return (
                  <div
                    key={item.id}
                    onClick={() => openPreview(item)}
                    className="group relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-white border border-slate-200/60 dark:border-slate-700 mb-3 shadow-2xs group-hover:shadow-xs transition-shadow">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={item.prompt || 'Artwork'} 
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                            <Maximize2 className="w-3 h-3" /> View Art
                          </span>
                        </div>
                      </div>

                      {/* Header with Date & Delete */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                        <button
                          onClick={(e) => deleteEntry(item.id, e)}
                          title="Delete from Archive"
                          className="p-1 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Prompt */}
                      {item.prompt && (
                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-xl mb-2 line-clamp-2">
                          "{item.prompt}"
                        </p>
                      )}

                      {/* Notes snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.text || '(No text notes recorded)'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* In-App Full Artwork Preview Modal */}
      {previewEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
              <div className="min-w-0 pr-3">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {previewEntry.prompt || 'Mindful Artwork'}
                </h4>
                <p className="text-xs text-slate-400">
                  Created on {new Date(previewEntry.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `artwork-${previewEntry.id}.png`;
                    link.href = previewEntry.url;
                    link.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setPreviewEntry(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white shadow-inner flex items-center justify-center p-2">
                <img 
                  src={previewEntry.url} 
                  alt="Saved Artwork" 
                  className="max-h-[50vh] w-auto object-contain mx-auto"
                />
              </div>

              {previewEntry.text && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Accompanying Reflection Notes:
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line">
                    {previewEntry.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeStudio;
