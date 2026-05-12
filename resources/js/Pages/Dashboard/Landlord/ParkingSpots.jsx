import { useRef, useState } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import { Camera, Car, ImageIcon, MapPin, Pencil, Plus, X } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ParkingSpots() {
    const { spots } = usePage().props;
    const { t } = useLanguage();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    function openCreate() { setEditingId(null); setShowForm(true); }
    function openEdit(id) { setShowForm(false); setEditingId(id); }
    function closeAll() { setShowForm(false); setEditingId(null); }

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h1
                        className="text-[oklch(0.18_0.03_255)] uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        {t('spots.title')}
                    </h1>
                    {!showForm && !editingId && (
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-semibold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            {t('spots.add_new')}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] mb-8">
                        <FormHeader title={t('spots.new_form_title')} onClose={closeAll} />
                        <div className="p-6">
                            <CreateForm onSuccess={closeAll} />
                        </div>
                    </div>
                )}

                {!showForm && !editingId && (
                    spots.length === 0 ? (
                        <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] py-20 flex flex-col items-center text-center">
                            <Car className="w-10 h-10 text-[oklch(0.78_0.015_85)] mb-5" strokeWidth={1} />
                            <p
                                className="text-[oklch(0.18_0.03_255)] mb-2 uppercase"
                                style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.04em' }}
                            >
                                {t('spots.empty_title')}
                            </p>
                            <p className="text-sm text-[oklch(0.55_0.02_255)] max-w-xs leading-relaxed">
                                {t('spots.empty_body')}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {spots.map((spot) => (
                                <SpotCard key={spot.id} spot={spot} onEdit={() => openEdit(spot.id)} />
                            ))}
                        </div>
                    )
                )}

                {editingId && (() => {
                    const spot = spots.find((s) => s.id === editingId);
                    return spot ? (
                        <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)]">
                            <FormHeader title={t('spots.edit_form_title')} onClose={closeAll} />
                            <div className="p-6">
                                <EditForm spot={spot} onSuccess={closeAll} />
                            </div>
                        </div>
                    ) : null;
                })()}
            </div>
        </DashboardLayout>
    );
}

