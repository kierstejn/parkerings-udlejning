import { useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarPlus, ChevronRight, ImageIcon, Pencil, Receipt, Trash2, X } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FormField, inputCls, submitCls } from './ParkingSpots';

const SECTIONS    = ['availability', 'rentals', 'media'];
const AVAIL_TABS  = ['upcoming', 'active', 'past'];
const RENTAL_TABS = ['current', 'upcoming', 'past'];

export default function ParkingSpotDetail() {
    const { spot } = usePage().props;
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState('availability');
    const [showAddAvail, setShowAddAvail]   = useState(false);

    const formOpen = showAddAvail;

    return (
        <DashboardLayout>
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8 max-w-2xl">
                <Link
                    href="/landlord/parking-spots"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.55_0.02_255)] hover:text-[oklch(0.22_0.04_255)] uppercase tracking-widest transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t('spots.detail.back')}
                </Link>
                <Link
                    href={`/landlord/parking-spots/${spot.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[oklch(0.88_0.015_85)] text-[oklch(0.45_0.025_255)] text-xs font-semibold tracking-widest uppercase hover:border-[oklch(0.55_0.02_255)] hover:text-[oklch(0.22_0.04_255)] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    {t('spots.detail.edit')}
                </Link>
            </div>

            {formOpen ? (
                /* ── Form-only view ─────────────────────── */
                <div className="max-w-2xl">
                    <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)]">
                        <div className="px-6 py-4 border-b border-[oklch(0.88_0.015_85)] flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.18_0.03_255)]" style={{ fontFamily: 'var(--font-display)' }}>
                                {t('spots.detail.add_availability')}
                            </p>
                            <button onClick={() => setShowAddAvail(false)} className="text-[oklch(0.60_0.02_255)] hover:text-[oklch(0.22_0.04_255)] transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <AvailabilityForm spotId={spot.id} onSuccess={() => setShowAddAvail(false)} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* ── Spot meta ───────────────────────── */}
                    <div className="max-w-2xl mb-10">
                        <h1
                            className="text-[oklch(0.18_0.03_255)] uppercase leading-tight mb-3"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                        >
                            {spot.title}
                        </h1>
                        <p className="text-sm text-[oklch(0.55_0.02_255)] mb-4">{spot.address}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <TypeBadge label={t(`spots.type.${spot.type}`)} />
                            <TypeBadge label={t(`spots.size.${spot.size}`)} accent />
                        </div>
                        {spot.description && (
                            <p className="text-sm text-[oklch(0.40_0.02_255)] leading-relaxed max-w-prose">{spot.description}</p>
                        )}
                    </div>

                    {/* ── Two-column: side nav + content ──── */}
                    <div className="flex gap-10 items-start">

                        {/* Sticky section nav */}
                        <nav className="w-36 shrink-0 sticky top-20">
                            {SECTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setActiveSection(s)}
                                    className={[
                                        'w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors mb-0.5',
                                        activeSection === s
                                            ? 'bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)]'
                                            : 'text-[oklch(0.55_0.02_255)] hover:text-[oklch(0.22_0.04_255)] hover:bg-[oklch(0.94_0.008_85)]',
                                    ].join(' ')}
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {t(`spots.detail.section.${s}`)}
                                </button>
                            ))}
                        </nav>

                        {/* Scrollable section content */}
                        <div className="flex-1 min-w-0 max-w-2xl">
                            {activeSection === 'availability' && (
                                <AvailabilitySection
                                    spot={spot}
                                    onOpenForm={() => setShowAddAvail(true)}
                                />
                            )}
                            {activeSection === 'rentals' && (
                                <RentalsSection spot={spot} />
                            )}
                            {activeSection === 'media' && (
                                <MediaSection spot={spot} />
                            )}
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}

// ── Media section ───────────────────────────────────────────────

function MediaSection({ spot }) {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const filesRef = useRef([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const images = spot.images ?? [];
    const remaining = 10 - images.length;

    function handleFiles(e) {
        const combined = [...filesRef.current, ...Array.from(e.target.files)].slice(0, remaining);
        filesRef.current = combined;
        setPreviews(combined.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
        e.target.value = '';
    }

    function removePreview(index) {
        const updated = filesRef.current.filter((_, i) => i !== index);
        filesRef.current = updated;
        setPreviews(updated.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
    }

    function deleteImage(imageId) {
        router.delete(`/landlord/parking-spots/images/${imageId}`, { preserveScroll: true });
    }

    function handleUpload() {
        if (!filesRef.current.length) return;
        setUploading(true);
        const fd = new FormData();
        filesRef.current.forEach((f) => fd.append('images[]', f));
        router.post(`/landlord/parking-spots/${spot.id}/images`, fd, {
            onSuccess: () => { filesRef.current = []; setPreviews([]); },
            onFinish: () => setUploading(false),
            preserveScroll: true,
        });
    }

    return (
        <div>
            <p
                className="text-[9px] font-bold uppercase tracking-[0.12em] text-[oklch(0.65_0.015_255)] mb-4 px-1"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {t('spots.media.public_label')}
            </p>

            {images.length === 0 && previews.length === 0 ? (
                <EmptyState icon={ImageIcon} label={t('spots.media.empty')} />
            ) : (
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative group aspect-square bg-[oklch(0.93_0.008_85)] overflow-hidden">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => deleteImage(img.id)}
                                className="absolute top-1 right-1 w-5 h-5 bg-[oklch(0.12_0.02_255/0.75)] text-[oklch(0.965_0.008_85)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {previews.map((p, i) => (
                        <div key={`preview-${i}`} className="relative group aspect-square bg-[oklch(0.93_0.008_85)] overflow-hidden opacity-60">
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removePreview(i)}
                                className="absolute top-1 right-1 w-5 h-5 bg-[oklch(0.18_0.03_255)] text-[oklch(0.965_0.008_85)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />

            <div className="flex gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={remaining <= 0}
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[oklch(0.75_0.015_85)] text-xs text-[oklch(0.55_0.02_255)] hover:border-[oklch(0.55_0.02_255)] hover:text-[oklch(0.35_0.025_255)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {images.length + previews.length === 0 ? t('spots.media.add_images') : `${t('spots.media.add_more')} (${images.length + previews.length}/10)`}
                </button>

                {previews.length > 0 && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className={submitCls + ' !w-auto px-6'}
                    >
                        {uploading ? t('spots.media.uploading') : t('spots.media.upload')}
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Availability section ────────────────────────────────────────

function AvailabilitySection({ spot, onOpenForm }) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('upcoming');
    const now = new Date();

    const buckets = {
        upcoming: (spot.availabilities ?? []).filter((a) => new Date(a.starts_at) > now),
        active:   (spot.availabilities ?? []).filter((a) => new Date(a.starts_at) <= now && new Date(a.ends_at) >= now),
        past:     (spot.availabilities ?? []).filter((a) => new Date(a.ends_at) < now),
    };
    const visible = buckets[filter];

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <FilterTabs tabs={AVAIL_TABS} active={filter} onChange={setFilter} prefix="spots.avail.filter" counts={buckets} />
                <button
                    onClick={onOpenForm}
                    className="flex items-center gap-2 px-3 py-2 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-semibold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors shrink-0"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    <CalendarPlus className="w-3 h-3" />
                    {t('spots.detail.add_availability')}
                </button>
            </div>

            {visible.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {visible.map((avail) => <AvailabilityRow key={avail.id} avail={avail} />)}
                </div>
            ) : (
                <EmptyState icon={CalendarPlus} label={t(`spots.avail.empty.${filter}`)} />
            )}
        </div>
    );
}

// ── Rentals section ─────────────────────────────────────────────

function RentalsSection({ spot }) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('current');
    const rentals = spot.rentals ?? [];
    const now = new Date();

    const buckets = {
        current:  rentals.filter((r) => new Date(r.starts_at) <= now && new Date(r.ends_at) >= now),
        upcoming: rentals.filter((r) => new Date(r.starts_at) > now),
        past:     rentals.filter((r) => new Date(r.ends_at) < now),
    };
    const visible = buckets[filter];

    return (
        <div>
            <div className="mb-5">
                <FilterTabs tabs={RENTAL_TABS} active={filter} onChange={setFilter} prefix="spots.rental.filter" counts={buckets} />
            </div>

            {visible.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {visible.map((rental) => <RentalRow key={rental.id} rental={rental} />)}
                </div>
            ) : (
                <EmptyState icon={Receipt} label={t(`spots.rental.empty.${filter}`)} />
            )}
        </div>
    );
}

// ── Shared UI ───────────────────────────────────────────────────

function FilterTabs({ tabs, active, onChange, prefix, counts }) {
    const { t } = useLanguage();
    return (
        <div className="flex gap-1">
            {tabs.map((tab) => {
                const count = counts?.[tab]?.length ?? 0;
                return (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={[
                            'px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors flex items-center gap-1.5',
                            active === tab
                                ? 'bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)]'
                                : 'text-[oklch(0.55_0.02_255)] hover:text-[oklch(0.30_0.03_255)]',
                        ].join(' ')}
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {t(`${prefix}.${tab}`)}
                        {counts && (
                            <span className={`text-[9px] font-bold ${active === tab ? 'opacity-70' : 'opacity-50'}`}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function EmptyState({ icon: Icon, label }) {
    return (
        <div className="border border-dashed border-[oklch(0.85_0.015_85)] py-12 flex flex-col items-center text-center">
            <Icon className="w-8 h-8 text-[oklch(0.78_0.015_85)] mb-3" strokeWidth={1} />
            <p className="text-sm text-[oklch(0.55_0.02_255)]">{label}</p>
        </div>
    );
}

function TypeBadge({ label, accent = false }) {
    return (
        <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${accent ? 'bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)]' : 'bg-[oklch(0.92_0.008_85)] text-[oklch(0.40_0.025_255)]'}`}
            style={{ fontFamily: 'var(--font-display)' }}
        >
            {label}
        </span>
    );
}

