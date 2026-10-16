import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Star, 
  Clock, 
  BookOpen, 
  Headphones, 
  Video as VideoIcon, 
  Search,
  ExternalLink,
  Sparkles,
  Library,
  X
} from 'lucide-react';
import { User as UserType } from '../types/User';

interface ResourcesProps {
  user: UserType;
}

const Resources: React.FC<ResourcesProps> = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'music' | 'videos'>('books');
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedEbook, setSelectedEbook] = useState<any>(null);
  const [availableVideos, setAvailableVideos] = useState<any[] | null>(null);

  const books = [
    {
      id: '1',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      description: 'A spiritual guide to living in the present moment and overcoming anxiety.',
      rating: 4.6,
      readTime: '6 hours',
      category: 'Mindfulness',
      cover: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      link: 'https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808',
      ebook: true,
      ebookContent: `Chapter 1: You Are Not Your Mind\n\nThe beginning of freedom is the realization that you are not the possessing entity - the thinker. Knowing this enables you to observe the thinker. The moment you start watching the thinker, a higher level of consciousness becomes activated.\n\nYou then begin to realize that there is a vast realm of intelligence beyond thought, that thought is only a tiny aspect of that intelligence. You also realize that all the things that truly matter - beauty, love, creativity, joy, inner peace - arise from beyond the mind.\n\nThe mind is a superb instrument if used correctly. Used incorrectly, however, it becomes very destructive. To put it more accurately, it is not so much that you use your mind wrongly - you usually don't use it at all. It uses you. This is the disease. You believe you are your mind. This is the delusion. The instrument has taken you over.\n\nChapter 2: Consciousness: The Way Out of Pain\n\nMost people are in love with their particular life drama. Their story is their identity. The ego runs their life. They have their whole sense of self invested in it. Even their - usually unsuccessful - search for an answer, a solution, or for healing becomes part of it. What they don't realize is that their mind is keeping the pain alive, not the situation.\n\nThe mind, in its attempt to understand and solve the pain, keeps looking for answers, explanations, and solutions. But since the mind itself is the very structure of egoic consciousness, the very thing that created the pain in the first place, it cannot find the solution. It can only keep the pain going.\n\nSo whatever you fight, you strengthen, and what you resist, persists.`
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'Build better habits and break bad ones with proven strategies.',
      rating: 4.8,
      readTime: '5 hours',
      category: 'Self-Improvement',
      cover: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      link: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
      ebook: true,
      ebookContent: `Chapter 1: The Surprising Power of Atomic Habits\n\nSmall changes often appear to make no difference until you cross a critical threshold. The most powerful outcomes of any compounding process are delayed. You need to be patient.\n\nAn atomic habit is a little habit that is part of a larger system. Just as atoms are the building blocks of molecules, atomic habits are the building blocks of remarkable results.\n\nIf you want better results, then forget about setting goals. Focus on your system instead. What do I mean by this? If you're a coach, your goal might be to win a championship. Your system is the way you recruit players, manage your assistant coaches, and conduct practice.\n\nIf you're an entrepreneur, your goal might be to build a million-dollar business. Your system is how you test product ideas, hire employees, and run marketing campaigns.\n\nChapter 2: How Your Habits Shape Your Identity\n\nThere are three levels of change: outcome change, process change, and identity change.\n\nThe most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. Your identity emerges out of your habits. Every action is a vote for the type of person you wish to become.`
    },
    {
      id: '3',
      title: 'The Anxiety & Worry Workbook',
      author: 'David A. Clark',
      description: 'Cognitive behavioral techniques for managing anxiety and worry.',
      rating: 4.5,
      readTime: '8 hours',
      category: 'Anxiety Management',
      cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      link: 'https://www.amazon.com/Anxiety-Worry-Workbook-Cognitive-Behavioral/dp/1572249530',
      ebook: true,
      ebookContent: `Chapter 1: Understanding Anxiety and Worry\n\nAnxiety is a normal human emotion that everyone experiences at times. It's our body's natural response to stress, alerting us to potential danger and helping us prepare for action. However, when anxiety becomes excessive, persistent, and interferes with daily life, it may indicate an anxiety disorder.\n\nWorry is the cognitive component of anxiety - it's the mental process of thinking about potential problems or threats. While some worry can be helpful in planning and problem-solving, excessive worry can become a cycle that feeds anxiety and makes it worse.\n\nChapter 2: The Cognitive Model of Anxiety\n\nThe way we think about situations directly affects how we feel and behave. In anxiety, our thoughts often focus on threat, danger, and worst-case scenarios. These thoughts trigger physical symptoms of anxiety, which in turn reinforce our anxious thoughts, creating a vicious cycle.`
    },
    {
      id: '4',
      title: 'Mindful Self-Compassion',
      author: 'Kristin Neff',
      description: 'Learn to treat yourself with kindness and understanding.',
      rating: 4.7,
      readTime: '7 hours',
      category: 'Self-Compassion',
      cover: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
      link: 'https://www.amazon.com/Mindful-Self-Compassion-Workbook-Kristin-Neff/dp/1462526782',
      ebook: true,
      ebookContent: `Chapter 1: What is Self-Compassion?\n\nSelf-compassion involves treating yourself with the same kindness, concern, and support you'd show to a good friend. When we're going through a difficult time, we often treat ourselves harshly, criticizing ourselves for our mistakes and shortcomings. Self-compassion offers an alternative approach.\n\nSelf-compassion has three main components:\n1. Self-kindness: Warmth toward ourselves when we suffer, rather than harsh criticism.\n2. Common humanity: Recognizing that suffering and inadequacy are universal human experiences.\n3. Mindfulness: A balanced approach to negative emotions so feelings are neither suppressed nor exaggerated.\n\nChapter 2: The Benefits of Self-Compassion\n\nResearch has shown that self-compassion is strongly associated with psychological well-being. People who are more self-compassionate tend to be happier, more optimistic, and less anxious and depressed.`
    }
  ];

  const musicTracks = [
    {
      id: '1',
      title: 'Ocean Waves & Rain',
      artist: 'Nature Sounds',
      duration: '15:30',
      category: 'Nature',
      description: 'Calming ocean waves with gentle rain sounds for deep relaxation.',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3'
    },
    {
      id: '2',
      title: 'Forest Morning',
      artist: 'Peaceful Minds',
      duration: '12:45',
      category: 'Nature',
      description: 'Birds chirping in a serene forest setting.',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3'
    },
    {
      id: '3',
      title: 'Meditation Bell',
      artist: 'Zen Studio',
      duration: '20:00',
      category: 'Meditation',
      description: 'Tibetan singing bowls for meditation and mindfulness.',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-memories.mp3'
    },
    {
      id: '4',
      title: 'Gentle Piano',
      artist: 'Calm Music Co.',
      duration: '18:20',
      category: 'Instrumental',
      description: 'Soft piano melodies for stress relief and focus.',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3'
    },
    {
      id: '5',
      title: 'Guided Breathing',
      artist: 'Dr. Wellness',
      duration: '10:00',
      category: 'Guided',
      description: 'Professional guided breathing exercise for anxiety relief.',
      audioUrl: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3'
    }
  ];

  const videos = [
    {
      id: 'v1',
      title: '10-Minute Meditation for Beginners',
      channel: 'Headspace',
      duration: '10:00',
      category: 'Meditation',
      description: 'A simple guided meditation perfect for beginners.',
      youtubeId: 'inpok4MKVLM',
      thumb: 'https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg'
    },
    {
      id: 'v2',
      title: '5-Minute Breathing Exercise',
      channel: 'Calm',
      duration: '5:00',
      category: 'Breathing',
      description: 'Quick breathing technique to reduce stress.',
      youtubeId: 'tybOi4hjZFQ',
      thumb: 'https://img.youtube.com/vi/tybOi4hjZFQ/hqdefault.jpg'
    },
    {
      id: 'v3',
      title: 'Body Scan Meditation',
      channel: 'Mindfulness Exercises',
      duration: '15:00',
      category: 'Meditation',
      description: 'Progressive body scan to release tension.',
      youtubeId: 'hJbRpHZr_d0',
      thumb: 'https://img.youtube.com/vi/hJbRpHZr_d0/hqdefault.jpg'
    },
    {
      id: 'v4',
      title: 'Gentle Yoga for Stress Relief',
      channel: 'Yoga with Adriene',
      duration: '20:00',
      category: 'Yoga',
      description: 'Relaxing yoga poses to calm the mind.',
      youtubeId: 'hJbRpHZr_d0',
      thumb: 'https://img.youtube.com/vi/hJbRpHZr_d0/hqdefault.jpg'
    }
  ];

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;
    return books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [books, searchTerm]);

  const filteredMusic = useMemo(() => {
    if (!searchTerm.trim()) return musicTracks;
    return musicTracks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.artist.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [musicTracks, searchTerm]);

  const filteredVideos = useMemo(() => {
    const source = availableVideos ?? videos;
    if (!searchTerm.trim()) return source;
    return source.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.channel.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [videos, availableVideos, searchTerm]);

  useEffect(() => {
    let isActive = true;
    const checks = videos.map(v => new Promise<typeof v | null>(resolve => {
      const img = new Image();
      img.onload = () => resolve(v);
      img.onerror = () => resolve(null);
      img.src = v.thumb;
    }));
    Promise.all(checks).then(results => {
      if (!isActive) return;
      const valid = results.filter((r): r is typeof videos[number] => r !== null);
      setAvailableVideos(valid);
      if (selectedVideo && !valid.find(v => v.youtubeId === selectedVideo)) {
        setSelectedVideo(null);
      }
    });
    return () => { isActive = false; };
  }, [videos, selectedVideo]);

  const toggleMusic = (trackId: string) => {
    const track = musicTracks.find(t => t.id === trackId);
    if (!track) return;

    if (playingMusic === trackId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingMusic(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setPlayingMusic(trackId);
      const audio = new Audio(track.audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setPlayingMusic(null);
        setCurrentTime(0);
      });
      
      audio.play().catch(() => {
        setPlayingMusic(null);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const openBookLink = (book: any) => {
    window.open(book.link, '_blank');
  };

  const openEbook = (book: any) => {
    setSelectedEbook(book);
  };

  const closeEbook = () => {
    setSelectedEbook(null);
  };

  const playVideo = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto space-y-6">
        
        {/* Resources Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-cyan-900 to-slate-950 p-6 sm:p-8 text-white border border-teal-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(20,184,166,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-teal-200 mb-3">
                <Library className="w-3.5 h-3.5 text-teal-300" />
                <span>Curated Multimedia Sanctuary</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Wellness Resources
              </h1>
              <p className="text-sm text-teal-100/80 mt-1 max-w-xl">
                Explore evidence-based e-books, acoustic meditation frequencies, and expert video guides designed to alleviate emotional fatigue.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Tab Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('books')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'books'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>E-Books & Articles</span>
              </button>

              <button
                onClick={() => setActiveTab('music')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'music'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Relaxing Soundtracks</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'videos'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Guided Videos</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

          </div>
        </div>

        {/* 1. BOOKS TAB */}
        {activeTab === 'books' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex gap-4 hover:shadow-lg transition-all"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-24 h-32 rounded-2xl object-cover shadow-md shrink-0 group-hover:scale-102 transition-transform"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {book.title}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">by {book.author}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">
                      ⏱ {book.readTime}
                    </span>

                    <div className="flex items-center gap-2">
                      {book.ebook && (
                        <button
                          onClick={() => openEbook(book)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-bold transition-all cursor-pointer"
                        >
                          Read E-Book
                        </button>
                      )}
                      <button
                        onClick={() => openBookLink(book)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-teal-600 transition-colors"
                        title="Buy Book"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. MUSIC TAB */}
        {activeTab === 'music' && (
          <div className="space-y-3">
            {filteredMusic.map((track) => {
              const isPlaying = playingMusic === track.id;
              return (
                <div
                  key={track.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${
                    isPlaying 
                      ? 'border-teal-500 shadow-md ring-1 ring-teal-500' 
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleMusic(track.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer ${
                          isPlaying 
                            ? 'bg-teal-500 text-white scale-105' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-500 hover:text-white'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {track.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {track.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{track.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{track.duration}</span>
                    </div>
                  </div>

                  {/* Scrubber when active */}
                  {isPlaying && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-mono text-teal-600 dark:text-teal-400 mb-1.5">
                        <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
                        <span>{track.duration}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all"
                          style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 3. VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            
            {/* Active YouTube Video Player */}
            {selectedVideo && (
              <div className="p-4 sm:p-6 rounded-3xl bg-black border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center gap-2">
                    <VideoIcon className="w-4 h-4 text-teal-400" />
                    Now Streaming Mindfulness Session
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={closeVideo}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-slate-950">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                    title="MindCare Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((v) => (
                <div
                  key={v.id}
                  className="group bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={v.thumb}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => playVideo(v.youtubeId)}
                      className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </button>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                      {v.duration}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-2">{v.channel}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* E-Book Reader Modal */}
      {selectedEbook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEbook.title}</h2>
                <p className="text-xs text-slate-500">by {selectedEbook.author}</p>
              </div>
              <button
                onClick={closeEbook}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div 
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 font-serif text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {selectedEbook.ebookContent}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Preview Edition Chapters 1-2</span>
              <button
                onClick={() => window.open(selectedEbook.link, '_blank')}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
              >
                Purchase Full Edition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Resources;