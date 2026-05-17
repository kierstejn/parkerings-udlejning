import { useState } from 'react';
import { Search } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useLanguage } from '../contexts/LanguageContext';
import { AddressAutocomplete } from './ui/AddressAutocomplete';

export default function SearchForm() {
    const [address, setAddress] = useState('');
    const [coords, setCoords] = useState(null);
    const { t } = useLanguage();

    function handleSubmit(e) {
        e.preventDefault();
        const params = {};
        if (address) params.address = address;
        if (coords?.lat) params.lat = coords.lat;
        if (coords?.lng) params.lng = coords.lng;
        router.get('/spots', params);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-lg w-full">
            <AddressAutocomplete
                value={address}
                onChange={(text) => { setAddress(text); setCoords(null); }}
                onSelect={(item) => {
                    setAddress(item.label);
                    setCoords({ lat: item.place.lat ?? null, lng: item.place.lon ?? null });
                }}
                placeholder={t('search.placeholder')}
                containerClassName="flex-1 min-w-0"
                className="w-full px-5 py-4 bg-[oklch(0.97_0.006_85)] text-[oklch(0.18_0.03_255)] placeholder:text-[oklch(0.55_0.025_255)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.14_75)] focus:ring-inset"
            />
            <button
                type="submit"
                className="px-6 py-4 bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)] hover:bg-[oklch(0.78_0.13_75)] transition-colors flex items-center gap-2 shrink-0"
                style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
                <Search className="w-4 h-4" strokeWidth={2} />
                {t('search.btn')}
            </button>
        </form>
    );
}
