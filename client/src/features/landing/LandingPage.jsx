import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, BarChart2, Shield, Zap, Sparkles, Layout, Users, Settings, Bell, Search, Menu, X, MessageSquare, Cloud, Share2, Lock, Smartphone, Globe, CreditCard, LifeBuoy, Key, Sun, Moon, UserPlus, FolderPlus, Rocket, HelpCircle, ChevronDown, Database, AppWindow, Bot } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice';
import ScrollReveal from './ScrollReveal';
import Antigravity from './Antigravity';
import ExpandableCardDemo from './expandable-card-demo-standard';

const LandingPage = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const scrollToSection = (id) => {
        const target = document.getElementById(id);
        if (target) {
            const y = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const howItWorksSteps = [
        {
            title: 'Create Your Account',
            description: 'Sign up in seconds and get instant access to your new workspace.',
            icon: <UserPlus className="w-full h-full" />
        },
        {
            title: 'Set Up Your First Project',
            description: 'Create a project, define your goals, and set up your initial tasks.',
            icon: <FolderPlus className="w-full h-full" />
        },
        {
            title: 'Invite Your Team',
            description: 'Bring your team members on board to start collaborating immediately.',
            icon: <Users className="w-full h-full" />
        },
        {
            title: 'Start Sprinting',
            description: 'Track progress, manage deadlines, and deliver results faster.',
            icon: <Rocket className="w-full h-full" />
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300 relative">
            {/* Antigravity Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Antigravity
                    color={theme === 'dark' ? '#ff4d00' : '#fb923c'}
                    autoAnimate={true}
                    count={350}
                    particleShape="sphere"
                />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col">
                {/* Navbar */}
                <nav className="fixed w-full z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20 relative">
                            {/* Logo and Links Container */}
                            <div className="flex items-center gap-10">
                                <span className="text-3xl font-black font-display text-primary-600 dark:text-primary-500 tracking-tight">
                                    Sprintly
                                </span>

                                <div className="hidden lg:flex items-center gap-6 text-[15px] font-bold text-stone-800 dark:text-stone-200">
                                    <button onClick={() => scrollToSection('how-it-works')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">How It Works</button>
                                    <button onClick={() => scrollToSection('features')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">Features</button>
                                    <button onClick={() => scrollToSection('pricing')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">Pricing</button>
                                    <button onClick={() => scrollToSection('faqs')} className="flex items-center gap-1 hover:text-primary-600 transition-colors">FAQs</button>
                                </div>
                            </div>

                            {/* Right side actions */}
                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-2 hidden md:block rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => dispatch(toggleTheme())}
                                        className="p-2 hidden md:block rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                        aria-label="Toggle Theme"
                                    >
                                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </button>
                                </div>
                                {isAuthenticated ? (
                                    <Link
                                        to="/dashboard"
                                        className="px-6 py-2.5 text-[13px] font-bold text-white bg-primary-600 rounded hover:bg-primary-700 transition-all uppercase tracking-wide"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <div className="hidden sm:flex items-center gap-5">
                                            <Link to="/login" className="text-[15px] font-bold text-stone-800 dark:text-stone-200 hover:text-primary-600 transition-colors">
                                                Sign in
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3 ml-2">
                                            <Link
                                                to="/register"
                                                className="px-5 py-2.5 text-[13px] font-bold text-white bg-primary-600 rounded hover:bg-primary-700 transition-all uppercase tracking-wide"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-yellow-100/50 to-transparent rounded-bl-full transform translate-x-1/3 -translate-y-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-primary-100/50 to-transparent rounded-tr-full transform -translate-x-1/3 translate-y-1/4"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-8">
                            Sprintly manages projects  <br />
                            <span className="bg-gradient-to-r from-yellow-500 via-primary-500 to-red-500 bg-clip-text text-transparent">
                                with blazing speed
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed">
                            Streamline your workflow, collaborate seamlessly, and deliver results faster than ever before with Sprintly's intuitive project management tools.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to={isAuthenticated ? "/dashboard" : "/register"}
                                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary-500 to-red-500 hover:from-primary-600 hover:to-red-600 text-white rounded-full font-black text-xl hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300 flex items-center justify-center overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isAuthenticated ? "Go to Dashboard" : "Start for free"}
                                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 bg-stone-100/50 dark:bg-stone-950/30 relative transition-colors duration-300 border-y border-stone-200/50 dark:border-stone-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <ScrollReveal
                                baseOpacity={0}
                                baseRotation={2}
                                blurStrength={8}
                                containerClassName="mb-4"
                                textClassName="text-3xl md:text-4xl font-bold font-display text-stone-900 dark:text-white justify-center"
                            >
                                How Sprintly Works
                            </ScrollReveal>
                            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
                                Get up and running in just a few simple steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {howItWorksSteps.map((step, index) => (
                                <div key={index} className="relative group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300">
                                    <div className="absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br from-primary-400/20 to-red-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary-200 dark:border-primary-800/50">
                                            {step.icon}
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-sm font-black text-stone-300 dark:text-stone-700 font-display tracking-widest uppercase">Step 0{index + 1}</span>
                                        </div>
                                        <h3 className="text-xl font-bold font-display text-stone-900 dark:text-white mb-3 leading-tight">{step.title}</h3>
                                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm flex-grow">{step.description}</p>
                                    </div>
                                    {/* Connecting Line (for large screens) */}
                                    {index < howItWorksSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-[45px] -right-[15px] w-[30px] h-[2px] bg-gradient-to-r from-primary-500/50 to-transparent z-0"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Preview Section */}
                <section id="features" className="py-24 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md relative transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <ScrollReveal
                                baseOpacity={0}
                                baseRotation={2}
                                blurStrength={8}
                                containerClassName="mb-4"
                                textClassName="text-3xl md:text-4xl font-bold font-display text-stone-900 dark:text-white justify-center"
                            >
                                Everything you need to succeed
                            </ScrollReveal>
                            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
                                Powerful features accessible instantly after you sign up.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-primary-200 dark:hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 transform-gpu hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Layout className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Interactive Dashboards</h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Get a bird's eye view of all your projects with customizable widgets and real-time data visualization.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 (Solutions) */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div id="solutions" className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-yellow-200 dark:hover:border-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 transform-gpu hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Team Collaboration</h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Invite team members, assign tasks, and communicate in real-time. Role-based access control included.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 (Resources) */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div id="resources" className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 transform-gpu hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Automated Workflows</h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Save time with automated task handling. Move tasks between stages effortlessly with drag-and-drop.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 (Marketplace-style) */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col transform-gpu hover:-translate-y-2">
                                    <div className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase mb-4">Sprintly Marketplace</div>
                                    <div className="relative h-32 w-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 rounded-xl flex items-center justify-center mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute top-2 left-4 w-8 h-8 bg-white dark:bg-stone-700 rounded-lg shadow-sm flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite_0.1s]">
                                            <Cloud className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="absolute bottom-3 left-10 w-6 h-6 bg-white dark:bg-stone-700 rounded-md shadow-sm flex items-center justify-center animate-[bounce_4s_ease-in-out_infinite_0.5s]">
                                            <MessageSquare className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <div className="absolute top-4 right-10 w-7 h-7 bg-white dark:bg-stone-700 rounded-md shadow-sm flex items-center justify-center animate-[bounce_3.5s_ease-in-out_infinite_1s]">
                                            <Database className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div className="absolute bottom-4 right-6 w-8 h-8 bg-stone-900 dark:bg-stone-100 rounded-lg shadow-sm flex items-center justify-center animate-[bounce_2.5s_ease-in-out_infinite_0.2s]">
                                            <span className="text-white dark:text-stone-900 font-bold block leading-none">+</span>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow-lg flex items-center justify-center z-10">
                                            <AppWindow className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Connect Your Tools</h3>
                                    <p className="text-stone-500 dark:text-stone-400 mb-6 flex-grow">
                                        Find new apps and integrations that fit your team's unique workflow.
                                    </p>
                                    <a href="#integrations" className="text-blue-600 dark:text-blue-400 font-bold flex items-center group-hover:underline text-sm w-fit mt-auto cursor-pointer">
                                        Browse marketplace <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>

                            {/* Feature 5 (AI Intelligence) */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col transform-gpu hover:-translate-y-2">
                                    <div className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase mb-4">Intelligence</div>
                                    <div className="flex flex-col gap-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-stone-900 dark:text-white text-sm">Sprintly AI</h4>
                                                <p className="text-xs text-stone-500 dark:text-stone-400">Save time and work smarter with powerful AI support.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-stone-900 dark:text-white text-sm">Agents</h4>
                                                <p className="text-xs text-stone-500 dark:text-stone-400">Personalized agents to automate your repetitive daily tasks.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white mt-auto">AI-Powered Insights</h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Accelerate your workflow with intelligent assistants built right into your dashboard.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6 (Admin & Security) */}
                            <div className="inter-var w-full h-full relative perspective-1000">
                                <div className="group w-full h-full p-8 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col transform-gpu hover:-translate-y-2">
                                    <div className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase mb-4">Admin & Security</div>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-100 dark:border-stone-700 shadow-sm transition-transform hover:scale-105 duration-200">
                                            <Shield className="w-6 h-6 text-emerald-500 mb-2" />
                                            <div className="font-bold text-sm text-stone-900 dark:text-white">Security</div>
                                        </div>
                                        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-100 dark:border-stone-700 shadow-sm transition-transform hover:scale-105 duration-200">
                                            <Key className="w-6 h-6 text-primary-500 mb-2" />
                                            <div className="font-bold text-sm text-stone-900 dark:text-white">Access</div>
                                        </div>
                                        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-100 dark:border-stone-700 shadow-sm transition-transform hover:scale-105 duration-200">
                                            <Lock className="w-6 h-6 text-blue-500 mb-2" />
                                            <div className="font-bold text-sm text-stone-900 dark:text-white">Privacy</div>
                                        </div>
                                        <div className="bg-stone-900 dark:bg-stone-100 p-4 rounded-xl flex items-center justify-center shadow-sm transition-transform hover:scale-105 duration-200">
                                            <span className="text-white dark:text-stone-900 text-sm font-bold text-center leading-tight">100%<br />Secure</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white mt-auto">Enterprise Grade</h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Protect data, ensure compliance, and safely manage roles globally.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Instant Context Section (Slack Inspired) */}
                <section className="py-24 bg-white dark:bg-stone-950 relative overflow-hidden border-t border-stone-200/50 dark:border-stone-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-sm mb-8 border border-red-200 dark:border-red-800/50">
                            <Sparkles className="w-4 h-4" />
                            Introducing Sprintly AI Context
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-center text-stone-900 dark:text-white mb-6 tracking-tight max-w-4xl">
                            Give everyone <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-primary-500 to-yellow-500">instant context</span>.
                        </h2>
                        {/* Themed Background Elements to utilize side space */}

                        {/* Left Side: Floating Task/Project Element */}
                        <div className="absolute left-[2%] top-[15%] w-[320px] hidden xl:block opacity-40 dark:opacity-60 pointer-events-auto transform -rotate-6 hover:rotate-0 hover:opacity-100 transition-all duration-700 z-20">
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-stone-900 dark:text-white">Website Redesign</div>
                                        <div className="text-xs text-stone-500">In Progress • 85%</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 w-[85%] rounded-full" />
                                    </div>
                                    <div className="flex gap-1 pt-2">
                                        <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 border-2 border-white dark:border-stone-900 z-10" />
                                        <div className="w-6 h-6 rounded-full bg-stone-300 dark:bg-stone-600 border-2 border-white dark:border-stone-900 -ml-2 z-20" />
                                        <div className="w-6 h-6 rounded-full bg-stone-400 dark:bg-stone-500 border-2 border-white dark:border-stone-900 -ml-2 z-30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Floating Metric/Updates Element */}
                        <div className="absolute right-[2%] top-[55%] w-[280px] hidden xl:block opacity-40 dark:opacity-60 pointer-events-auto transform rotate-6 hover:rotate-0 hover:opacity-100 transition-all duration-700 z-20">
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Weekly Velocity</div>
                                    <div className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+24%</div>
                                </div>
                                <div className="flex items-end gap-2 h-16 mt-2">
                                    {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                        <div key={i} className="w-full bg-stone-100 dark:bg-stone-800 rounded-t-sm relative group">
                                            <div className="absolute bottom-0 w-full min-w-[8px] bg-indigo-500 dark:bg-indigo-400 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 text-center max-w-2xl mb-20">
                            Get access to every task, decision and conversation, so you can build on past work instead of recreating it.
                        </p>

                        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                            {/* Left Text Content */}
                            <div className="lg:col-span-5 flex flex-col gap-12">

                                <div className="border-l-4 border-red-500 pl-6">
                                    <h3 className="text-2xl font-bold font-display text-red-600 dark:text-red-400 mb-3">
                                        Meet SprintlyBot: Your personal agent for work.
                                    </h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Instantly summarize threads, catch up on missed tasks, and get answers from your project's history.
                                    </p>
                                </div>

                                <div className="border-l-4 border-primary-500 pl-6">
                                    <h3 className="text-2xl font-bold font-display text-primary-600 dark:text-primary-400 mb-3">
                                        One search to rule them all.
                                    </h3>
                                    <p className="text-stone-500 dark:text-stone-400 mb-4">
                                        AI-powered search puts your company's entire memory at your fingertips.
                                    </p>
                                    <a href="#" className="text-primary-600 dark:text-primary-400 font-bold flex items-center hover:underline group">
                                        Learn about AI-powered search <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>

                                <div className="border-l-4 border-yellow-500 pl-6">
                                    <h3 className="text-2xl font-bold font-display text-yellow-600 dark:text-yellow-400 mb-3">
                                        Bring scattered data to the conversation.
                                    </h3>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        Connect your favorite tools and let Sprintly link everything intelligently.
                                    </p>
                                </div>

                            </div>

                            {/* Right UI Mockup */}
                            <div className="lg:col-span-7 relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>

                                <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">

                                    {/* Mockup Header */}
                                    <div className="h-12 border-b border-stone-100 dark:border-stone-800 flex items-center px-4 gap-3 bg-stone-50 dark:bg-stone-950">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="flex-1 max-w-md mx-auto h-7 bg-white dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700 flex items-center px-3 gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Search: "What were the key takeaways from Project Alpha?"</span>
                                        </div>
                                    </div>

                                    {/* Mockup Body */}
                                    <div className="flex-1 p-6 overflow-y-auto">

                                        {/* AI Answer Card */}
                                        <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm font-bold text-purple-900 dark:text-purple-300">Sprintly AI Answer</span>
                                            </div>
                                            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                                                Based on the tasks and conversations from Project Alpha: The primary goal was to redesign the user dashboard. The project was completed 2 weeks ahead of schedule. Key takeaways included adopting the new React-based component library and ensuring all charts are mobile-responsive.
                                            </p>

                                            <div className="flex items-center gap-4 border-t border-stone-200 dark:border-stone-700 pt-3">
                                                <span className="text-xs text-stone-500 font-medium">Sources:</span>
                                                <div className="flex gap-2">
                                                    <span className="text-xs px-2 py-1 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                                        Task: #Alpha-12
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                                        Doc: Retrospective
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Search Results */}
                                        <div className="space-y-4">
                                            <div className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Relevant Tickets</div>

                                            <div className="flex gap-4 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors border border-transparent dark:hover:border-stone-700">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-900 dark:text-white mb-1">Finalize Dashboard Components <span className="text-stone-400 font-normal">#Alpha-12</span></p>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">Approved the new React layout. We should reuse these components moving forward.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors border border-transparent dark:hover:border-stone-700">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-900 dark:text-white mb-1">Team Retrospective <span className="text-stone-400 font-normal">General</span></p>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">Sarah noted that the new charting library was much faster to implement.</p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Proper Pricing Section */}
                <section id="pricing" className="py-24 bg-stone-900/80 backdrop-blur-md text-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-900/20 to-transparent rounded-bl-full transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <ScrollReveal
                                baseOpacity={0}
                                baseRotation={2}
                                blurStrength={8}
                                containerClassName="mb-4"
                                textClassName="text-3xl md:text-5xl font-bold font-display text-white justify-center"
                            >
                                Simple, transparent pricing
                            </ScrollReveal>
                            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                                Choose the plan that best fits your team's needs. Downgrade or upgrade at any time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
                            {/* Free Tier */}
                            <div className="bg-stone-800 p-0.5 rounded-[1.25rem] h-full flex flex-col relative overflow-hidden group">
                                <div className="absolute inset-0 bg-stone-800" />
                                <div className="p-8 flex flex-col h-full bg-stone-900 rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-white">Free</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">A simpler way to collaborate</p>
                                    <div className="text-5xl font-black mb-1">$0</div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">Free forever</p>
                                    <Link to="/register" className="w-full py-3 px-6 rounded-xl font-bold text-center border-2 border-stone-600 text-white hover:bg-stone-800 transition-colors uppercase tracking-wide text-sm mb-8">
                                        Sign Up
                                    </Link>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Up to 3 projects', 'Basic task management', 'Community support', '1GB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-stone-500 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800">
                                        <div className="flex items-center gap-2 mb-4 text-stone-500">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Basic AI</span>
                                        </div>
                                        <ul className="space-y-4 text-sm">
                                            <li className="flex items-start text-stone-500 line-through decoration-stone-700">
                                                <span className="w-4 h-4 mr-3 mt-0.5 inline-block opacity-50">-</span>
                                                AI daily recaps
                                            </li>
                                            <li className="flex items-start text-stone-500 line-through decoration-stone-700">
                                                <span className="w-4 h-4 mr-3 mt-0.5 inline-block opacity-50">-</span>
                                                Automated workflows
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Tier */}
                            <div className="bg-primary-500 p-0.5 rounded-[1.25rem] h-full flex flex-col relative overflow-hidden group shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-red-500" />
                                <div className="p-8 flex flex-col h-full bg-stone-900 rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl z-20">Most Popular</div>
                                    <h3 className="text-xl font-bold font-display mb-1 text-primary-500">Pro</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Drive productivity in one place</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-5xl font-black text-white">$12</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">per user/month, billed yearly</p>
                                    <Link to="/register" className="w-full py-3 px-6 rounded-xl font-bold text-center bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        Sign Up
                                    </Link>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Unlimited projects', 'Advanced reporting', 'Priority 24/7 support', '100GB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800">
                                        <div className="flex items-center gap-2 mb-4 text-primary-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Sprintly AI</span>
                                        </div>
                                        <ul className="space-y-4 text-sm">
                                            <li className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 mt-0.5 shrink-0" />
                                                AI daily recaps
                                            </li>
                                            <li className="flex items-start text-stone-500 line-through decoration-stone-700">
                                                <span className="w-4 h-4 mr-3 mt-0.5 inline-block opacity-50">-</span>
                                                Custom AI Agents
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Business+ Tier */}
                            <div className="bg-purple-900/40 border border-purple-500/20 p-0 rounded-[1.25rem] h-full flex flex-col relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
                                <div className="p-8 flex flex-col h-full bg-stone-900 rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-purple-400">Business+</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Scale with AI-powered work</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-5xl font-black text-white">$24</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">per user/month, billed yearly</p>
                                    <Link to="/register" className="w-full py-3 px-6 rounded-xl font-bold text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        Sign Up
                                    </Link>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Everything in Pro', 'Custom workflows', 'Advanced SAML & SSO', '2TB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-purple-400 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800">
                                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Advanced AI</span>
                                        </div>
                                        <ul className="space-y-4 text-sm">
                                            <li className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-purple-400 mr-3 mt-0.5 shrink-0" />
                                                AI daily recaps
                                            </li>
                                            <li className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-purple-400 mr-3 mt-0.5 shrink-0" />
                                                Custom AI Agents
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Enterprise+ Tier */}
                            <div className="bg-blue-900/40 border border-blue-500/20 p-0 rounded-[1.25rem] h-full flex flex-col relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
                                <div className="p-8 flex flex-col h-full bg-stone-900 rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-blue-400">Enterprise+</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Maximize performance securely</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-4xl font-black text-white mt-2 pb-1">Contact Sales</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">Custom pricing for large teams</p>
                                    <Link to="/register" className="w-full py-3 px-6 rounded-xl font-bold text-center border border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        Contact Sales
                                    </Link>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Everything in Business+', 'Dedicated Success Manager', 'HIPAA Compliance', 'Unlimited Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800">
                                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Enterprise-grade AI</span>
                                        </div>
                                        <ul className="space-y-4 text-sm">
                                            <li className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 shrink-0" />
                                                Everything in Advanced AI
                                            </li>
                                            <li className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 shrink-0" />
                                                Native data loss prevention
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQs Section */}
                <section id="faqs" className="py-32 bg-stone-50/70 dark:bg-stone-950/70 backdrop-blur-md relative transition-colors duration-300 overflow-hidden">
                    {/* Decorative SVGs to fill empty side space */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] pointer-events-none opacity-20 dark:opacity-10">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform duration-[10000ms] ease-in-out hover:rotate-180 text-primary-500 fill-current">
                            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.3,81.4,26.6,73.6,38.8C65.8,51,55.8,62.1,43.2,70.9C30.6,79.8,15.3,86.4,-0.4,87.1C-16.1,87.8,-32.2,82.6,-46.3,74.1C-60.4,65.6,-72.5,53.8,-80.6,39.6C-88.7,25.4,-92.8,8.8,-90.6,-7.1C-88.4,-23.1,-79.9,-38.3,-68.6,-49.6C-57.3,-60.9,-43.2,-68.3,-29.4,-74.6C-15.6,-80.9,-2,-86.1,12,-86.3C26,-86.5,40.1,-81.7,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="absolute right-0 top-1/4 translate-x-1/4 w-[400px] h-[400px] pointer-events-none opacity-20 dark:opacity-10">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform duration-[15000ms] ease-linear hover:-rotate-180 text-purple-500 fill-current">
                            <path d="M39.6,-66.3C52.1,-62.4,63.6,-53.4,70.8,-41.8C78,-30.2,80.9,-15.1,79.8,-0.6C78.6,13.9,73.4,27.8,65.2,39.5C57,51.2,45.8,60.6,33.1,65.9C20.4,71.2,6.2,72.4,-7.8,70.9C-21.8,69.4,-35.6,65.2,-47.9,57.7C-60.2,50.2,-71,39.4,-77.3,26C-83.6,12.6,-85.4,-3.4,-81.3,-18C-77.2,-32.6,-67.2,-45.8,-54.6,-53.9C-42,-62,-26.8,-65,-12.3,-69.1C2.2,-73.2,16.7,-78.4,28.8,-75.4C40.9,-72.4,50.6,-61.2,39.6,-66.3Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="absolute bottom-0 right-[10%] w-[30vw] h-[30vw] rounded-[100%] bg-gradient-to-tl from-primary-500/10 to-transparent dark:from-primary-500/5 blur-[80px] md:blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

                    <div className="max-w-[7xl] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <ScrollReveal
                                baseOpacity={0}
                                baseRotation={2}
                                blurStrength={8}
                                containerClassName="mb-4"
                                textClassName="text-3xl md:text-4xl font-bold font-display text-stone-900 dark:text-white justify-center"
                            >
                                Frequently Asked Questions
                            </ScrollReveal>
                            <p className="text-lg text-stone-600 dark:text-stone-400">
                                Everything you need to know about Sprintly and billing.
                            </p>
                        </div>
                        <div className="mt-8">
                            <ExpandableCardDemo />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-md border-t border-stone-200/50 dark:border-stone-800/50 py-12 transition-colors duration-300 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-2xl font-bold font-display text-stone-900 dark:text-white">Sprintly</div>
                        <div className="text-stone-500 dark:text-stone-400 text-sm">
                            © {new Date().getFullYear()} Sprintly Inc. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-stone-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Privacy</a>
                            <a href="#" className="text-stone-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Terms</a>
                            <a href="#" className="text-stone-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Twitter</a>
                        </div>
                    </div>
                </footer>
            </div >
        </div >
    );
};

export default LandingPage;
