export function FormField({ label, children, className = '' }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-xs font-semibold text-faint uppercase tracking-widest font-display">
                {label}
            </label>
            {children}
        </div>
    );
}

export const inputCls = 'w-full px-4 py-3 bg-input border border-line-dim text-ink text-sm placeholder:text-ghost focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none';

export const submitCls = 'w-full py-3.5 bg-primary text-page font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs tracking-widest uppercase font-display';
