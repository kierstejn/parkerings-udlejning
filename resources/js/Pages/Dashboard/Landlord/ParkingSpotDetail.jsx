import { useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarPlus, ChevronRight, ImageIcon, Pencil, Receipt, Trash2, X } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FormField, inputCls, submitCls } from '../../../Components/ui/FormField';
import { EmptyState } from '../../../Components/ui/EmptyState';
import { ConfirmDialog } from '../../../Components/ui/ConfirmDialog';

const SECTIONS    = ['availability', 'rentals', 'media'];
const AVAIL_TABS  = ['upcoming', 'active', 'past'];
const RENTAL_TABS = ['current', 'upcoming', 'past'];

export default function ParkingSpotDetail() {
    const { spot } = usePage().props;
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState('availability');
    const [showAddAvail, setShowAddAvail]   = useState(false);
    const [deleting, setDeleting]           = useState(false);

    const formOpen = showAddAvail;

    return (
        <DashboardLayout>
            <ConfirmDialog
                open={deleting}
                title={t('spots.detail.delete_title')}
                body={t('spots.detail.delete_body')}
                confirmLabel={t('spots.detail.delete_confirm')}
                cancelLabel={t('spots.detail.delete_cancel')}
                onConfirm={() => router.delete(`/landlord/parking-spots/${spot.id}`)}
                onCancel={() => setDeleting(false)}
            />

            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/landlord/parking-spots"
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink uppercase tracking-widest transition-colors font-display"
                >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{t('spots.detail.back')}</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/landlord/parking-spots/${spot.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2.5 border border-line text-faint text-xs font-semibold tracking-widest uppercase hover:border-muted hover:text-ink transition-colors font-display"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        {t('spots.detail.edit')}
                    </Link>
                    <button
                        onClick={() => setDeleting(true)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-line text-faint text-xs font-semibold tracking-widest uppercase hover:border-danger hover:text-danger transition-colors font-display"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {formOpen ? (
                /* ── Form-only view ─────────────────────── */
                <div>
                    <div className="border border-line bg-card">
                        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-widest text-ink font-display">
                                {t('spots.detail.add_availability')}
                            </p>
                            <button onClick={() => setShowAddAvail(false)} className="text-faint hover:text-ink transition-colors">
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
                    <div className="mb-10">
                        <h1
                            className="text-ink uppercase leading-tight mb-3 font-display"
                            style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                        >
                            {spot.title}
                        </h1>
                        <p className="text-sm text-muted mb-4">{spot.address}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <TypeBadge label={t(`spots.type.${spot.type}`)} />
                            <TypeBadge label={t(`spots.size.${spot.size}`)} accent />
                        </div>
                        {spot.description && (
                            <p className="text-sm text-body leading-relaxed max-w-prose">{spot.description}</p>
                        )}
                    </div>

                    {/* ── Mobile: horizontal tab strip ────── */}
                    <div className="flex md:hidden border-b border-line mb-6 -mx-4 px-4">
                        {SECTIONS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveSection(s)}
                                className={[
                                    'flex-1 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors font-display border-b-2 -mb-px',
                                    activeSection === s
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted hover:text-ink',
                                ].join(' ')}
                            >
                                {t(`spots.detail.section.${s}`)}
                            </button>
                        ))}
                    </div>

                    {/* ── Desktop: two-column side nav + content ── */}
                    <div className="flex gap-10 items-start">

                        {/* Sticky section nav (desktop only) */}
                        <nav className="hidden md:flex flex-col w-36 shrink-0 sticky top-20">
                            {SECTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setActiveSection(s)}
                                    className={[
                                        'w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors mb-0.5 font-display',
                                        activeSection === s
                                            ? 'bg-primary text-page'
                                            : 'text-muted hover:text-ink hover:bg-hover',
                                    ].join(' ')}
                                >
                                    {t(`spots.detail.section.${s}`)}
                                </button>
                            ))}
                        </nav>

                        {/* Scrollable section content */}
                        <div className="flex-1 min-w-0">
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
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-label mb-4 px-1 font-display">
                {t('spots.media.public_label')}
            </p>

            {images.length === 0 && previews.length === 0 ? (
                <EmptyState icon={ImageIcon} label={t('spots.media.empty')} />
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative group aspect-square bg-well overflow-hidden">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => deleteImage(img.id)}
                                className="absolute top-1 right-1 w-5 h-5 bg-scrim/75 text-page flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {previews.map((p, i) => (
                        <div key={`preview-${i}`} className="relative group aspect-square bg-well overflow-hidden opacity-60">
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removePreview(i)}
                                className="absolute top-1 right-1 w-5 h-5 bg-primary text-page flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-line-faint text-xs text-muted hover:border-muted hover:text-body transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {images.length + previews.length === 0
                        ? t('spots.media.add_images')
                        : `${t('spots.media.add_more')} (${images.length + previews.length}/10)`}
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
            <div className="flex flex-wrap gap-3 items-start mb-5">
                <FilterTabs tabs={AVAIL_TABS} active={filter} onChange={setFilter} prefix="spots.avail.filter" counts={buckets} />
                <button
                    onClick={onOpenForm}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors shrink-0 font-display ml-auto"
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
                            'px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors flex items-center gap-1.5 font-display',
                            active === tab
                                ? 'bg-primary text-page'
                                : 'text-muted hover:text-primary',
                        ].join(' ')}
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

