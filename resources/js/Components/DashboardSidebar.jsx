import { Link, usePage } from '@inertiajs/react';
import { User, Calendar, ShieldCheck, Car } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function DashboardSidebar() {
    const { auth, url } = usePage().props;
    const { t } = useLanguage();
    const verified = auth.user?.landlord_verified === true;
    const pathname = url;

    return (
        <aside className="w-56 shrink-0 border-r border-[oklch(0.88_0.015_85)] py-10 px-5 flex flex-col gap-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <SideSection label={t('sidebar.tenant')}>
                <SideLink
                    href="/profile"
                    active={pathname === '/profile'}
                    icon={<User className="w-3.5 h-3.5" strokeWidth={1.5} />}
                >
                    {t('sidebar.profile')}
                </SideLink>
                <SideLink
                    href="/bookings"
                    active={pathname === '/bookings'}
                    icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />}
                >
                    {t('sidebar.bookings')}
                </SideLink>
            </SideSection>

            <SideSection label={t('sidebar.landlord')}>
                {verified ? (
                    <>
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[oklch(0.42_0.13_145)] font-semibold"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                            {t('sidebar.mitid_verified')}
                        </div>
                        <SideLink
                            href="/landlord/parking-spots"
                            active={pathname === '/landlord/parking-spots'}
                            icon={<Car className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        >
                            {t('sidebar.parking_spots')}
                        </SideLink>
                    </>
                ) : (
                    <SideLink
                        href="/landlord"
                        active={pathname === '/landlord'}
                        icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    >
                        {t('sidebar.verify_mitid')}
                    </SideLink>
                )}
            </SideSection>
        </aside>
    );
}

function SideSection({ label, children }) {
    return (
        <div>
            <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.65_0.025_255)] mb-2 px-3"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </p>
            <nav className="flex flex-col gap-0.5">{children}</nav>
        </div>
    );
}

function SideLink({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                active
                    ? 'bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)]'
                    : 'text-[oklch(0.42_0.025_255)] hover:text-[oklch(0.18_0.03_255)] hover:bg-[oklch(0.92_0.012_85)]'
            }`}
        >
            {icon}
            {children}
        </Link>
    );
}
