import { useState } from 'react';
import DashboardSidebar from '../Components/DashboardSidebar';
import AppHeader from '../Components/AppHeader';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-page flex flex-col">
            <AppHeader onMenuOpen={() => setSidebarOpen(true)} />

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1">
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 px-4 py-6 md:px-10 md:py-10 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
