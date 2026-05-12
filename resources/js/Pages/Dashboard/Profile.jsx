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
                    className="text-[oklch(0.18_0.03_255)] mb-8 uppercase"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    {t('profile.title')}
                </h1>

                <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)]">
                    <div className="px-6 py-5 border-b border-[oklch(0.88_0.015_85)]">
                        <p
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.65_0.025_255)]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {t('profile.account_details')}
                        </p>
                    </div>

                    <div className="divide-y divide-[oklch(0.92_0.01_85)]">
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
            <span
                className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.55_0.025_255)] shrink-0"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </span>
            <span className="text-sm text-[oklch(0.22_0.03_255)] text-right">
                {value ?? <span className="text-[oklch(0.70_0.015_255)]">—</span>}
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
