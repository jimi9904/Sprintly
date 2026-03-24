import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/uiSlice';
import { Sun, Moon } from 'lucide-react';

const AuthLayout = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { theme } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-[#1a120b] transition-colors duration-300">
            {/* Background Glow Effects (Dark Mode specific) */}
            <div className="absolute inset-0 z-0 hidden dark:block pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#4a2511]/40 rounded-full blur-[120px]"></div>
            </div>

            {/* Light Mode Glow Effects */}
            <div className="absolute inset-0 z-0 dark:hidden pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/40 rounded-full blur-[120px]"></div>
            </div>

            {/* Theme Toggle Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-3 rounded-full bg-white/50 dark:bg-black/20 border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-black/40 transition-all backdrop-blur-md"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Auth Card Container */}
            <div className="relative z-10 w-full max-w-[440px] mx-4 p-8 sm:p-10 bg-white/80 dark:bg-[#231811]/90 backdrop-blur-2xl border border-stone-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl dark:shadow-[#000000]/80">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
