import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import useAuthStore from '../../store/authStore';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Desktop
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111820] font-sans transition-colors duration-300">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <Sidebar
                role={user?.userType}
                isCollapsed={isDesktopCollapsed}
                toggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0B1C2D]/60 z-50 lg:hidden backdrop-blur-md"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar (Always expanded when open, hidden otherwise) */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-[#0B1C2D] z-[60] lg:hidden transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar role={user?.userType} isMobile={true} />
            </div>

            <div className={`${isDesktopCollapsed ? 'lg:pl-24' : 'lg:pl-72'} min-h-screen flex flex-col transition-[padding] duration-300 ease-in-out`}>
                <DashboardNavbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    isSidebarOpen={isSidebarOpen}
                    isDesktopCollapsed={isDesktopCollapsed}
                />

                <main className="flex-1 p-5 sm:p-8 lg:p-12 mt-20">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
