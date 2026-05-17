import { Link, usePage } from '@inertiajs/react';
import { User, Calendar, ShieldCheck, Car, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function DashboardSidebar({ open, onClose }) {
    const { auth, url } = usePage().props;
    const { t } = useLanguage();
    const verified = auth.user?.landlord_verified === true;
    const pathname = url;

    return (
        <>
            {/* Mobile drawer */}
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-40 w-64 bg-page border-r border-line flex flex-col gap-8 overflow-y-auto transition-transform duration-200 md:hidden',
                    open ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="h-16 px-5 flex items-center justify-between border-b border-line shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label font-display">
                        Menu
                    </span>
                    <button onClick={onClose} aria-label={t('nav.close_menu')} className="p-1 text-body hover:text-ink transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-5 pb-10 flex flex-col gap-8">
                    <SidebarContent verified={verified} pathname={pathname} t={t} onLinkClick={onClose} />
                    <div className="px-3">
                        <LanguageSelector />
                    </div>
                </div>
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-56 shrink-0 border-r border-line py-10 px-5 flex-col gap-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                <SidebarContent verified={verified} pathname={pathname} t={t} />
            </aside>
        </>
    );
}

function SidebarContent({ verified, pathname, t, onLinkClick }) {
    return (
        <>
            <SideSection label={t('sidebar.tenant')}>
                <SideLink href="/profile" active={pathname === '/profile'} icon={<User className="w-3.5 h-3.5" strokeWidth={1.5} />} onClick={onLinkClick}>
                    {t('sidebar.profile')}
                </SideLink>
                <SideLink href="/bookings" active={pathname === '/bookings'} icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />} onClick={onLinkClick}>
                    {t('sidebar.bookings')}
                </SideLink>
            </SideSection>

            <SideSection label={t('sidebar.landlord')}>
                {verified ? (
                    <>
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-success font-semibold font-display tracking-wide">
                            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                            {t('sidebar.mitid_verified')}
                        </div>
                        <SideLink
                            href="/landlord/parking-spots"
                            active={pathname === '/landlord/parking-spots'}
                            icon={<Car className="w-3.5 h-3.5" strokeWidth={1.5} />}
                            onClick={onLinkClick}
                        >
                            {t('sidebar.parking_spots')}
                        </SideLink>
                    </>
                ) : (
                    <SideLink
                        href="/landlord"
                        active={pathname === '/landlord'}
                        icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        onClick={onLinkClick}
                    >
                        {t('sidebar.verify_mitid')}
                    </SideLink>
                )}
            </SideSection>
        </>
    );
}

function SideSection({ label, children }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label mb-2 px-3 font-display">
                {label}
            </p>
            <nav className="flex flex-col gap-0.5">{children}</nav>
        </div>
    );
}

function SideLink({ href, active, icon, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                active
                    ? 'bg-primary text-page'
                    : 'text-body hover:text-ink hover:bg-chip'
            }`}
        >
            {icon}
            {children}
        </Link>
    );
}
