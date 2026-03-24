import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSidebar, togglePricingModal } from '../redux/slices/uiSlice';
import { reset, logout } from '../redux/slices/authSlice';
import {
    LayoutDashboard, CheckSquare, Users, Settings, LogOut,
    Search, Sun, Moon, Bell, Zap, Star
} from 'lucide-react';
import ChatWidget from '../components/chat/ChatWidget';
import TaskDetailDrawer from '../features/dashboard/TaskDetailDrawer';
import PricingModal from '../features/dashboard/PricingModal';
import useSocket from '../hooks/useSocket';
import AOS from 'aos';

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);
    const { theme, sidebarOpen, isPricingModalOpen } = useSelector((state) => state.ui);
    const { projects } = useSelector((state) => state.projects);
    const notifications = useSelector((state) => state.notifications?.notifications || []);
    const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);

    const location = useLocation();

    // Re-trigger AOS animations on every page navigation
    useEffect(() => {
        AOS.refresh();
    }, [location.pathname]);

    // Establish socket connection
    useSocket(token || localStorage.getItem('token'));

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
        } catch (error) {
            console.error('Logout failed', error);
        }
        localStorage.removeItem('token');
        dispatch(reset());
        navigate('/');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/dashboard/my-tasks', label: 'My Tasks', icon: CheckSquare },
        { to: '/dashboard/team', label: 'Team', icon: Users },
        { to: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-stone-100 dark:bg-[#0a0a0a] overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className={`${sidebarOpen ? 'w-[270px]' : 'w-0 -ml-[270px]'} transition-all duration-300 flex flex-col bg-gradient-to-r from-primary-500 to-primary-700 shrink-0 overflow-hidden relative shadow-2xl shadow-primary-900/40`}>

                {/* Subtle noise overlay for depth */}
                <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] pointer-events-none z-0" />

                {/* ── Logo Area ── */}
                <div data-aos="fade-down" data-aos-delay="0" className="px-5 pt-7 pb-6 flex items-center gap-3 relative z-10 w-full">
                    <div className="w-11 h-11 rounded-2xl bg-white/25 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg shrink-0">
                        <Zap className="w-5 h-5 fill-white" strokeWidth={0} />
                    </div>
                    <div>
                        <span className="text-[26px] font-black text-white tracking-tight leading-none block drop-shadow">Sprintly</span>
                        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em]">Workspace</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-5 h-px bg-white/10 relative z-10" />

                {/* ── Nav ── */}
                <nav className="flex-1 px-4 pt-5 pb-2 overflow-y-auto custom-scrollbar relative z-10 space-y-0.5">
                    {/* Section Label */}
                    <p className="px-3 mb-3 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Menu</p>

                    {navLinks.map((link, idx) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            data-aos="fade-right"
                            data-aos-delay={idx * 55}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-white text-primary-600 shadow-md shadow-black/10'
                                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
                                        ${isActive
                                            ? 'bg-primary-500/15 text-primary-600'
                                            : 'bg-white/10 text-white/80 group-hover:bg-white/20 group-hover:text-white'
                                        }`}>
                                        <link.icon className="w-[17px] h-[17px]" strokeWidth={isActive ? 2.25 : 1.75} />
                                    </div>
                                    <span className="truncate">{link.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Projects Section */}
                    {projects && projects.length > 0 && (
                        <div className="mt-6">
                            <p className="px-3 mb-3 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Projects</p>
                            {projects.map((project, idx) => {
                                const colors = ['bg-amber-300', 'bg-pink-400', 'bg-sky-300', 'bg-emerald-300', 'bg-violet-300'];
                                const colorClass = colors[idx % colors.length];
                                return (
                                    <NavLink
                                        key={project._id}
                                        to={`/dashboard/projects/${project._id}`}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200
                                            ${isActive
                                                ? 'bg-white/15 text-white'
                                                : 'text-white/65 hover:bg-white/10 hover:text-white'
                                            }`
                                        }
                                    >
                                        <div className={`w-2 h-2 rounded-full ${colorClass} shrink-0 shadow-sm`} />
                                        <span className="truncate">{project.name}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    )}
                </nav>

                {/* Divider */}
                <div className="mx-5 h-px bg-white/10 relative z-10" />

                {/* ── Bottom Section ── */}
                <div className="px-4 py-5 space-y-2 shrink-0 relative z-10 w-full">

                    {/* Pro Plan */}
                    <button
                        onClick={() => dispatch(togglePricingModal(true))}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Star className="w-4 h-4 text-primary-500" strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider leading-none mb-0.5">Pro Plan</p>
                            <p className="text-[13px] font-bold text-white leading-tight">Upgrade Now</p>
                        </div>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.8)] animate-pulse" />
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-white/60 hover:bg-red-500/20 hover:text-white/90 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-red-500/20 flex items-center justify-center shrink-0 transition-colors">
                            <LogOut className="w-4 h-4" strokeWidth={1.75} />
                        </div>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* ── Main Area ────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 shrink-0 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800/60 flex items-center justify-between px-6 gap-4">
                    {/* Left — Search */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search projects, tasks, team..."
                                className="w-full pl-9 pr-16 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                autoComplete="off"
                            />
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-semibold text-stone-400 bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                Ctrl K
                            </kbd>
                        </div>
                    </div>

                    {/* Right — Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <button className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-stone-950">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* User Avatar */}
                        {user && (
                            <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-stone-200 dark:border-stone-800">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <React.Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
                        </div>
                    }>
                        <Outlet />
                    </React.Suspense>
                </main>
            </div>

            {/* ── Global Overlays ──────────────────────────────────────────── */}
            <TaskDetailDrawer />
            <PricingModal isOpen={isPricingModalOpen} onClose={() => dispatch(togglePricingModal(false))} />
            <ChatWidget />
        </div>
    );
};

export default DashboardLayout;
