import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'fr' | 'es' | 'hi';

type Dictionary = { [key: string]: string };

const dictionaries: Record<Lang, Dictionary> = {
  en: {
    app_name: 'MindCare',
    welcome: 'Welcome, {name}!',
    good_morning: 'Good morning, {name}! 🌅',
    checkin_cta: "Start Today's Check-in",
    how_feeling: "How are you feeling today? Let's check in with your mental wellness.",
    current_stress: 'Current Stress',
    weekly_average: 'Weekly Average',
    checklist: 'Checklist',
    sessions: 'Sessions',
    stress_tip_title: "💡 Today's Stress Relief Tip",
    stress_tip_text: 'Take three deep breaths before starting any challenging task. This simple practice can reduce stress hormones by up to 25% and improve your focus significantly.',
    appearance: 'Appearance',
    language: 'Language',
    account: 'Account',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    logout: 'Logout',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    toggle: 'Toggle',
    weekly_stress_trend: 'Weekly Stress Trend'
  },
  fr: {
    app_name: 'MindCare',
    welcome: 'Bienvenue, {name}!',
    good_morning: 'Bonjour, {name}! 🌅',
    checkin_cta: 'Commencer le bilan du jour',
    how_feeling: 'Comment vous sentez-vous aujourd\'hui ? Vérifions votre bien-être mental.',
    current_stress: 'Stress actuel',
    weekly_average: 'Moyenne hebdomadaire',
    checklist: 'Liste',
    sessions: 'Sessions',
    stress_tip_title: '💡 Astuce anti-stress du jour',
    stress_tip_text: 'Prenez trois respirations profondes avant une tâche difficile. Cette simple pratique peut réduire les hormones du stress de 25% et améliorer votre concentration.',
    appearance: 'Apparence',
    language: 'Langue',
    account: 'Compte',
    profile: 'Profil',
    settings: 'Paramètres',
    notifications: 'Notifications',
    logout: 'Se déconnecter',
    dark_mode: 'Mode sombre',
    light_mode: 'Mode clair',
    toggle: 'Basculer',
    weekly_stress_trend: 'Tendance du stress hebdomadaire'
  },
  es: {
    app_name: 'MindCare',
    welcome: 'Bienvenido, {name}!',
    good_morning: '¡Buenos días, {name}! 🌅',
    checkin_cta: 'Comenzar chequeo de hoy',
    how_feeling: '¿Cómo te sientes hoy? Revisemos tu bienestar mental.',
    current_stress: 'Estrés actual',
    weekly_average: 'Promedio semanal',
    checklist: 'Lista',
    sessions: 'Sesiones',
    stress_tip_title: '💡 Consejo de alivio del estrés de hoy',
    stress_tip_text: 'Toma tres respiraciones profundas antes de cualquier tarea desafiante. Esta práctica simple puede reducir las hormonas del estrés hasta un 25% y mejorar tu enfoque significativamente.',
    appearance: 'Apariencia',
    language: 'Idioma',
    account: 'Cuenta',
    profile: 'Perfil',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
    dark_mode: 'Modo oscuro',
    light_mode: 'Modo claro',
    toggle: 'Alternar',
    weekly_stress_trend: 'Tendencia de estrés semanal'
  },
  hi: {
    app_name: 'MindCare',
    welcome: 'स्वागत है, {name}!',
    good_morning: 'सुप्रभात, {name}! 🌅',
    checkin_cta: 'आज का चेक-इन शुरू करें',
    how_feeling: 'आज आप कैसा महसूस कर रहे हैं? चलिए आपके मानसिक स्वास्थ्य की जाँच करते हैं।',
    current_stress: 'वर्तमान तनाव',
    weekly_average: 'साप्ताहिक औसत',
    checklist: 'चेकलिस्ट',
    sessions: 'सत्र',
    stress_tip_title: '💡 आज की तनाव राहत टिप',
    stress_tip_text: 'किसी भी चुनौतीपूर्ण कार्य से पहले तीन गहरी साँस लें। यह सरल अभ्यास तनाव हार्मोन को 25% तक कम कर सकता है और आपके फोकस को बेहतर बनाता है।',
    appearance: 'रूप',
    language: 'भाषा',
    account: 'खाता',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएँ',
    logout: 'लॉग आउट',
    dark_mode: 'डार्क मोड',
    light_mode: 'लाइट मोड',
    toggle: 'टॉगल',
    weekly_stress_trend: 'साप्ताहिक तनाव रुझान'
  }
};

type I18nContextType = {
  lang: Lang;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>((localStorage.getItem('lang') as Lang) || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[lang] || dictionaries.en;
      let str = dict[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return str;
    };
  }, [lang]);

  const value: I18nContextType = { lang, t, setLang };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};


