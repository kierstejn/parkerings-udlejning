import { useState } from 'react';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import { Camera, Car, MapPin, Plus, X } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FormField, inputCls, submitCls } from '../../../Components/ui/FormField';

export default function ParkingSpots() {
    const { spots } = usePage().props;
    const { t } = useLanguage();
    const [showForm, setShowForm] = useState(false);

    function openCreate() { setShowForm(true); }
    function closeAll() { setShowForm(false); }

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h1
                        className="text-ink uppercase font-display"
                        style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        {t('spots.title')}
                    </h1>
                    {!showForm && (
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-page text-xs font-semibold tracking-widest uppercase hover:bg-primary-hover transition-colors font-display"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            {t('spots.add_new')}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="border border-line bg-card mb-8">
                        <FormHeader title={t('spots.new_form_title')} onClose={closeAll} />
                        <div className="p-6">
                            <CreateForm onSuccess={closeAll} />
                        </div>
                    </div>
                )}

                {!showForm && (
                    spots.length === 0 ? (
                        <div className="border border-line bg-card py-20 flex flex-col items-center text-center">
                            <Car className="w-10 h-10 text-icon mb-5" strokeWidth={1} />
                            <p
                                className="text-ink mb-2 uppercase font-display"
                                style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.04em' }}
                            >
                                {t('spots.empty_title')}
                            </p>
                            <p className="text-sm text-muted max-w-xs leading-relaxed">
                                {t('spots.empty_body')}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {spots.map((spot) => (
                                <SpotCard key={spot.id} spot={spot} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </DashboardLayout>
    );
}

function FormHeader({ title, onClose }) {
    return (
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink font-display">
                {title}
            </p>
            <button onClick={onClose} className="text-faint hover:text-primary transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function SpotCard({ spot }) {
    const { t } = useLanguage();
    const hasImages = spot.images && spot.images.length > 0;
    const primary = hasImages ? spot.images[0] : null;
    const count = hasImages ? spot.images.length : 0;

    return (
        <Link
            href={`/landlord/parking-spots/${spot.id}`}
            className="block border border-line bg-card overflow-hidden hover:border-label transition-colors"
        >
            {primary && (
                <div className="relative aspect-[16/7] overflow-hidden bg-well">
                    <img
                        src={primary.url}
                        alt={spot.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                    />
                    {count > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-scrim/72 backdrop-blur-sm text-page text-[11px] font-medium tracking-wide">
                            <Camera className="w-3 h-3 opacity-80" />
                            {count}
                        </div>
                    )}
                </div>
            )}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-ink truncate">{spot.title}</p>
                        <span className="shrink-0 px-1.5 py-0.5 bg-amber text-ink text-[10px] font-bold uppercase tracking-wide font-display">
                            {t(`spots.size.${spot.size}`)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{spot.address}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function CreateForm({ onSuccess }) {
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData, reset } = useForm({
        title: '', address: '', type: 'carport', size: 'standard', description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        router.post('/landlord/parking-spots', data, {
            onSuccess: () => { reset(); onSuccess(); },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <SpotForm
            data={data} setData={setData} errors={errors} processing={processing}
            onSubmit={handleSubmit} submitLabelKey="spots.form.create_btn"
        />
    );
}

export function EditForm({ spot, onSuccess }) {
    const [processing, setProcessing] = useState(false);
    const { errors } = usePage().props;

    const { data, setData } = useForm({
        title: spot.title, address: spot.address, type: spot.type,
        size: spot.size, description: spot.description ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);
        router.post(`/landlord/parking-spots/${spot.id}`, data, {
            onSuccess: () => { if (onSuccess) onSuccess(); },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <SpotForm
            data={data} setData={setData} errors={errors} processing={processing}
            onSubmit={handleSubmit} submitLabelKey="spots.form.save_btn"
        />
    );
}

function SpotForm({ data, setData, errors, processing, onSubmit, submitLabelKey }) {
    const { t } = useLanguage();

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormField label={t('spots.form.title')} className="col-span-2">
                    <input type="text" required value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder={t('spots.form.title_ph')} className={inputCls} />
                    {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
                </FormField>

                <FormField label={t('spots.form.address')} className="col-span-2">
                    <input type="text" required value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Østerbrogade 124, 2100 København Ø" className={inputCls} />
                    {errors.address && <p className="text-xs text-error mt-1">{errors.address}</p>}
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

                <FormField label={t('spots.form.description')} className="col-span-2">
                    <textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder={t('spots.form.desc_ph')} className={inputCls} />
                </FormField>
            </div>

            <button type="submit" disabled={processing} className={submitCls}>
                {processing ? t('spots.form.saving') : t(submitLabelKey)}
            </button>
        </form>
    );
}
