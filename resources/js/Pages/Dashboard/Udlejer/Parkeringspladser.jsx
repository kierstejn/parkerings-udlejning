import { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Car, MapPin, Plus, X } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

const TYPE_LABELS  = { carport: 'Carport', garage: 'Garage', udendoers: 'Udendørs', indendoers: 'Indendørs' };
const SIZE_LABELS  = { kompakt: 'Kompakt', standard: 'Standard', stor: 'Stor' };
const UNIT_LABELS  = { time: 'time', dag: 'dag', md: 'md.' };

export default function Parkeringspladser() {
    const { spots } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h1
                        className="text-[oklch(0.18_0.03_255)] uppercase"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        Parkeringspladser
                    </h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-semibold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Opret ny
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] mb-8">
                        <div className="px-6 py-4 border-b border-[oklch(0.88_0.015_85)] flex items-center justify-between">
                            <p
                                className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.18_0.03_255)]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Ny parkeringsplads
                            </p>
                            <button onClick={() => setShowForm(false)} className="text-[oklch(0.60_0.02_255)] hover:text-[oklch(0.22_0.04_255)] transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            <CreateForm onSuccess={() => setShowForm(false)} />
                        </div>
                    </div>
                )}

                {spots.length === 0 ? (
                    <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] py-20 flex flex-col items-center text-center">
                        <Car className="w-10 h-10 text-[oklch(0.78_0.015_85)] mb-5" strokeWidth={1} />
                        <p
                            className="text-[oklch(0.18_0.03_255)] mb-2 uppercase"
                            style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.04em' }}
                        >
                            Ingen pladser endnu
                        </p>
                        <p className="text-sm text-[oklch(0.55_0.02_255)] max-w-xs leading-relaxed">
                            Opret din første parkeringsplads og begynd at tjene penge.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {spots.map((spot) => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function SpotCard({ spot }) {
    return (
        <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[oklch(0.18_0.03_255)] truncate">{spot.title}</p>
                    <span
                        className="shrink-0 px-1.5 py-0.5 bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)] text-[10px] font-bold uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {SIZE_LABELS[spot.size]}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[oklch(0.55_0.02_255)]">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{spot.address}</span>
                </div>
            </div>
            <div className="shrink-0 text-right">
                <p
                    className="text-[oklch(0.18_0.03_255)] leading-none"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }}
                >
                    {Number(spot.price).toLocaleString('da-DK')} kr
                </p>
                <p className="text-xs text-[oklch(0.55_0.02_255)]">/{UNIT_LABELS[spot.price_unit]}</p>
            </div>
        </div>
    );
}

function CreateForm({ onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        address: '',
        type: 'carport',
        size: 'standard',
        price: '',
        price_unit: 'md',
        description: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/udlejer/parkeringspladser', {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Titel" className="col-span-2">
                    <input
                        type="text"
                        required
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Carport i Østerbro"
                        className={inputCls}
                    />
                    {errors.title && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.title}</p>}
                </FormField>

                <FormField label="Adresse" className="col-span-2">
                    <input
                        type="text"
                        required
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Østerbrogade 124, 2100 København Ø"
                        className={inputCls}
                    />
                    {errors.address && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.address}</p>}
                </FormField>

                <FormField label="Type">
                    <select value={data.type} onChange={(e) => setData('type', e.target.value)} className={inputCls}>
                        <option value="carport">Carport</option>
                        <option value="garage">Garage</option>
                        <option value="udendoers">Udendørs</option>
                        <option value="indendoers">Indendørs</option>
                    </select>
                </FormField>

                <FormField label="Størrelse">
                    <select value={data.size} onChange={(e) => setData('size', e.target.value)} className={inputCls}>
                        <option value="kompakt">Kompakt</option>
                        <option value="standard">Standard</option>
                        <option value="stor">Stor</option>
                    </select>
                </FormField>

                <FormField label="Pris">
                    <input
                        type="number"
                        required
                        min={0}
                        step={0.5}
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="850"
                        className={inputCls}
                    />
                    {errors.price && <p className="text-xs text-[oklch(0.50_0.18_25)] mt-1">{errors.price}</p>}
                </FormField>

                <FormField label="Prisenhed">
                    <select value={data.price_unit} onChange={(e) => setData('price_unit', e.target.value)} className={inputCls}>
                        <option value="time">Per time</option>
                        <option value="dag">Per dag</option>
                        <option value="md">Per måned</option>
                    </select>
                </FormField>

                <FormField label="Beskrivelse (valgfri)" className="col-span-2">
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Kort beskrivelse af pladsen…"
                        className={inputCls}
                    />
                </FormField>
            </div>

            <button type="submit" disabled={processing} className={submitCls}>
                {processing ? 'Opretter…' : 'Opret parkeringsplads'}
            </button>
        </form>
    );
}

function FormField({ label, children, className = '' }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label
                className="block text-xs font-semibold text-[oklch(0.45_0.025_255)] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls =
    'w-full px-4 py-3 bg-[oklch(0.985_0.005_85)] border border-[oklch(0.85_0.015_85)] text-[oklch(0.18_0.03_255)] text-sm placeholder:text-[oklch(0.68_0.012_255)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.22_0.04_255)] focus:border-transparent transition-shadow resize-none';

const submitCls =
    'w-full py-3.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] font-bold hover:bg-[oklch(0.30_0.04_255)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs tracking-widest uppercase';