// ── Confirm dialog ──────────────────────────────────────────────

function ConfirmDialog({ open, onConfirm, onCancel }) {
    const { t } = useLanguage();
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'oklch(0.12 0.02 255 / 0.45)' }}
            onClick={onCancel}
        >
            <div className="bg-[oklch(0.992_0.004_85)] border border-[oklch(0.88_0.015_85)] p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <p className="text-[oklch(0.18_0.03_255)] uppercase mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.02em' }}>
                    {t('spots.avail.confirm_delete_title')}
                </p>
                <p className="text-sm text-[oklch(0.50_0.02_255)] mb-6 leading-relaxed">
                    {t('spots.avail.confirm_delete_body')}
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2.5 border border-[oklch(0.85_0.015_85)] text-xs font-semibold uppercase tracking-widest text-[oklch(0.45_0.025_255)] hover:border-[oklch(0.65_0.02_255)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                        {t('spots.avail.confirm_cancel')}
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 bg-[oklch(0.45_0.18_25)] text-[oklch(0.965_0.008_85)] text-xs font-semibold uppercase tracking-widest hover:bg-[oklch(0.38_0.18_25)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                        {t('spots.avail.confirm_delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Rows ────────────────────────────────────────────────────────

function AvailabilityRow({ avail }) {
    const { t } = useLanguage();
    const locale = 'da-DK';
    const [confirming, setConfirming] = useState(false);

    const fmt = (iso) => {
        const d = new Date(iso);
        if (avail.booking_type === 'hour') {
            return d.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    };

    function priceLabel() {
        if (avail.booking_type === 'long') return `${Number(avail.price).toLocaleString(locale)} kr`;
        if (avail.booking_type === 'hour') return `${Number(avail.price).toLocaleString(locale)} kr/${t('spots.avail.type.hour').toLowerCase()}`;
        return `${Number(avail.price).toLocaleString(locale)} kr/${t('spots.avail.type.day').toLowerCase()}`;
    }

    return (
        <>
            <ConfirmDialog
                open={confirming}
                onConfirm={() => { router.delete(`/landlord/parking-spots/availability/${avail.id}`, { preserveScroll: true }); setConfirming(false); }}
                onCancel={() => setConfirming(false)}
            />
            <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-[oklch(0.92_0.008_85)] text-[oklch(0.40_0.025_255)] text-[10px] font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                            {t(`spots.avail.type.${avail.booking_type}`)}
                        </span>
                        <span className="text-sm font-semibold text-[oklch(0.18_0.03_255)]">{priceLabel()}</span>
                    </div>
                    <p className="text-xs text-[oklch(0.55_0.02_255)]">
                        {fmt(avail.starts_at)} <ChevronRight className="w-3 h-3 inline mx-0.5 opacity-50" /> {fmt(avail.ends_at)}
                    </p>
                    {(avail.min_duration || avail.max_duration) && (
                        <p className="text-xs text-[oklch(0.60_0.02_255)] mt-0.5">
                            {avail.min_duration && `${t(avail.booking_type === 'day' ? 'spots.avail.min_duration_day' : 'spots.avail.min_duration')}: ${avail.min_duration}`}
                            {avail.min_duration && avail.max_duration && ' · '}
                            {avail.max_duration && `${t(avail.booking_type === 'day' ? 'spots.avail.max_duration_day' : 'spots.avail.max_duration')}: ${avail.max_duration}`}
                        </p>
                    )}
                    {avail.day_start_time && avail.day_end_time && (
                        <p className="text-xs text-[oklch(0.60_0.02_255)] mt-0.5">
                            {avail.day_start_time.slice(0, 5)} – {avail.day_end_time.slice(0, 5)}
                        </p>
                    )}
                </div>
                <button onClick={() => setConfirming(true)} className="shrink-0 p-2 text-[oklch(0.60_0.02_255)] hover:text-[oklch(0.50_0.18_25)] hover:bg-[oklch(0.94_0.008_85)] transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </>
    );
}

function RentalRow({ rental }) {
    const locale = 'da-DK';
    const fmt = (iso) => new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[oklch(0.18_0.03_255)]">{rental.tenant_name ?? '—'}</span>
            </div>
            <p className="text-xs text-[oklch(0.55_0.02_255)]">
                {fmt(rental.starts_at)} <ChevronRight className="w-3 h-3 inline mx-0.5 opacity-50" /> {fmt(rental.ends_at)}
            </p>
        </div>
    );
}

// ── Availability form ───────────────────────────────────────────

const pad = (n) => String(n).padStart(2, '0');

function tomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nextHourDatetime() {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

function toUtcIso(value, dateOnly) {
    if (!value) return value;
    return new Date(dateOnly ? `${value}T00:00:00` : value).toISOString();
}

function AvailabilityForm({ spotId, onSuccess }) {
    const { t } = useLanguage();
    const { errors } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        starts_at: '', ends_at: '', booking_type: 'day', price: '',
        min_duration: '', max_duration: '', day_start_time: '', day_end_time: '',
    });

    function set(key, val) { setData((prev) => ({ ...prev, [key]: val })); }
    function changeType(type) { setData((prev) => ({ ...prev, booking_type: type, starts_at: '', ends_at: '' })); }

    const isHour = data.booking_type === 'hour';
    const isDay  = data.booking_type === 'day';
    const isLong = data.booking_type === 'long';
    const useDateOnly = isDay || isLong;

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        router.post(`/landlord/parking-spots/${spotId}/availability`, {
            ...data,
            starts_at: toUtcIso(data.starts_at, useDateOnly),
            ends_at:   toUtcIso(data.ends_at,   useDateOnly),
        }, {
            onSuccess: () => onSuccess(),
            onFinish: () => setProcessing(false),
        });
    }

    const minStart = useDateOnly ? tomorrowDate() : nextHourDatetime();
    const minEnd   = data.starts_at || minStart;
    const priceKey = isLong ? 'spots.avail.price_long' : isHour ? 'spots.avail.price_hour' : 'spots.avail.price_day';
    const minKey   = isDay  ? 'spots.avail.min_duration_day' : 'spots.avail.min_duration';
    const maxKey   = isDay  ? 'spots.avail.max_duration_day' : 'spots.avail.max_duration';

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormField label={t('spots.avail.booking_type')} className="col-span-2">
                    <div className="flex">
                        {[
                            { value: 'day',  key: 'spots.avail.type.day' },
                            { value: 'hour', key: 'spots.avail.type.hour' },
                            { value: 'long', key: 'spots.avail.type.long' },
                        ].map(({ value, key }, i) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => changeType(value)}
                                className={[
                                    'flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors border',
                                    i > 0 ? '-ml-px' : '',
                                    data.booking_type === value
                                        ? 'bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] border-[oklch(0.22_0.04_255)] z-10 relative'
                                        : 'bg-[oklch(0.985_0.005_85)] text-[oklch(0.55_0.02_255)] border-[oklch(0.85_0.015_85)] hover:text-[oklch(0.22_0.04_255)]',
                                ].join(' ')}
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {t(key)}
                            </button>
                        ))}
                    </div>
                </FormField>

                <FormField label={t('spots.avail.starts_at')}>
                    <input type={useDateOnly ? 'date' : 'datetime-local'} required min={minStart} value={data.starts_at} onChange={(e) => set('starts_at', e.target.value)} className={inputCls} />
                    {errors.starts_at && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.starts_at}</p>}
                </FormField>

                <FormField label={t('spots.avail.ends_at')}>
                    <input type={useDateOnly ? 'date' : 'datetime-local'} required min={minEnd} value={data.ends_at} onChange={(e) => set('ends_at', e.target.value)} className={inputCls} />
                    {errors.ends_at && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.ends_at}</p>}
                </FormField>

                <FormField label={t(priceKey)} className="col-span-2">
                    <input type="number" required min={0} step={0.5} value={data.price} onChange={(e) => set('price', e.target.value)} placeholder="0" className={inputCls} />
                    {errors.price && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.price}</p>}
                </FormField>

                {!isLong && (
                    <>
                        <FormField label={`${t(minKey)} (${t('spots.avail.optional')})`}>
                            <input type="number" min={1} value={data.min_duration} onChange={(e) => set('min_duration', e.target.value)} placeholder="—" className={inputCls} />
                            {errors.min_duration && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.min_duration}</p>}
                        </FormField>
                        <FormField label={`${t(maxKey)} (${t('spots.avail.optional')})`}>
                            <input type="number" min={1} value={data.max_duration} onChange={(e) => set('max_duration', e.target.value)} placeholder="—" className={inputCls} />
                            {errors.max_duration && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.max_duration}</p>}
                        </FormField>
                    </>
                )}

                {isDay && (
                    <>
                        <FormField label={t('spots.avail.day_start_time')}>
                            <input type="time" value={data.day_start_time} onChange={(e) => set('day_start_time', e.target.value)} className={inputCls} />
                            {errors.day_start_time && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.day_start_time}</p>}
                        </FormField>
                        <FormField label={t('spots.avail.day_end_time')}>
                            <input type="time" value={data.day_end_time} onChange={(e) => set('day_end_time', e.target.value)} className={inputCls} />
                            {errors.day_end_time && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.day_end_time}</p>}
                        </FormField>
                    </>
                )}
            </div>

            <button type="submit" disabled={processing} className={submitCls}>
                {processing ? t('spots.avail.saving') : t('spots.avail.save')}
            </button>
        </form>
    );
}
