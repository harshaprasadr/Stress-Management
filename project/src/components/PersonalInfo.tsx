import React, { useState } from 'react';
import { User, UserCheck, Calendar, Users, Briefcase, Phone, Heart, Pill, HeartPulse, ChevronRight, ChevronLeft, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface PersonalInfoProps {
  onSubmit: (userInfo: any) => void;
  user?: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ onSubmit, user }) => {
  // Pre-fill name from registration if available
  const nameParts = (user?.name || '').trim().split(' ');
  const initialFirst = user?.firstName || nameParts[0] || '';
  const initialLast = user?.lastName || nameParts.slice(1).join(' ') || '';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [validationError, setValidationError] = useState('');

  const [formData, setFormData] = useState({
    firstName: initialFirst,
    lastName: initialLast,
    age: user?.age ? String(user.age) : '',
    gender: user?.gender || '',
    occupation: user?.occupation || '',
    emergencyContact: user?.emergencyContact || '',
    medicalConditions: user?.medicalConditions || '',
    currentMedications: user?.currentMedications || '',
    email: user?.email || 'user@example.com'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValidationError('');
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleCondition = (tag: string) => {
    setValidationError('');
    if (tag === 'None') {
      setFormData(prev => ({ ...prev, medicalConditions: 'None' }));
      return;
    }
    const current = formData.medicalConditions.split(',').map(s => s.trim()).filter(Boolean);
    let updated: string[];
    if (current.includes('None')) {
      updated = [tag];
    } else if (current.includes(tag)) {
      updated = current.filter(t => t !== tag);
    } else {
      updated = [...current, tag];
    }
    setFormData(prev => ({ ...prev, medicalConditions: updated.join(', ') }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setValidationError('Please enter both your first and last name.');
        return;
      }
      const ageNum = parseInt(formData.age, 10);
      if (!formData.age || isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        setValidationError('Please enter a valid age between 13 and 120.');
        return;
      }
      if (!formData.gender) {
        setValidationError('Please select your gender.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.occupation.trim()) {
        setValidationError('Please provide your occupation.');
        return;
      }
      if (!formData.emergencyContact.trim()) {
        setValidationError('Please enter an emergency contact.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      onSubmit({
        ...formData,
        age: parseInt(formData.age, 10)
      });
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const stepTitles = [
    { num: 1, title: 'Personal', icon: User, subtitle: 'Identity & Demographics' },
    { num: 2, title: 'Lifestyle', icon: Briefcase, subtitle: 'Occupation & Emergency Safety' },
    { num: 3, title: 'Wellbeing', icon: HeartPulse, subtitle: 'Health Triggers & Medication' }
  ];

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

      {/* Main Glassmorphic Multi-Step Card */}
      <div className="relative z-10 w-full max-w-[460px] max-h-[96vh]">
        <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-15px_rgba(13,148,136,0.3)] border border-white/60 dark:border-white/10 px-5 sm:px-6 py-4 sm:py-5 transition-all duration-200">
          
          {/* Header & Logo */}
          <div className="text-center mb-2">
            <div className="inline-block p-1 mb-1 transition-transform hover:scale-105 duration-200">
              <img
                src="/logo.png"
                alt="Stress Management"
                className="h-11 sm:h-12 w-auto object-contain mx-auto drop-shadow-xs"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Complete Your Profile
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                Step {step} of 3
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {stepTitles[step - 1].subtitle}
            </p>
          </div>

          {/* Interactive Modern Segmented Stepper Bar */}
          <div className="mb-3 sm:mb-3.5">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {stepTitles.map((s) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;
                const IconComponent = s.icon;

                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={s.num > step}
                    onClick={() => s.num < step && setStep(s.num as 1 | 2 | 3)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer'
                        : 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <IconComponent className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Form */}
          <form onSubmit={handleNext} className="space-y-2.5">
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-2 sm:space-y-2.5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                        placeholder="Hari"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Last Name
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                        placeholder="Prasad"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="13"
                        max="120"
                        className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                        placeholder="25"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Gender
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all cursor-pointer"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Lifestyle & Occupation */}
            {step === 2 && (
              <div className="space-y-2 sm:space-y-2.5 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Occupation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                      placeholder="e.g. Software Engineer, Student, Designer"
                      required
                      autoFocus
                    />
                  </div>

                  {/* Quick Occupation Suggestion Chips */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {['Student', 'Tech / IT', 'Healthcare', 'Corporate', 'Creative', 'Finance'].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, occupation: role }))}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                          formData.occupation.toLowerCase() === role.toLowerCase()
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Emergency Contact
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                      placeholder="e.g. Relative / Friend - (+1 555-0199)"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Used strictly for emergency safety assistance in case of severe distress.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Wellbeing & Health Context */}
            {step === 3 && (
              <div className="space-y-2 sm:space-y-2.5 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Stress Triggers & Health <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <span className="text-[10px] text-teal-600 font-medium">1-Click select</span>
                  </div>

                  {/* 1-Click Condition Tags */}
                  <div className="flex flex-wrap gap-1 pb-0.5">
                    {['Work Burnout', 'Anxiety', 'Insomnia', 'Migraines', 'Hypertension', 'None / Healthy'].map(tag => {
                      const isSelected = formData.medicalConditions.includes(tag) || (tag === 'None / Healthy' && formData.medicalConditions === 'None');
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleCondition(tag === 'None / Healthy' ? 'None' : tag)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                            isSelected
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 border border-slate-200/60 dark:border-slate-700'
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                      placeholder="Selected conditions or type custom details..."
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Current Medications <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                      type="text"
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
                      placeholder="e.g. Daily vitamins, None, or specific medications..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs animate-fadeIn">
                {validationError}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:from-teal-700 hover:via-emerald-700 hover:to-teal-700 text-white py-2 sm:py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-teal-700/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400/40 flex items-center justify-center gap-1.5"
              >
                {step < 3 ? (
                  <>
                    <span>Continue to Step {step + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Complete & Launch Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy & Security Footer */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span>HIPAA Compliant • Encrypted</span>
            </div>
            <span className="text-[10px] text-slate-400">Step {step} of 3</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;