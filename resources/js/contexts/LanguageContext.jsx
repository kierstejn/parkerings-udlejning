import { createContext, useContext, useState } from 'react';
import da from '../i18n/da';
import en from '../i18n/en';

const translations = { da, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('lang') || 'da';
    });

    function toggle() {
        const next = language === 'da' ? 'en' : 'da';
        localStorage.setItem('lang', next);
        setLanguage(next);
    }

    function t(key) {
        return translations[language][key] ?? translations['en'][key] ?? key;
    }

    return (
        <LanguageContext.Provider value={{ language, toggle, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
