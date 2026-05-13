export function EmptyState({ icon: Icon, label }) {
    return (
        <div className="border border-dashed border-line py-12 flex flex-col items-center text-center">
            <Icon className="w-8 h-8 text-icon mb-3" strokeWidth={1} />
            <p className="text-sm text-muted">{label}</p>
        </div>
    );
}
