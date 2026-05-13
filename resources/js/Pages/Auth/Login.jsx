import { Link, useForm } from '@inertiajs/react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../Components/LanguageSelector';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });
    const { t } = useLanguage();

    function handleSubmit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen bg-[oklch(0.965_0.008_85)] flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
            <header className="px-6 py-5 border-b border-[oklch(0.88_0.015_85)] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 w-fit">
                    <div
                        className="w-8 h-8 bg-[oklch(0.22_0.04_255)] flex items-center justify-center text-[oklch(0.72_0.14_75)]"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}
                    >
                        P
                    </div>
                    <span
                        className="text-[oklch(0.18_0.03_255)]"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    >
                        ParkDel
                    </span>
                </Link>
                <LanguageSelector />
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">
                    <h1
                        className="text-[oklch(0.18_0.03_255)] mb-8 uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        {t('login.title')}
                    </h1>

                    <a
                        href="/auth/google"
                        className="flex items-center justify-center gap-3 w-full py-3 border border-[oklch(0.85_0.015_85)] bg-white text-[oklch(0.25_0.03_255)] text-sm font-semibold hover:bg-[oklch(0.97_0.005_85)] transition-colors mb-6"
                    >
                        <GoogleIcon />
                        {t('login.google')}
                    </a>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-[oklch(0.88_0.015_85)]" />
                        <span className="text-xs text-[oklch(0.65_0.015_255)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>{t('login.or')}</span>
                        <div className="flex-1 h-px bg-[oklch(0.88_0.015_85)]" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <Field label="Email" htmlFor="email">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder={t('login.email_placeholder')}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputCls}
                            />
                            {errors.email && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.email}</p>}
                        </Field>

                        <Field label={t('login.password')} htmlFor="password">
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={inputCls}
                            />
                            {errors.password && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.password}</p>}
                        </Field>

                        <button type="submit" disabled={processing} className={submitCls}>
                            {processing ? t('login.submitting') : t('login.submit')}
                        </button>
                    </form>

                    <p className="text-[oklch(0.55_0.02_255)] text-sm mt-6 text-center">
                        {t('login.no_account')}{' '}
                        <Link href="/register" className="text-[oklch(0.22_0.04_255)] font-medium underline underline-offset-4 hover:text-[oklch(0.45_0.04_255)] transition-colors">
                            {t('login.sign_up')}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

function Field({ label, htmlFor, children }) {
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={htmlFor}
                className="block text-xs font-semibold text-[oklch(0.45_0.025_255)] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls =
    'w-full px-4 py-3 rounded-none bg-[oklch(0.985_0.005_85)] border border-[oklch(0.85_0.015_85)] text-[oklch(0.18_0.03_255)] text-sm placeholder:text-[oklch(0.68_0.012_255)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.22_0.04_255)] focus:border-transparent transition-shadow';

const submitCls =
    'w-full py-3.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] font-bold hover:bg-[oklch(0.30_0.04_255)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
    );
}
