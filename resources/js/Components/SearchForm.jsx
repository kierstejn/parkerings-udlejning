import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchForm() {
    const [query, setQuery] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-md">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Adresse eller by…"
                className="flex-1 px-5 py-4 bg-[oklch(0.97_0.006_85)] text-[oklch(0.18_0.03_255)] placeholder:text-[oklch(0.55_0.025_255)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.14_75)] focus:ring-inset"
            />
            <button
                type="submit"
                className="px-6 py-4 bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.03_255)] hover:bg-[oklch(0.78_0.13_75)] transition-colors flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
                <Search className="w-4 h-4" strokeWidth={2} />
                Søg
            </button>
        </form>
    );
}
