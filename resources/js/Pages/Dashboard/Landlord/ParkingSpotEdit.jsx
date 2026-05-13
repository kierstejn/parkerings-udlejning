import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { EditForm } from './ParkingSpots';

export default function ParkingSpotEdit() {
    const { spot } = usePage().props;
    const { t } = useLanguage();

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="mb-8">
                    <Link
                        href={`/landlord/parking-spots/${spot.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.55_0.02_255)] hover:text-[oklch(0.22_0.04_255)] uppercase tracking-widest transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {spot.title}
                    </Link>
                </div>

                <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)]">
                    <div className="px-6 py-4 border-b border-[oklch(0.88_0.015_85)]">
                        <p
                            className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.18_0.03_255)]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {t('spots.edit_form_title')}
                        </p>
                    </div>
                    <div className="p-6">
                        <EditForm spot={spot} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
