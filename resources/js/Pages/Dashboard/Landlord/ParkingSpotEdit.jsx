import { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { EditForm } from './ParkingSpots';
import { getCoords } from '../../../lib/geolocation';

export default function ParkingSpotEdit() {
    const { spot } = usePage().props;
    const { t } = useLanguage();

    useEffect(() => { getCoords(); }, []);

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="mb-8">
                    <Link
                        href={`/landlord/parking-spots/${spot.id}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink uppercase tracking-widest transition-colors font-display"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {spot.title}
                    </Link>
                </div>

                <div className="border border-line bg-card">
                    <div className="px-6 py-4 border-b border-line">
                        <p className="text-xs font-semibold uppercase tracking-widest text-ink font-display">
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
