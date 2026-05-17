import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

export default function AppHeader({ navLinks, onMenuOpen }) {
    const { auth } = usePage().props;
    const { t } = useLanguage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const user = auth?.user ?? null;

    function handleLogout() {
        router.post('/logout');
    }

    function handleHamburger() {
        if (onMenuOpen) {
            onMenuOpen();
        } else {
            setMobileOpen((v) => !v);
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-page/95 backdrop-blur-sm border-b border-line">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Left: logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 bg-primary flex items-center justify-center text-amber"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}
                        >
                            P
                        </div>
                        <span
                            className="text-ink"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                        >
                            ParkDel
                        </span>
                    </Link>

                    {/* Center: page-specific nav links (desktop) */}
                    {navLinks && (
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map(({ labelKey, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="text-sm text-body hover:text-ink transition-colors font-medium"
                                >
                                    {t(labelKey)}
                                </a>
                            ))}
                        </nav>
                    )}

                    {/* Right: language selector + auth (desktop) */}
                    <div className="hidden md:flex items-center gap-5">
                        <LanguageSelector />
                        {user ? (
                            <>
                                <Link
                                    href="/bookings"
                                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                                >
                                    {t('header.my_account')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-xs border border-primary text-primary font-semibold tracking-widest uppercase hover:bg-primary hover:text-page transition-colors font-display"
                                >
                                    {t('header.log_out')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-body hover:text-ink transition-colors"
                                >
                                    {t('header.log_in')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display"
                                >
                                    {t('header.sign_up')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right: minimal auth + hamburger on mobile */}
                    <div className="flex md:hidden items-center gap-3">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-xs border border-primary text-primary font-semibold tracking-widest uppercase hover:bg-primary hover:text-page transition-colors font-display"
                            >
                                {t('header.log_out')}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3 py-1.5 text-xs border border-primary text-primary font-semibold tracking-widest uppercase hover:bg-primary hover:text-page transition-colors font-display"
                            >
                                {t('header.log_in')}
                            </Link>
                        )}
                        <button
                            onClick={handleHamburger}
                            aria-label={mobileOpen ? t('nav.close_menu') : t('nav.open_menu')}
                            className="p-1.5 text-body hover:text-ink transition-colors"
                        >
                            {mobileOpen && !onMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu (non-dashboard pages only) */}
            {!onMenuOpen && mobileOpen && (
                <div className="md:hidden sticky top-16 z-40 bg-page border-b border-line px-6 py-4 flex flex-col gap-1">
                    {navLinks?.map(({ labelKey, href }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="py-2.5 text-sm text-body hover:text-ink transition-colors font-medium border-b border-line-dim last:border-0"
                        >
                            {t(labelKey)}
                        </a>
                    ))}
                    {user ? (
                        <>
                            <Link
                                href="/bookings"
                                onClick={() => setMobileOpen(false)}
                                className="py-2.5 text-sm text-body hover:text-ink transition-colors font-medium border-b border-line-dim"
                            >
                                {t('header.my_account')}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="py-2.5 text-sm text-body hover:text-ink transition-colors font-medium border-b border-line-dim"
                            >
                                {t('header.log_in')}
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileOpen(false)}
                                className="py-2.5 text-sm text-body hover:text-ink transition-colors font-medium border-b border-line-dim"
                            >
                                {t('header.sign_up')}
                            </Link>
                        </>
                    )}
                    <div className="pt-3">
                        <LanguageSelector />
                    </div>
                </div>
            )}
        </>
    );
}
