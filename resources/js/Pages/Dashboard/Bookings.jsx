import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Bookings() {
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <h1
                    className="text-[oklch(0.18_0.03_255)] mb-8 uppercase"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    {t('bookings.title')}
                </h1>

                <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] py-20 px-10 flex flex-col items-center text-center">
                    <Calendar className="w-10 h-10 text-[oklch(0.78_0.015_85)] mb-5" strokeWidth={1} />
                    <p
                        className="text-[oklch(0.18_0.03_255)] mb-2 uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em' }}
                    >
                        {t('bookings.empty_title')}
                    </p>
                    <p className="text-sm text-[oklch(0.55_0.02_255)] mb-8 max-w-xs leading-relaxed">
                        {t('bookings.empty_body')}
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-semibold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {t('bookings.find_spot')}
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
