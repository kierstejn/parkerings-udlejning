import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Loader } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export function AddressAutocomplete({
    value = '',
    onChange,
    onSelect,
    placeholder = '',
    className = '',
    containerClassName = '',
    required = false,
    inputRef: externalRef,
}) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading]         = useState(false);
    const [open, setOpen]               = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [dropdownRect, setDropdownRect] = useState(null);

    const containerRef = useRef(null);
    const internalRef  = useRef(null);
    const inputEl      = externalRef ?? internalRef;
    const timerRef     = useRef(null);

    const fetchSuggestions = useCallback(async (text) => {
        if (!API_KEY || text.length < 3) {
            setSuggestions([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        try {
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:dk&bias=countrycode:dk&limit=5&apiKey=${API_KEY}`;
            const res  = await fetch(url);
            const data = await res.json();
            const results = (data.features ?? []).map((f) => ({
                label: f.properties.formatted,
                place: f.properties,
            }));
            setSuggestions(results);
            setOpen(results.length > 0);
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recompute dropdown anchor whenever it opens or the window resizes/scrolls
    useEffect(() => {
        if (!open) return;

        function updateRect() {
            if (!containerRef.current) return;
            const r = containerRef.current.getBoundingClientRect();
            setDropdownRect({ top: r.bottom, left: r.left, width: r.width });
        }

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);
        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [open]);

    function handleChange(e) {
        const text = e.target.value;
        if (onChange) onChange(text);
        setActiveIndex(-1);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fetchSuggestions(text), 300);
    }

    function handleSelect(item) {
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
        if (onSelect) onSelect(item);
    }

    function handleKeyDown(e) {
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    }

    useEffect(() => {
        function onClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const dropdown = open && suggestions.length > 0 && dropdownRect
        ? createPortal(
            <ul
                style={{
                    position: 'fixed',
                    top:   dropdownRect.top + 2,
                    left:  dropdownRect.left,
                    width: dropdownRect.width,
                    zIndex: 9999,
                }}
                className="bg-card border border-line shadow-xl max-h-64 overflow-y-auto"
            >
                {suggestions.map((item, i) => (
                    <li key={i}>
                        <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
                            className={[
                                'w-full text-left px-4 py-3 text-sm flex items-start gap-2.5 transition-colors',
                                i === activeIndex
                                    ? 'bg-primary text-page'
                                    : 'text-ink hover:bg-hover',
                            ].join(' ')}
                        >
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50" />
                            <span className="leading-snug">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>,
            document.body,
        )
        : null;

    return (
        <div ref={containerRef} className={`relative ${containerClassName}`}>
            <input
                ref={inputEl}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                required={required}
                className={className}
                autoComplete="off"
            />
            {loading && (
                <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost animate-spin pointer-events-none" />
            )}
            {dropdown}
        </div>
    );
}
