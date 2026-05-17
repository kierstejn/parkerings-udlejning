import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Camera, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import AppHeader from '../Components/AppHeader';
import { useLanguage } from '../contexts/LanguageContext';

export default function SpotDetail() {
    const { spot, auth } = usePage().props;
    const { t } = useLanguage();
    const [imageIndex, setImageIndex] = useState(0);

    const images = spot.images ?? [];
    const user = auth?.user ?? null;

    function prevImage() {
        setImageIndex((i) => (i - 1 + images.length) % images.length);
    }

    function nextImage() {
        setImageIndex((i) => (i + 1) % images.length);
    }

    return (
        <div className="min-h-screen bg-page" style={{ fontFamily: 'var(--font-body)' }}>
            <AppHeader />

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">

                {/* Back link */}
                <Link
                    href="/spots"
                    className="inline-flex items-center gap-1.5 text-sm text-body hover:text-ink transition-colors mb-6"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t('spot.back')}
                </Link>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* ── Left column ────────────────────────────── */}
                    <div className="w-full lg:flex-1 min-w-0">

                        {/* Image gallery */}
                        {images.length > 0 && (
                        <div className="relative bg-well border border-line overflow-hidden mb-6 h-56 md:h-72">
                            <img
                                src={images[imageIndex].url}
                                alt={spot.title}
                                className="w-full h-full object-cover"
                            />
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-scrim/60 text-page hover:bg-scrim/80 transition-colors"
                                        aria-label="Forrige billede"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-scrim/60 text-page hover:bg-scrim/80 transition-colors"
                                        aria-label="Næste billede"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-scrim/70 text-page text-[10px]">
                                        <Camera className="w-2.5 h-2.5" />
                                        {imageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                        )}

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setImageIndex(i)}
                                        className={`shrink-0 w-16 h-12 overflow-hidden border-2 transition-colors ${
                                            i === imageIndex ? 'border-primary' : 'border-transparent'
                                        }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Title + location */}
                        <h1
                            className="text-ink mb-2 uppercase"
                            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '-0.01em' }}
                        >
                            {spot.title}
                        </h1>
                        <div className="flex items-center gap-1.5 text-sm text-muted mb-5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{spot.address}</span>
                        </div>

                        {/* Meta chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Chip label={t('spots.form.type')} value={t(`spots.type.${spot.type}`)} />
                            <Chip label={t('spots.form.size')} value={t(`spots.size.${spot.size}`)} />
                        </div>

                        {/* Description */}
                        {spot.description && (
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label mb-2 font-display">
                                    {t('spot.description')}
                                </p>
                                <p className="text-sm text-body leading-relaxed whitespace-pre-wrap">
                                    {spot.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Right column: booking sidebar ──────────── */}
                    <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
                        <div className="border border-line bg-card p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-label mb-4 font-display">
                                {t('spot.availability')}
                            </p>

                            {spot.availabilities.length === 0 ? (
                                <p className="text-sm text-muted">{t('spot.no_availability')}</p>
                            ) : (
                                <div className="flex flex-col gap-3 mb-5">
                                    {spot.availabilities.map((avail) => (
                                        <AvailabilityRow key={avail.id} avail={avail} t={t} />
                                    ))}
                                </div>
                            )}

                            {spot.availabilities.length > 0 && (
                                <div className="mt-5">
                                    {user ? (
                                        <button className="w-full py-3 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display">
                                            {t('spot.book')}
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="block w-full py-3 text-center bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display"
                                        >
                                            {t('spot.login_to_book')}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Chip({ label, value }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-line bg-well text-xs">
            <span className="text-muted font-medium">{label}:</span>
            <span className="text-ink font-semibold">{value}</span>
        </div>
    );
}

function AvailabilityRow({ avail, t }) {
    const from = new Date(avail.starts_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' });
    const to   = new Date(avail.ends_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' });

    const typeLabel = {
        long: t('spots.avail.type.long'),
        hour: t('spots.avail.type.hour'),
        day:  t('spots.avail.type.day'),
    }[avail.booking_type] ?? avail.booking_type;

    const priceUnit = {
        long: t('spots.unit.month'),
        hour: t('spots.unit.hour'),
        day:  t('spots.unit.day'),
    }[avail.booking_type] ?? '';

    return (
        <div className="border border-line-dim bg-page p-3 text-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-muted">{t('spot.period')}</span>
                <span className="text-ink font-medium">{from} – {to}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted">{typeLabel}</span>
                <span className="text-ink font-semibold">
                    {Number(avail.price).toLocaleString('da-DK')} {t('spot.kr_suffix')} / {priceUnit}
                </span>
            </div>
        </div>
    );
}
