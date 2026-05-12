import { Link, usePage } from '@inertiajs/react';
import { User, Calendar, ShieldCheck, Car } from 'lucide-react';

export default function DashboardSidebar() {
    const { auth, url } = usePage().props;
    const verified = auth.user?.udlejer_verified === true;
    const pathname = url;

    return (
        <aside className="w-56 shrink-0 border-r border-[oklch(0.88_0.015_85)] py-10 px-5 flex flex-col gap-8">
            <SideSection label="Lejer">
                <SideLink
                    href="/profil"
                    active={pathname === '/profil'}
                    icon={<User className="w-3.5 h-3.5" strokeWidth={1.5} />}
                >
                    Profil
                </SideLink>
                <SideLink
                    href="/bookinger"
                    active={pathname === '/bookinger'}
                    icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />}
                >
                    Bookinger
                </SideLink>
            </SideSection>

            <SideSection label="Udlejer">
                {verified ? (
                    <>
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[oklch(0.42_0.13_145)] font-semibold"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                            MitID verificeret
                        </div>
                        <SideLink
                            href="/udlejer/parkeringspladser"
                            active={pathname.startsWith('/udlejer/parkeringspladser')}
                            icon={<Car className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        >
                            Parkeringspladser
                        </SideLink>
                    </>
                ) : (
                    <SideLink
                        href="/udlejer"
                        active={pathname === '/udlejer'}
                        icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    >
                        Verificér med MitID
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
