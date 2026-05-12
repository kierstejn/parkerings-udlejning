import { useForm } from '@inertiajs/react';
import { ShieldCheck, Clock, Banknote, Lock } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

export default function UdlejerIndex() {
    const { post, processing, errors } = useForm({});

    function handleVerify(e) {
        e.preventDefault();
        post('/udlejer/verify');
    }

    return (
        <DashboardLayout>
            <div className="max-w-lg">
                <p
                    className="text-[oklch(0.72_0.14_75)] mb-3"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                >
                    For udlejere
                </p>
                <h1
                    className="text-[oklch(0.18_0.03_255)] mb-3 uppercase"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    Bliv udlejer
                </h1>
                <p className="text-sm text-[oklch(0.50_0.025_255)] leading-relaxed mb-10">
                    Som udlejer på ParkDel kan du tjene penge på din parkeringsplads. Vi kræver en engangsverifikation via MitID for at bekræfte din identitet og sikre alle brugere.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: ShieldCheck, label: 'Sikker identitet', desc: 'Verificeret via MitID' },
                        { icon: Clock,       label: 'Sæt dine tider',   desc: 'Fuld fleksibilitet' },
                        { icon: Banknote,    label: 'Tjen penge',        desc: 'Udbetaling hver måned' },
                    ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] px-4 py-5">
                            <Icon className="w-5 h-5 text-[oklch(0.72_0.14_75)] mb-3" strokeWidth={1.5} />
                            <p
                                className="text-[oklch(0.18_0.03_255)] text-xs font-semibold uppercase tracking-wide mb-1"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {label}
                            </p>
                            <p className="text-[oklch(0.58_0.02_255)] text-xs">{desc}</p>
                        </div>
                    ))}
                </div>

                <div className="border border-[oklch(0.88_0.015_85)] bg-[oklch(0.992_0.004_85)] p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-[oklch(0.22_0.04_255)] flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4 text-[oklch(0.72_0.14_75)]" strokeWidth={2} />
                        </div>
                        <div>
                            <p
                                className="text-[oklch(0.18_0.03_255)] text-sm font-semibold uppercase tracking-wide"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                MitID-verificering krævet
                            </p>
                            <p className="text-xs text-[oklch(0.58_0.02_255)]">
                                Engangsproces · tager under 2 minutter
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-[oklch(0.55_0.02_255)] leading-relaxed mb-5">
                        Du vil blive viderestillet til MitID for at bekræfte din identitet. Når du vender tilbage, er din konto aktiveret som udlejer.
                    </p>

                    {errors.message && (
                        <p role="alert" className="text-xs text-[oklch(0.50_0.18_25)] mb-4">
                            {errors.message}
                        </p>
                    )}

                    <form onSubmit={handleVerify}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-[oklch(0.22_0.04_255)] text-[oklch(0.965_0.008_85)] text-xs font-bold tracking-widest uppercase hover:bg-[oklch(0.30_0.04_255)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {processing ? 'Verificerer…' : 'Verificér med MitID'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