function FormHeader({ title, onClose }) {
    return (
        <div className="px-6 py-4 border-b border-[oklch(0.88_0.015_85)] flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.18_0.03_255)]" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
            </p>
            <button onClick={onClose} className="text-[oklch(0.60_0.02_255)] hover:text-[oklch(0.22_0.04_255)] transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function SpotCard({ spot, onEdit }) {
    const { t } = useLanguage();
    const hasImages = spot.images && spot.images.length > 0;
    const primary = hasImages ? spot.images[0] : null;
    const count = hasImages ? spot.images.length : 0;

    return (
        <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] overflow-hidden">
            {primary && (
                <div className="relative aspect-[16/7] overflow-hidden bg-[oklch(0.93_0.008_85)]">
                    <img
                        src={primary.url}
                        alt={spot.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                    />
                    {count > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-[oklch(0.12_0.02_255/0.72)] backdrop-blur-sm text-[oklch(0.96_0.005_85)] text-[11px] font-medium tracking-wide">
                            <Camera className="w-3 h-3 opacity-80" />
                            {count}
                        </div>
                    )}
                </div>
            )}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[oklch(0.18_0.03_255)] truncate">{spot.title}</p>
                        <span
                            className="shrink-0 px-1.5 py-0.5 bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)] text-[10px] font-bold uppercase tracking-wide"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {t(`spots.size.${spot.size}`)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[oklch(0.55_0.02_255)]">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{spot.address}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="shrink-0 text-right">
                        <p className="text-[oklch(0.18_0.03_255)] leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }}>
                            {Number(spot.price).toLocaleString('da-DK')} kr
                        </p>
                        <p className="text-xs text-[oklch(0.55_0.02_255)]">/{t(`spots.unit.${spot.price_unit}`)}</p>
                    </div>
                    <button
                        onClick={onEdit}
                        className="shrink-0 p-2 text-[oklch(0.60_0.02_255)] hover:text-[oklch(0.22_0.04_255)] hover:bg-[oklch(0.94_0.008_85)] transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function CreateForm({ onSuccess }) {
    const fileInputRef = useRef(null);
    const filesRef = useRef([]);
    const [previews, setPreviews] = useState([]);
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData, reset } = useForm({
        title: '', address: '', type: 'carport', size: 'standard',
        price: '', price_unit: 'month', description: '',
    });

    function handleFiles(e) {
        const combined = [...filesRef.current, ...Array.from(e.target.files)].slice(0, 10);
        filesRef.current = combined;
        setPreviews(combined.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
        e.target.value = '';
    }

    function removePreview(index) {
        const updated = filesRef.current.filter((_, i) => i !== index);
        filesRef.current = updated;
        setPreviews(updated.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
        filesRef.current.forEach((f) => fd.append('images[]', f));

        router.post('/landlord/parking-spots', fd, {
            onSuccess: () => { reset(); filesRef.current = []; setPreviews([]); onSuccess(); },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <SpotForm
            data={data} setData={setData} errors={errors} processing={processing}
            onSubmit={handleSubmit} submitLabelKey="spots.form.create_btn"
            fileInputRef={fileInputRef} previews={previews} fileCount={filesRef.current.length}
            onAddFiles={handleFiles} onRemovePreview={removePreview}
            existingImages={[]}
        />
    );
}

function EditForm({ spot, onSuccess }) {
    const fileInputRef = useRef(null);
    const filesRef = useRef([]);
    const [previews, setPreviews] = useState([]);
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData } = useForm({
        title: spot.title, address: spot.address, type: spot.type,
        size: spot.size, price: spot.price, price_unit: spot.price_unit,
        description: spot.description ?? '',
    });

    function handleFiles(e) {
        const combined = [...filesRef.current, ...Array.from(e.target.files)].slice(0, 10);
        filesRef.current = combined;
        setPreviews(combined.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
        e.target.value = '';
    }

    function removePreview(index) {
        const updated = filesRef.current.filter((_, i) => i !== index);
        filesRef.current = updated;
        setPreviews(updated.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
    }

    function deleteExistingImage(imageId) {
        router.delete(`/landlord/parking-spots/images/${imageId}`, { preserveScroll: true });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
        filesRef.current.forEach((f) => fd.append('images[]', f));

        router.post(`/landlord/parking-spots/${spot.id}`, fd, {
            onSuccess: () => { filesRef.current = []; setPreviews([]); onSuccess(); },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <SpotForm
            data={data} setData={setData} errors={errors} processing={processing}
            onSubmit={handleSubmit} submitLabelKey="spots.form.save_btn"
            fileInputRef={fileInputRef} previews={previews} fileCount={filesRef.current.length}
            onAddFiles={handleFiles} onRemovePreview={removePreview}
            existingImages={spot.images ?? []} onDeleteExisting={deleteExistingImage}
        />
    );
}

function SpotForm({ data, setData, errors, processing, onSubmit, submitLabelKey, fileInputRef, previews, fileCount, onAddFiles, onRemovePreview, existingImages, onDeleteExisting }) {
    const { t } = useLanguage();
    const totalImages = existingImages.length + fileCount;

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormField label={t('spots.form.title')} className="col-span-2">
                    <input type="text" required value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder={t('spots.form.title_ph')} className={inputCls} />
                    {errors.title && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.title}</p>}
                </FormField>

                <FormField label={t('spots.form.address')} className="col-span-2">
                    <input type="text" required value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Østerbrogade 124, 2100 København Ø" className={inputCls} />
                    {errors.address && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.address}</p>}
                </FormField>

                <FormField label={t('spots.form.type')}>
                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className={inputCls}>
                        <option value="carport">Carport</option>
                        <option value="garage">Garage</option>
                        <option value="outdoor">{t('spots.type.outdoor')}</option>
                        <option value="indoor">{t('spots.type.indoor')}</option>
                    </select>
                </FormField>

                <FormField label={t('spots.form.size')}>
                    <select value={data.size} onChange={(e) => setData('size', e.target.value)} className={inputCls}>
                        <option value="compact">{t('spots.size.compact')}</option>
                        <option value="standard">{t('spots.size.standard')}</option>
                        <option value="large">{t('spots.size.large')}</option>
                    </select>
                </FormField>

                <FormField label={t('spots.form.price')}>
                    <input type="number" required min={0} step={0.5} value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="850" className={inputCls} />
                    {errors.price && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.price}</p>}
                </FormField>

                <FormField label={t('spots.form.price_unit')}>
                    <select value={data.price_unit} onChange={(e) => setData('price_unit', e.target.value)} className={inputCls}>
                        <option value="hour">{t('spots.form.per_hour')}</option>
                        <option value="day">{t('spots.form.per_day')}</option>
                        <option value="month">{t('spots.form.per_month')}</option>
                    </select>
                </FormField>

                <FormField label={t('spots.form.description')} className="col-span-2">
                    <textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder={t('spots.form.desc_ph')} className={inputCls} />
                </FormField>

                <FormField label={t('spots.form.images')} className="col-span-2">
                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={onAddFiles} />

                    {(existingImages.length > 0 || previews.length > 0) && (
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative group aspect-square">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    {onDeleteExisting && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteExisting(img.id)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-[oklch(0.18_0.03_255)] text-[oklch(0.965_0.008_85)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {previews.map((p, i) => (
                                <div key={`preview-${i}`} className="relative group aspect-square">
                                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => onRemovePreview(i)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-[oklch(0.18_0.03_255)] text-[oklch(0.965_0.008_85)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={totalImages >= 10}
                        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[oklch(0.75_0.015_85)] text-xs text-[oklch(0.55_0.02_255)] hover:border-[oklch(0.55_0.02_255)] hover:text-[oklch(0.35_0.025_255)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ImageIcon className="w-3.5 h-3.5" />
                        {totalImages === 0
                            ? t('spots.form.add_images')
                            : `${t('spots.form.add_more')} (${totalImages}/10)`}
                    </button>
                    {errors['images.0'] && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors['images.0']}</p>}
                </FormField>
            </div>

            <button type="submit" disabled={processing} className={submitCls}>
                {processing ? t('spots.form.saving') : t(submitLabelKey)}
            </button>
        </form>
    );
}

function FormField({ label, children, className = '' }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-xs font-semibold text-[oklch(0.45_0.025_255)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls = 'w-full px-4 py-3 bg-[oklch(0.985_0.005_85)] border border-[oklch(0.85_0.015_85)] text-[oklch(0.18_0.03_255)] text-sm placeholder:text-[oklch(0.68_0.012_255)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.22_0.04_255)] focus:border-transparent transition-shadow resize-none';
const submitCls = 'w-full py-3.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] font-bold hover:bg-[oklch(0.30_0.04_255)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs tracking-widest uppercase';
