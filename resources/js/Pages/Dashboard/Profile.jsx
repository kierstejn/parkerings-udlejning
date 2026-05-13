import { usePage } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Profile() {
    const { auth } = usePage().props;
    const { t } = useLanguage();
    const user = auth.user;

    return (
        <DashboardLayout>
            <div className="max-w-lg">
                <h1
                    className="text-ink mb-8 uppercase font-display"
                    style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    {t('profile.title')}
                </h1>

                <div className="border border-line bg-card">
                    <div className="px-6 py-5 border-b border-line">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label font-display">
                            {t('profile.account_details')}
                        </p>
                    </div>

                    <div className="divide-y divide-chip">
                        <Row label={t('profile.name')}    value={user?.name} />
                        <Row label={t('profile.email')}   value={user?.email} />
                        <Row label={t('profile.created')} value={user?.created_at ? formatDate(user.created_at) : undefined} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Row({ label, value }) {
    return (
        <div className="px-6 py-4 flex items-center justify-between gap-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted shrink-0 font-display">
                {label}
            </span>
            <span className="text-sm text-primary text-right">
                {value ?? <span className="text-icon">—</span>}
            </span>
        </div>
    );
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('da-DK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
