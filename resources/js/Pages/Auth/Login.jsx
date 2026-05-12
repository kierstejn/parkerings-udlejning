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