function TypeBadge({ label, accent = false }) {
    return (
        <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide font-display ${
                accent ? 'bg-amber text-ink' : 'bg-chip text-faint'
            }`}
        >
            {label}
        </span>
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
                title={t('spots.avail.confirm_delete_title')}
                body={t('spots.avail.confirm_delete_body')}
                confirmLabel={t('spots.avail.confirm_delete')}
                cancelLabel={t('spots.avail.confirm_cancel')}
                onConfirm={() => {
                    router.delete(`/landlord/parking-spots/availability/${avail.id}`, { preserveScroll: true });
                    setConfirming(false);
                }}
                onCancel={() => setConfirming(false)}
            />
            <div className="border border-line bg-card px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-chip text-faint text-[10px] font-bold uppercase tracking-wide font-display">
                            {t(`spots.avail.type.${avail.booking_type}`)}
                        </span>
                        <span className="text-sm font-semibold text-ink">{priceLabel()}</span>
                    </div>
                    <p className="text-xs text-muted">
                        {fmt(avail.starts_at)} <ChevronRight className="w-3 h-3 inline mx-0.5 opacity-50" /> {fmt(avail.ends_at)}
                    </p>
                    {(avail.min_duration || avail.max_duration) && (
                        <p className="text-xs text-faint mt-0.5">
                            {avail.min_duration && `${t(avail.booking_type === 'day' ? 'spots.avail.min_duration_day' : 'spots.avail.min_duration')}: ${avail.min_duration}`}
                            {avail.min_duration && avail.max_duration && ' · '}
                            {avail.max_duration && `${t(avail.booking_type === 'day' ? 'spots.avail.max_duration_day' : 'spots.avail.max_duration')}: ${avail.max_duration}`}
                        </p>
                    )}
                    {avail.day_start_time && avail.day_end_time && (
                        <p className="text-xs text-faint mt-0.5">
                            {avail.day_start_time.slice(0, 5)} – {avail.day_end_time.slice(0, 5)}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setConfirming(true)}
                    className="shrink-0 p-2 text-faint hover:text-error hover:bg-hover transition-colors"
                >
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
        <div className="border border-line bg-card px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-ink">{rental.tenant_name ?? '—'}</span>
            </div>
            <p className="text-xs text-muted">
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
                                    'flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors border font-display',
                                    i > 0 ? '-ml-px' : '',
                                    data.booking_type === value
                                        ? 'bg-primary text-page border-primary z-10 relative'
                                        : 'bg-input text-muted border-line-dim hover:text-ink',
                                ].join(' ')}
                            >
                                {t(key)}
                            </button>
                        ))}
                    </div>
                </FormField>

                <FormField label={t('spots.avail.starts_at')}>
                    <input type={useDateOnly ? 'date' : 'datetime-local'} required min={minStart} value={data.starts_at} onChange={(e) => set('starts_at', e.target.value)} className={inputCls} />
                    {errors.starts_at && <p className="text-xs text-error mt-1">{errors.starts_at}</p>}
                </FormField>

                <FormField label={t('spots.avail.ends_at')}>
                    <input type={useDateOnly ? 'date' : 'datetime-local'} required min={minEnd} value={data.ends_at} onChange={(e) => set('ends_at', e.target.value)} className={inputCls} />
                    {errors.ends_at && <p className="text-xs text-error mt-1">{errors.ends_at}</p>}
                </FormField>

                <FormField label={t(priceKey)} className="col-span-2">
                    <input type="number" required min={0} step={0.5} value={data.price} onChange={(e) => set('price', e.target.value)} placeholder="0" className={inputCls} />
                    {errors.price && <p className="text-xs text-error mt-1">{errors.price}</p>}
                </FormField>

                {!isLong && (
                    <>
                        <FormField label={`${t(minKey)} (${t('spots.avail.optional')})`}>
                            <input type="number" min={1} value={data.min_duration} onChange={(e) => set('min_duration', e.target.value)} placeholder="—" className={inputCls} />
                            {errors.min_duration && <p className="text-xs text-error mt-1">{errors.min_duration}</p>}
                        </FormField>
                        <FormField label={`${t(maxKey)} (${t('spots.avail.optional')})`}>
                            <input type="number" min={1} value={data.max_duration} onChange={(e) => set('max_duration', e.target.value)} placeholder="—" className={inputCls} />
                            {errors.max_duration && <p className="text-xs text-error mt-1">{errors.max_duration}</p>}
                        </FormField>
                    </>
                )}

                {isDay && (
                    <>
                        <FormField label={t('spots.avail.day_start_time')}>
                            <input type="time" value={data.day_start_time} onChange={(e) => set('day_start_time', e.target.value)} className={inputCls} />
                            {errors.day_start_time && <p className="text-xs text-error mt-1">{errors.day_start_time}</p>}
                        </FormField>
                        <FormField label={t('spots.avail.day_end_time')}>
                            <input type="time" value={data.day_end_time} onChange={(e) => set('day_end_time', e.target.value)} className={inputCls} />
                            {errors.day_end_time && <p className="text-xs text-error mt-1">{errors.day_end_time}</p>}
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
