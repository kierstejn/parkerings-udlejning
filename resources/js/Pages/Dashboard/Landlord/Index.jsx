import { useForm } from '@inertiajs/react';
import { ShieldCheck, Clock, Banknote, Lock } from 'lucide-react';
import DashboardLayout from '../../../Layouts/DashboardLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function LandlordIndex() {
    const { post, processing, errors } = useForm({});
    const { t } = useLanguage();

    function handleVerify(e) {
        e.preventDefault();
        post('/landlord/verify');
    }

    const features = [
        { icon: ShieldCheck, labelKey: 'landlord.feat1_label', descKey: 'landlord.feat1_desc' },
        { icon: Clock,       labelKey: 'landlord.feat2_label', descKey: 'landlord.feat2_desc' },
        { icon: Banknote,    labelKey: 'landlord.feat3_label', descKey: 'landlord.feat3_desc' },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-lg">
                <p
                    className="text-amber mb-3 font-display"
                    style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}
                >
                    {t('landlord.for_landlords')}
                </p>
                <h1
                    className="text-ink mb-3 uppercase font-display"
                    style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    {t('landlord.become')}
                </h1>
                <p className="text-sm text-body leading-relaxed mb-10">
                    {t('landlord.body')}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    {features.map(({ icon: Icon, labelKey, descKey }) => (
                        <div key={labelKey} className="border border-line bg-card px-4 py-5">
                            <Icon className="w-5 h-5 text-amber mb-3" strokeWidth={1.5} />
                            <p className="text-ink text-xs font-semibold uppercase tracking-wide mb-1 font-display">
                                {t(labelKey)}
                            </p>
                            <p className="text-muted text-xs">{t(descKey)}</p>
                        </div>
                    ))}
                </div>

                <div className="border border-line bg-card p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4 text-amber" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-ink text-sm font-semibold uppercase tracking-wide font-display">
                                {t('landlord.mitid_required')}
                            </p>
                            <p className="text-xs text-muted">
                                {t('landlord.one_time')}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs text-muted leading-relaxed mb-5">
                        {t('landlord.redirect_body')}
                    </p>

                    {errors.message && (
                        <p role="alert" className="text-xs text-error mb-4">
                            {errors.message}
                        </p>
                    )}

                    <form onSubmit={handleVerify}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-primary text-page text-xs font-bold tracking-widest uppercase hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-display"
                        >
                            {processing ? t('landlord.verifying') : t('landlord.verify_btn')}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
