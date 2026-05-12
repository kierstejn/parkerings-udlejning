import { Link, router, usePage } from '@inertiajs/react';

export default function HeaderAuth() {
    const { auth } = usePage().props;

    function handleLogout() {
        router.post('/logout');
    }

    if (auth.user) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/profil"
                    className="text-sm font-medium text-[oklch(0.50_0.025_255)] hover:text-[oklch(0.18_0.03_255)] transition-colors"
                >
                    Min side
                </Link>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs border border-[oklch(0.22_0.04_255)] text-[oklch(0.22_0.04_255)] font-semibold tracking-widest uppercase hover:bg-[oklch(0.22_0.04_255)] hover:text-[oklch(0.965_0.008_85)] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Log ud
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/login"
                className="text-sm font-medium text-[oklch(0.50_0.025_255)] hover:text-[oklch(0.18_0.03_255)] transition-colors"
            >
                Log ind
            </Link>
            <Link
                href="/register"
                className="px-4 py-2 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-semibold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Opret konto
            </Link>
        </div>
    );
}
