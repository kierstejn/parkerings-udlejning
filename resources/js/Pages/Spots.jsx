import { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Camera, Car, List, LocateFixed, Map, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AddressAutocomplete } from '../Components/ui/AddressAutocomplete';
import AppHeader from '../Components/AppHeader';

const TYPES = ['carport', 'garage', 'outdoor', 'indoor'];

export default function Spots() {
    const pageProps = usePage().props;
    const { t } = useLanguage();

    const initialFilters = pageProps.filters ?? {};

    // Sidebar filter inputs (local state — applied on submit)
    const [type, setType]       = useState(initialFilters.type    ?? '');
    const [address, setAddress] = useState(initialFilters.address ?? '');
    const [lat, setLat]         = useState(initialFilters.lat     ?? null);
    const [lng, setLng]         = useState(initialFilters.lng     ?? null);
    const [locating, setLocating] = useState(false);

    // Results
    const loadingMoreRef = useRef(false);
    const [allSpots, setAllSpots]     = useState(pageProps.spots.data);
    const [nextCursor, setNextCursor] = useState(pageProps.spots.next_cursor ?? null);

    // UI
    const [view, setView]             = useState('list');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sync when Inertia updates props (filter change or load more)
    useEffect(() => {
        if (loadingMoreRef.current) {
            setAllSpots((prev) => [...prev, ...pageProps.spots.data]);
        } else {
            setAllSpots(pageProps.spots.data);
            // Sync filter inputs to reflect applied filters
            setType(pageProps.filters?.type    ?? '');
            setAddress(pageProps.filters?.address ?? '');
            setLat(pageProps.filters?.lat     ?? null);
            setLng(pageProps.filters?.lng     ?? null);
        }
        setNextCursor(pageProps.spots.next_cursor ?? null);
        loadingMoreRef.current = false;
    }, [pageProps.spots]);

    function applyFilters() {
        setSidebarOpen(false);
        const params = {};
        if (type)    params.type    = type;
        if (address) params.address = address;
        if (lat)     params.lat     = lat;
        if (lng)     params.lng     = lng;
        router.get('/spots', params);
    }

    function loadMore() {
        loadingMoreRef.current = true;
        const params = { cursor: nextCursor };
        if (pageProps.filters?.type)    params.type    = pageProps.filters.type;
        if (pageProps.filters?.address) params.address = pageProps.filters.address;
        if (pageProps.filters?.lat)     params.lat     = pageProps.filters.lat;
        if (pageProps.filters?.lng)     params.lng     = pageProps.filters.lng;
        router.get('/spots', params, {
            preserveState:  true,
            preserveScroll: true,
            only:           ['spots'],
        });
    }

    async function useLocation() {
        if (!navigator.geolocation) return;
        setLocating(true);
        try {
            const position = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
            );
            const { latitude: lat, longitude: lng } = position.coords;
            setLat(lat);
            setLng(lng);
            const key = import.meta.env.VITE_GEOAPIFY_API_KEY;
            const res  = await fetch(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=da&apiKey=${key}`
            );
            const data    = await res.json();
            const feature = data.features?.[0];
            if (feature) {
                setAddress(feature.properties.city ?? feature.properties.formatted ?? '');
            }
        } catch {
            // user denied or timed out — silently ignore
        } finally {
            setLocating(false);
        }
    }

    const filterPanel = (
        <div className="flex flex-col gap-6">
            <FilterSection label={t('spots.form.type')}>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-card border border-line text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">{t('spots.browse.type_all')}</option>
                    {TYPES.map((tp) => (
                        <option key={tp} value={tp}>{t(`spots.type.${tp}`)}</option>
                    ))}
                </select>
            </FilterSection>

            <FilterSection label={t('spots.browse.address_label')}>
                <div className="flex gap-2 items-start">
                    <div className="flex-1 min-w-0">
                        <AddressAutocomplete
                            value={address}
                            onChange={(text) => { setAddress(text); setLat(null); setLng(null); }}
                            onSelect={(item) => {
                                setAddress(item.label);
                                setLat(item.place.lat ?? null);
                                setLng(item.place.lon ?? null);
                            }}
                            placeholder={t('search.placeholder')}
                            className="w-full px-3 py-2.5 bg-card border border-line text-sm text-ink placeholder:text-ghost focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={useLocation}
                        disabled={locating}
                        aria-label={t('spots.browse.use_location')}
                        className="shrink-0 w-9 h-[42px] flex items-center justify-center border border-line text-muted hover:text-ink hover:border-muted transition-colors disabled:opacity-40"
                    >
                        <LocateFixed className={`w-4 h-4 ${locating ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
                    </button>
                </div>
            </FilterSection>

            <button
                onClick={applyFilters}
                className="w-full py-3 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display"
            >
                {t('spots.browse.apply')}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-page" style={{ fontFamily: 'var(--font-body)' }}>

            <AppHeader />

            {/* ── Page body ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                {/* Mobile: filter toggle */}
                <div className="md:hidden mb-5">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-line text-xs font-semibold uppercase tracking-widest text-body hover:text-ink transition-colors font-display"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        {t('spots.browse.filters')}
                    </button>
                </div>

                {/* Mobile backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile sidebar drawer */}
                <aside className={[
                    'fixed inset-y-0 left-0 z-40 w-72 bg-page border-r border-line px-6 py-6 flex flex-col overflow-y-auto transition-transform duration-200 md:hidden',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}>
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-ink font-display">
                            {t('spots.browse.filters')}
                        </p>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 text-body hover:text-ink transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {filterPanel}
                </aside>

                <div className="flex gap-8 items-start">

                    {/* ── Desktop sidebar ─────────────────────────── */}
                    <aside className="hidden md:block w-64 shrink-0 sticky top-24">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label mb-5 font-display">
                            {t('spots.browse.filters')}
                        </p>
                        {filterPanel}
                    </aside>

                    {/* ── Main content ────────────────────────────── */}
                    <main className="flex-1 min-w-0">

                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-muted">
                                <span className="font-semibold text-ink">{allSpots.length}</span>
                                {' '}{t('spots.browse.results')}
                            </p>
                            <div className="flex items-center gap-1 border border-line">
                                <button
                                    onClick={() => setView('list')}
                                    aria-label={t('spots.browse.list_view')}
                                    className={`p-2 transition-colors ${view === 'list' ? 'bg-primary text-page' : 'text-muted hover:text-ink'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView('map')}
                                    aria-label={t('spots.browse.map_view')}
                                    className={`p-2 transition-colors ${view === 'map' ? 'bg-primary text-page' : 'text-muted hover:text-ink'}`}
                                >
                                    <Map className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {view === 'map' ? (
                            /* ── Map stub ─────────────────────────── */
                            <div className="flex items-center justify-center border border-dashed border-line bg-card h-[32rem]">
                                <div className="text-center">
                                    <Map className="w-10 h-10 text-icon mx-auto mb-3" strokeWidth={1} />
                                    <p className="text-sm text-muted">{t('spots.browse.map_stub')}</p>
                                </div>
                            </div>
                        ) : allSpots.length === 0 ? (
                            /* ── Empty state ──────────────────────── */
                            <div className="flex flex-col items-center py-20 text-center">
                                <Car className="w-10 h-10 text-icon mb-4" strokeWidth={1} />
                                <p className="text-sm text-muted">{t('spots.browse.no_results')}</p>
                            </div>
                        ) : (
                            /* ── Spot grid ────────────────────────── */
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allSpots.map((spot) => (
                                        <SpotCard key={spot.id} spot={spot} />
                                    ))}
                                </div>

                                {nextCursor && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={loadMore}
                                            className="px-8 py-3 border border-line text-xs font-semibold uppercase tracking-widest text-body hover:text-ink hover:border-muted transition-colors font-display"
                                        >
                                            {t('spots.browse.load_more')}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function FilterSection({ label, children }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label mb-2 font-display">
                {label}
            </p>
            {children}
        </div>
    );
}

function SpotCard({ spot }) {
    const { t } = useLanguage();
    const primary = spot.images?.[0];

    return (
        <Link
            href={`/spots/${spot.id}`}
            className="block border border-line bg-card overflow-hidden hover:border-label transition-colors group"
        >
            <div className="relative h-36 bg-well overflow-hidden flex items-center justify-center">
                {primary ? (
                    <img
                        src={primary.url}
                        alt={spot.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                ) : (
                    <Car className="w-8 h-8 text-icon" strokeWidth={1} />
                )}
                <div
                    className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber text-ink"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                    {t(`spots.size.${spot.size}`)}
                </div>
                {primary && spot.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-scrim/70 text-page text-[10px]">
                        <Camera className="w-2.5 h-2.5" />
                        {spot.images.length}
                    </div>
                )}
            </div>
            <div className="px-4 py-3">
                <p className="text-sm font-semibold text-ink truncate mb-1">{spot.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{spot.address}</span>
                </div>
            </div>
        </Link>
    );
}
