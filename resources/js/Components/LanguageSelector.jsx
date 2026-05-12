import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector({ light = false }) {
    const { language, toggle } = useLanguage();

    const base = 'text-[10px] font-bold tracking-[0.18em] uppercase transition-colors';
    const active = light
        ? 'text-[oklch(0.97_0.006_85)]'
        : 'text-[oklch(0.18_0.03_255)]';
    const muted = light
        ? 'text-[oklch(0.50_0.025_255)] hover:text-[oklch(0.75_0.015_255)]'
        : 'text-[oklch(0.65_0.02_255)] hover:text-[oklch(0.35_0.025_255)]';

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-1.5"
            aria-label="Switch language"
            style={{ fontFamily: 'var(--font-display)' }}
        >
            <span className={`${base} ${language === 'da' ? active : muted}`}>DA</span>
            <span className={light ? 'text-[oklch(0.38_0.02_255)]' : 'text-[oklch(0.78_0.012_85)]'}>·</span>
            <span className={`${base} ${language === 'en' ? active : muted}`}>EN</span>
        </button>
    );
}
