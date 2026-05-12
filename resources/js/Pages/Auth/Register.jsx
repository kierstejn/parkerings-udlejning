import { Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="min-h-screen bg-[oklch(0.965_0.008_85)] flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
            <header className="px-6 py-5 border-b border-[oklch(0.88_0.015_85)]">
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
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-sm">
                    <h1
                        className="text-[oklch(0.18_0.03_255)] mb-2 uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        Opret konto
                    </h1>
                    <p className="text-[oklch(0.55_0.02_255)] text-sm mb-8">
                        Gratis at oprette — ingen binding.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <Field label="Navn" htmlFor="name">
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="Dit fulde navn"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputCls}
                            />
                            {errors.name && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.name}</p>}
                        </Field>

                        <Field label="Email" htmlFor="email">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="din@email.dk"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputCls}
                            />
                            {errors.email && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.email}</p>}
                        </Field>

                        <Field label="Adgangskode" htmlFor="password">
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={inputCls}
                            />
                            {errors.password && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.password}</p>}
                        </Field>

                        <Field label="Gentag adgangskode" htmlFor="password_confirmation">
                            <input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={inputCls}
                            />
                        </Field>

                        <button type="submit" disabled={processing} className={submitCls}>
                            {processing ? 'Opretter konto…' : 'Opret konto'}
                        </button>
                    </form>

                    <p className="text-[oklch(0.55_0.02_255)] text-sm mt-6 text-center">
                        Har du allerede en konto?{' '}
                        <Link href="/login" className="text-[oklch(0.22_0.04_255)] font-medium underline underline-offset-4 hover:text-[oklch(0.45_0.04_255)] transition-colors">
                            Log ind
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
