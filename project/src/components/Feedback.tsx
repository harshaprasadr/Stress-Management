import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Star, 
  Send, 
  ThumbsUp, 
  Heart, 
  Sparkles, 
  CheckCircle2,
  HelpCircle,
  Brain,
  Bot,
  BookOpen,
  Wrench,
  Lightbulb
} from 'lucide-react';
import { User } from '../types/User';

interface FeedbackProps {
  user: User;
}

const Feedback: React.FC<FeedbackProps> = ({ user }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'general', label: 'Overall Experience', icon: Heart },
    { value: 'assessment', label: 'Biometric Assessment', icon: Brain },
    { value: 'chatbot', label: 'AI Counselor (Dr. MindBot)', icon: Bot },
    { value: 'resources', label: 'Library & Multimedia', icon: BookOpen },
    { value: 'technical', label: 'Technical Performance', icon: Wrench },
    { value: 'suggestions', label: 'Feature Ideas', icon: Lightbulb }
  ];

  const ratingDescriptions: Record<number, string> = {
    1: 'Needs significant improvement',
    2: 'Fair, but room to grow',
    3: 'Good and helpful',
    4: 'Very uplifting & effective',
    5: 'Outstanding & transformative'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    const feedbackData = {
      id: Date.now().toString(),
      userId: user.id,
      rating,
      category,
      feedback,
      timestamp: new Date().toISOString()
    };

    const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    localStorage.setItem('userFeedback', JSON.stringify([...existingFeedback, feedbackData]));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-200/80 dark:border-emerald-900/50 max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/25">
            <Heart className="w-10 h-10 fill-current" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Thank You Deeply! 💚
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Your candid feedback directly steers our multimodal wellness algorithms and UI design to better serve everyone seeking mental peace.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
            >
              Return to Wellness Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Feedback Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-700 via-rose-800 to-slate-950 p-6 sm:p-8 text-white border border-pink-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(244,63,94,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-pink-200 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
              <span>Community Reflection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Share Your Thoughts
            </h1>
            <p className="text-sm text-pink-100/80 mt-1 max-w-xl">
              We continually refine StressLytix based on how you experience each module. Your voice directly guides new features and sensory improvements.
            </p>
          </div>
        </div>

        {/* Feedback Form Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                1. How would you rate your overall experience?
              </label>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform duration-200 hover:scale-125 focus:outline-none p-1"
                      >
                        <Star 
                          className={`w-9 h-9 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                              : 'text-slate-200 dark:text-slate-700'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {(hoverRating || rating) ? (
                    <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {ratingDescriptions[hoverRating || rating]}
                    </span>
                  ) : (
                    <span className="text-slate-400">Click a star to rate</span>
                  )}
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                2. Which area does your feedback focus on?
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isSelected = category === cat.value;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40 shadow-sm ring-1 ring-pink-500'
                          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${
                        isSelected ? 'text-pink-950 dark:text-pink-200' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Reflections Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Share your detailed feedback & suggestions
                </label>
                <span className="text-[11px] text-slate-400">{feedback.length} characters</span>
              </div>

              <textarea
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What felt wonderful? What can we make smoother, calmer, or more effective?..."
                className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>

            {/* Submission Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                {rating === 0 ? 'Please select a star rating to submit' : 'Ready to submit'}
              </span>

              <button
                type="submit"
                disabled={rating === 0}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${
                  rating > 0
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white cursor-pointer shadow-pink-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
};

export default Feedback;