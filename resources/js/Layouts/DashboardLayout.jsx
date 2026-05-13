import { Link, router, usePage } from '@inertiajs/react';
import DashboardSidebar from '../Components/DashboardSidebar';
import LanguageSelector from '../Components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const { t } = useLanguage();

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className="min-h-screen bg-page flex flex-col">
            <header className="sticky top-0 z-50 bg-page/95 backdrop-blur-sm border-b border-line">
                <div className="h-16 px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center text-amber font-display font-extrabold text-base">
                            P
                        </div>
                        <span className="text-ink font-display font-bold uppercase tracking-widest" style={{ fontSize: '1.05rem' }}>
                            ParkDel
                        </span>
                    </Link>

                    <div className="flex items-center gap-5">
                        <LanguageSelector />
                        {auth.user && (
                            <span className="text-sm text-body hidden sm:block">
                                {auth.user.name}
                            </span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-xs border border-primary text-primary font-semibold tracking-widest uppercase hover:bg-primary hover:text-page transition-colors font-display"
                        >
                            {t('dashboard.log_out')}
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
