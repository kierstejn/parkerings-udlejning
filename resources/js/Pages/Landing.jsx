import { Link } from '@inertiajs/react';
import { MapPin, Clock, Shield, ChevronRight, Car, Key } from 'lucide-react';
import HeaderAuth from '../Components/HeaderAuth';
import SearchForm from '../Components/SearchForm';
import { useLanguage } from '../contexts/LanguageContext';

export default function Landing() {
    const { t } = useLanguage();

    const listings = [
        { id: 1, titleKey: 'listings.sample1_title', address: 'Østerbrogade 124, 2100 Kbh Ø',              price: 18,  unitKey: 'listings.unit_hour',  sizeKey: 'listings.size_standard', available: true  },
        { id: 2, titleKey: 'listings.sample2_title', address: 'Nørrebrogade 47, 2200 Kbh N',               price: 850, unitKey: 'listings.unit_month', sizeKey: 'listings.size_large',    available: true  },
        { id: 3, titleKey: 'listings.sample3_title', address: 'Amagerbrogade 18, 2300 Kbh S',              price: 25,  unitKey: 'listings.unit_hour',  sizeKey: 'listings.size_standard', available: false },
        { id: 4, titleKey: 'listings.sample4_title', address: 'Frederiksberg Allé 88, 2000 Frederiksberg', price: 650, unitKey: 'listings.unit_month', sizeKey: 'listings.size_compact',  available: true  },
    ];

    const steps = [
        { num: '01', titleKey: 'how.step1_title', icon: MapPin, descKey: 'how.step1_desc' },
        { num: '02', titleKey: 'how.step2_title', icon: Key,    descKey: 'how.step2_desc' },
        { num: '03', titleKey: 'how.step3_title', icon: Car,    descKey: 'how.step3_desc' },
    ];

    return (
        <div className="min-h-screen bg-[oklch(0.965_0.008_85)]" style={{ fontFamily: 'var(--font-body)' }}>

            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-[oklch(0.965_0.008_85_/_95%)] backdrop-blur-sm border-b border-[oklch(0.88_0.015_85)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 bg-[oklch(0.22_0.04_255)] flex items-center justify-center text-[oklch(0.72_0.14_75)]"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}
                        >
                            P
                        </div>
                        <span
                            className="text-[oklch(0.18_0.03_255)]"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                        >
                            ParkDel
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { labelKey: 'nav.how_it_works', href: '#how' },
                            { labelKey: 'nav.available_spots', href: '#listings' },
                            { labelKey: 'nav.list_spot',  href: '#landlord' },
                        ].map(({ labelKey, href }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-sm text-[oklch(0.50_0.025_255)] hover:text-[oklch(0.18_0.03_255)] transition-colors font-medium"
                            >
                                {t(labelKey)}
                            </a>
                        ))}
                    </nav>

                    <HeaderAuth />
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────── */}
            <section className="relative bg-[oklch(0.22_0.04_255)] overflow-hidden">
                <div
                    aria-hidden
                    className="absolute right-[-2%] top-1/2 -translate-y-1/2 text-[oklch(0.27_0.045_255)] select-none pointer-events-none leading-none"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(240px, 40vw, 560px)', fontWeight: 800, letterSpacing: '-0.06em' }}
                >
                    P
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36 lg:py-44">
                    <div className="max-w-xl">
                        <p
                            className="text-[oklch(0.72_0.14_75)] mb-5"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                        >
                            {t('landing.tagline')}
                        </p>

                        <h1
                            className="text-[oklch(0.97_0.006_85)] mb-8 uppercase"
                            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 6.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.9 }}
                        >
                            {t('landing.headline_1')}<br />{t('landing.headline_2')}<br />{t('landing.headline_3')}
                        </h1>

                        <p className="text-[oklch(0.70_0.025_255)] text-lg mb-10 leading-relaxed max-w-md">
                            {t('landing.hero_body')}
                        </p>

                        <SearchForm />
                    </div>
                </div>
            </section>

            {/* ── Stats strip ─────────────────────────────────── */}
            <section className="bg-[oklch(0.72_0.14_75)] py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
                    {[
                        { num: '2.400+', labelKey: 'stats.active_spots' },
                        { num: '18',     labelKey: 'stats.cities' },
                        { num: '4.8 ★',  labelKey: 'stats.rating' },
                    ].map(({ num, labelKey }) => (
                        <div key={labelKey}>
                            <div
                                className="text-[oklch(0.18_0.03_255)] leading-none mb-1"
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
                            >
                                {num}
                            </div>
                            <div className="text-[oklch(0.30_0.045_255)] text-sm font-medium">{t(labelKey)}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ────────────────────────────────── */}
            <section id="how" className="py-24 bg-[oklch(0.965_0.008_85)]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2
                        className="text-[oklch(0.18_0.03_255)] mb-16 uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        {t('how.title')}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10 md:gap-8 relative">
                        {steps.map((step, i) => (
                            <div key={step.num} className="relative">
                                <div
                                    className="text-[oklch(0.88_0.012_85)] leading-none mb-4 select-none"
                                    style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}
                                >
                                    {step.num}
                                </div>
                                <div className="mb-4">
                                    <step.icon className="w-6 h-6 text-[oklch(0.72_0.14_75)]" strokeWidth={1.5} />
                                </div>
                                <h3
                                    className="text-[oklch(0.18_0.03_255)] mb-3 uppercase"
                                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.04em' }}
                                >
                                    {t(step.titleKey)}
                                </h3>
                                <p className="text-[oklch(0.45_0.025_255)] leading-relaxed text-sm">{t(step.descKey)}</p>
                                {i < steps.length - 1 && (
                                    <ChevronRight
                                        className="hidden md:block absolute -right-4 top-20 text-[oklch(0.80_0.012_85)] w-5 h-5"
                                        strokeWidth={1.5}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured listings ──────────────────────────── */}
            <section id="listings" className="py-24 bg-[oklch(0.945_0.01_85)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <h2
                            className="text-[oklch(0.18_0.03_255)] uppercase"
                            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
                        >
                            {t('listings.title')}
                        </h2>
                        <a href="#" className="text-sm text-[oklch(0.22_0.04_255)] font-medium underline underline-offset-4 hover:text-[oklch(0.50_0.025_255)] transition-colors hidden sm:block">
                            {t('listings.see_all')}
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {listings.map((listing) => (
                            <article key={listing.id} className="bg-[oklch(0.992_0.004_85)] hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="h-36 bg-[oklch(0.30_0.035_255)] flex items-center justify-center relative overflow-hidden">
                                    <Car className="w-10 h-10 text-[oklch(0.45_0.03_255)] group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
                                    {!listing.available && (
                                        <div className="absolute inset-0 bg-[oklch(0.16_0.02_255_/_80%)] flex items-center justify-center">
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }} className="text-[oklch(0.78_0.06_30)]">
                                                {t('listings.taken')}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className="absolute top-2.5 right-2.5 bg-[oklch(0.72_0.14_75)] px-2 py-0.5 text-[oklch(0.18_0.03_255)]"
                                        style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                                    >
                                        {t(listing.sizeKey)}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-[oklch(0.18_0.03_255)] font-semibold mb-1 text-sm truncate">{t(listing.titleKey)}</h3>
                                    <div className="flex items-center gap-1 text-[oklch(0.55_0.02_255)] text-xs mb-3">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="truncate">{listing.address}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }} className="text-[oklch(0.18_0.03_255)]">
                                                {listing.price} kr
                                            </span>
                                            <span className="text-[oklch(0.55_0.02_255)] text-xs ml-1">/{t(listing.unitKey)}</span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${listing.available ? 'bg-[oklch(0.65_0.17_145)]' : 'bg-[oklch(0.60_0.14_30)]'}`} />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Landlord CTA ────────────────────────────────── */}
            <section id="landlord" className="py-24 bg-[oklch(0.22_0.04_255)] relative overflow-hidden">
                <div
                    aria-hidden
                    className="absolute -left-16 top-1/2 -translate-y-1/2 text-[oklch(0.27_0.045_255)] select-none pointer-events-none leading-none"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(180px, 28vw, 380px)', fontWeight: 800, letterSpacing: '-0.04em' }}
                >
                    kr
                </div>

                <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                    <div>
                        <p
                            className="text-[oklch(0.72_0.14_75)] mb-4"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                        >
                            {t('cta.for_landlords')}
                        </p>
                        <h2
                            className="text-[oklch(0.97_0.006_85)] mb-5 uppercase"
                            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 0.92 }}
                        >
                            {t('cta.headline_1')}<br />{t('cta.headline_2')}
                        </h2>
                        <p className="text-[oklch(0.68_0.025_255)] leading-relaxed max-w-md">
                            {t('cta.body')}
                        </p>
                        <div className="flex items-center gap-6 mt-6">
                            {[
                                { icon: Shield, labelKey: 'cta.mitid' },
                                { icon: Clock,  labelKey: 'cta.own_hours' },
                            ].map(({ icon: Icon, labelKey }) => (
                                <div key={labelKey} className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-[oklch(0.72_0.14_75)]" strokeWidth={1.5} />
                                    <span className="text-[oklch(0.65_0.022_255)] text-sm">{t(labelKey)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Link
                            href="/login"
                            className="inline-block px-8 py-4 bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)] font-bold hover:bg-[oklch(0.78_0.13_75)] transition-colors"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                            {t('cta.btn')}
                        </Link>
                        <p className="text-[oklch(0.45_0.02_255)] text-xs mt-3">{t('cta.requires')}</p>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="py-10 bg-[oklch(0.14_0.025_255)]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 bg-[oklch(0.72_0.14_75)] flex items-center justify-center text-[oklch(0.14_0.025_255)]"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem' }}
                        >
                            P
                        </div>
                        <span
                            className="text-[oklch(0.55_0.02_255)]"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        >
                            ParkDel
                        </span>
                    </div>

                    <p className="text-[oklch(0.40_0.018_255)] text-xs order-last sm:order-none">
                        {t('footer.rights')}
                    </p>

                    <nav className="flex gap-6">
                        {[
                            { key: 'footer.privacy' },
                            { key: 'footer.terms' },
                            { key: 'footer.contact' },
                        ].map(({ key }) => (
                            <a key={key} href="#" className="text-[oklch(0.40_0.018_255)] hover:text-[oklch(0.65_0.022_255)] text-xs transition-colors">
                                {t(key)}
                            </a>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
}
