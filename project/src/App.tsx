import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PersonalInfo from './components/PersonalInfo';
import Dashboard from './components/Dashboard';
import StressAssessment from './components/StressAssessment';
import StressResults from './components/StressResults';
import Chatbot from './components/Chatbot';
import WeeklyReport from './components/WeeklyReport';
import Checklist from './components/Checklist';
import Resources from './components/Resources';
import Feedback from './components/Feedback';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import LaughterTherapy from './components/LaughterTherapy';
import MoodTracker from './components/MoodTracker';
import RelaxationRooms from './components/RelaxationRooms';
import CreativeStudio from './components/CreativeStudio';
import StoryTherapy from './components/StoryTherapy';
import SupportCircle from './components/SupportCircle';
import CognitiveExplorer from './components/CognitiveExplorer';
import AppLayout from './components/AppLayout';
import ScrollToTop from './components/ScrollToTop';
import { User } from './types/User';
import { I18nProvider } from './i18n';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<'login' | 'personal-info' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app state from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Check if profile is complete before going to dashboard
        if (userData.firstName && userData.lastName && userData.age && userData.gender && userData.occupation) {
          setCurrentStep('dashboard');
        } else {
          setCurrentStep('personal-info');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        setCurrentStep('login');
      }
    } else {
      setCurrentStep('login');
    }
    setIsLoading(false);
  }, []); // Empty dependency array - only run once on mount

  const handleLogin = (email: string, password: string, name?: string) => {
    console.log('handleLogin called with:', { email, name });
    
    // For new users, create temporary user and require profile completion
    const tempUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || '',
      email,
      firstName: '',
      lastName: '',
      age: 0,
      gender: '',
      occupation: '',
      emergencyContact: '',
      medicalConditions: '',
      currentMedications: '',
      stressHistory: [],
      weeklyReports: [],
      checklists: []
    } as User;
    
    setUser(tempUser);
    setCurrentStep('personal-info');
  };

  const handlePersonalInfo = (userInfo: Partial<User>) => {
    const newUser: User = {
      id: user?.id || Math.random().toString(36).substr(2, 9),
      email: user?.email || '',
      ...userInfo,
      stressHistory: user?.stressHistory || [],
      weeklyReports: user?.weeklyReports || [],
      checklists: user?.checklists || []
    } as User;
    
    console.log('Saving user data:', newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setCurrentStep('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentStep('login');
  };

  console.log('App render - currentStep:', currentStep, 'user:', user, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (currentStep === 'personal-info') {
    return <PersonalInfo onSubmit={handlePersonalInfo} user={user} />;
  }

  // Fallback for unexpected states
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <I18nProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
            <Routes>
              {/* Common AppLayout providing fixed Sidebar and TopNavbar for every single page */}
              <Route element={<AppLayout user={user!} onLogout={handleLogout} />}>
                <Route path="/" element={<Dashboard user={user!} onLogout={handleLogout} />} />
                <Route path="/assessment" element={<StressAssessment user={user!} />} />
                <Route path="/results" element={<StressResults user={user!} />} />
                <Route path="/chatbot" element={<Chatbot user={user!} />} />
                <Route path="/reports" element={<WeeklyReport user={user!} />} />
                <Route path="/checklist" element={<Checklist user={user!} />} />
                <Route path="/resources" element={<Resources user={user!} />} />
                <Route path="/feedback" element={<Feedback user={user!} />} />
                <Route path="/laughter" element={<LaughterTherapy />} />
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/relaxation" element={<RelaxationRooms />} />
                <Route path="/creative" element={<CreativeStudio />} />
                <Route path="/story" element={<StoryTherapy />} />
                <Route path="/support-circle" element={<SupportCircle />} />
                <Route path="/cognitive-explorer" element={<CognitiveExplorer />} />
                <Route path="/profile" element={<Profile user={user!} />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;