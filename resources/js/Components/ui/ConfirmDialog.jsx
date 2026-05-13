export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/45"
            onClick={onCancel}
        >
            <div
                className="bg-card border border-line p-8 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-ink uppercase mb-2 font-display font-extrabold tracking-wide" style={{ fontSize: '1rem' }}>
                    {title}
                </p>
                <p className="text-sm text-body mb-6 leading-relaxed">
                    {body}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 border border-line-dim text-xs font-semibold uppercase tracking-widest text-faint hover:border-label transition-colors font-display"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-danger text-page text-xs font-semibold uppercase tracking-widest hover:bg-danger-hover transition-colors font-display"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
