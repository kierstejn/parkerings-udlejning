import { Link, router, usePage } from '@inertiajs/react';
import DashboardSidebar from '../Components/DashboardSidebar';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className="min-h-screen bg-[oklch(0.965_0.008_85)] flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
            <header className="sticky top-0 z-50 bg-[oklch(0.965_0.008_85_/_95%)] backdrop-blur-sm border-b border-[oklch(0.88_0.015_85)]">
                <div className="h-16 px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
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

                    <div className="flex items-center gap-5">
                        {auth.user && (
                            <span className="text-sm text-[oklch(0.50_0.025_255)] hidden sm:block">
                                {auth.user.name}
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-xs border border-[oklch(0.22_0.04_255)] text-[oklch(0.22_0.04_255)] font-semibold tracking-widest uppercase hover:bg-[oklch(0.22_0.04_255)] hover:text-[oklch(0.965_0.008_85)] transition-colors"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Log ud
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <DashboardSidebar />
                <main className="flex-1 px-10 py-10 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
