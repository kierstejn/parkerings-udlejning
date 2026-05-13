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
                    className="text-ink mb-8 uppercase font-display"
                    style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    {t('bookings.title')}
                </h1>

                <div className="border border-line bg-card py-20 px-10 flex flex-col items-center text-center">
                    <Calendar className="w-10 h-10 text-icon mb-5" strokeWidth={1} />
                    <p
                        className="text-ink mb-2 uppercase font-display"
                        style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em' }}
                    >
                        {t('bookings.empty_title')}
                    </p>
                    <p className="text-sm text-muted mb-8 max-w-xs leading-relaxed">
                        {t('bookings.empty_body')}
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display"
                    >
                        {t('bookings.find_spot')}
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
