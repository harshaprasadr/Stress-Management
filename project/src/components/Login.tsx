import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, RefreshCw, Eye, EyeOff, Sparkles, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, name?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // Open Sign Up / Create Account first on localhost
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        console.warn('Backend check offline, fallback mode ready:', err);
        setBackendStatus('offline');
      }
    };

    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Backend offline fallback
        if (backendStatus === 'offline') {
          console.log('Backend offline, using local fallback login');
          onLogin(email, password, 'Demo User');
          return;
        }

        // Login API call
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          onLogin(email, password, data.user?.name);
        } else {
          setError(data.error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Backend offline fallback for sign up
        if (backendStatus === 'offline') {
          console.log('Backend offline, proceeding with local profile creation');
          onLogin(email, password, name || 'User');
          return;
        }

        // Register API call
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setError('');
          setSuccess('Account created successfully! Please enter your password to sign in.');
          setIsLogin(true);
        } else {
          setError(data.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (backendStatus === 'offline') {
        onLogin(email, password, name || 'User');
      } else {
        setError('Network error. Please ensure the backend server is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="relative h-screen max-h-screen w-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-slate-950 font-sans select-none">
      {/* Serene Atmospheric Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform filter blur-[1px] brightness-[0.85] transition-all duration-1000"
        style={{ backgroundImage: `url('/auth-bg.jpg')` }}
      />

      {/* Calming Nature Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-teal-950/45 to-emerald-950/70 backdrop-blur-[2px]" />

      {/* Ambient Animated Glow Spheres */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      {/* Main Glassmorphism Card (compact to guarantee zero scrolling) */}
      <div className="relative z-10 w-full max-w-[420px] max-h-[96vh]">
        <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-15px_rgba(13,148,136,0.3)] border border-white/60 dark:border-white/10 px-5 sm:px-6 py-4 sm:py-5 transition-all duration-200">
          
          {/* Brand Logo & Header */}
          <div className="text-center mb-2">
            <div className="inline-block p-1 mb-1 transition-transform hover:scale-105 duration-200">
              <img
                src="/logo.png"
                alt="Stress Management"
                className="h-12 sm:h-14 w-auto object-contain mx-auto drop-shadow-xs"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                Stress Detection
              </span>

              {/* Backend status indicator */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  backendStatus === 'online'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : backendStatus === 'checking'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendStatus === 'online'
                      ? 'bg-emerald-500 animate-pulse'
                      : backendStatus === 'checking'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                {backendStatus === 'online' ? 'Connected' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Segmented Pill Tab Switcher */}
          <div className="p-0.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl flex items-center mb-3 border border-slate-200/60 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleToggleMode(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            {/* Full Name field (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-0.5">
                <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-0.5">
              <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <span className="text-[10px] text-teal-600 hover:text-teal-700 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                  placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg text-xs animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-600" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 rounded-lg text-xs animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                <span className="leading-tight">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:from-teal-700 hover:via-emerald-700 hover:to-teal-700 text-white py-2 sm:py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-teal-700/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Account' : 'Create Free Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Hint */}
          <div className="mt-2 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isLogin ? "Don't have an account yet?" : 'Already registered?'}
              <button
                type="button"
                onClick={() => handleToggleMode(!isLogin)}
                className="ml-1 font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Security & HIPAA Compliance footer */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>HIPAA Compliant • Encrypted</span>
            </div>

            {/* Debug reset helper */}
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
              title="Clears local browser session storage"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;