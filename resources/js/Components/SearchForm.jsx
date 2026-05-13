import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AddressAutocomplete } from './ui/AddressAutocomplete';

export default function SearchForm() {
    const [address, setAddress] = useState('');
    const { t } = useLanguage();

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: navigate to search results with address
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-lg w-full">
            <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={(item) => setAddress(item.label)}
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
