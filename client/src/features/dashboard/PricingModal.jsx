import React, { useEffect } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12 relative">
                    {/* Background decorative glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-900/20 to-transparent rounded-bl-full transform translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none z-0"></div>

                    <div className="relative z-10 w-full">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
                                Simple, transparent pricing
                            </h2>
                            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                                Choose the plan that best fits your team's needs. Downgrade or upgrade at any time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-full">
                            {/* Free Tier */}
                            <div className="bg-stone-800 p-0.5 rounded-[1.25rem] h-full flex flex-col relative overflow-hidden group">
                                <div className="absolute inset-0 bg-stone-800" />
                                <div className="p-8 flex flex-col h-full bg-[#1c1917] rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-white">Free</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">A simpler way to collaborate</p>
                                    <div className="text-5xl font-black mb-1 text-white">$0</div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">Free forever</p>
                                    <button onClick={onClose} className="w-full py-3 px-6 rounded-xl font-bold text-center border border-stone-600 text-white hover:bg-stone-800 transition-colors uppercase tracking-wide text-sm mb-8">
                                        CURRENT PLAN
                                    </button>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Up to 3 projects', 'Basic task management', 'Community support', '1GB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-stone-300">
                                                <CheckCircle className="w-4 h-4 text-stone-500 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800/80">
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
                                <div className="p-8 flex flex-col h-full bg-[#1c1917] rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl z-20">Most Popular</div>
                                    <h3 className="text-xl font-bold font-display mb-1 text-primary-500">Pro</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Drive productivity in one place</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-5xl font-black text-white">$12</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">per user/month, billed yearly</p>
                                    <button onClick={onClose} className="w-full py-3 px-6 rounded-xl font-bold text-center bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        UPGRADE TO PRO
                                    </button>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Unlimited projects', 'Advanced reporting', 'Priority 24/7 support', '100GB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-primary-500 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800/80">
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
                                <div className="p-8 flex flex-col h-full bg-[#1c1917] rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-purple-400">Business+</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Scale with AI-powered work</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-5xl font-black text-white">$24</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">per user/month, billed yearly</p>
                                    <button onClick={onClose} className="w-full py-3 px-6 rounded-xl font-bold text-center bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        UPGRADE TO BUSINESS
                                    </button>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Everything in Pro', 'Custom workflows', 'Advanced SAML & SSO', '2TB Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-purple-400 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800/80">
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
                                <div className="p-8 flex flex-col h-full bg-[#1c1917] rounded-[1.25rem] relative z-10 transition-transform hover:-translate-y-1 duration-300">
                                    <h3 className="text-xl font-bold font-display mb-1 text-blue-400">Enterprise+</h3>
                                    <p className="text-sm text-stone-400 mb-6 h-10">Maximize performance securely</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <div className="text-4xl font-black text-white mt-2 pb-1">Contact Sales</div>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-8 font-medium">Custom pricing for large teams</p>
                                    <button onClick={onClose} className="w-full py-3 px-6 rounded-xl font-bold text-center border border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all uppercase tracking-wide text-sm mb-8">
                                        Contact Sales
                                    </button>
                                    <ul className="space-y-4 mb-8 text-sm">
                                        {['Everything in Business+', 'Dedicated Success Manager', 'HIPAA Compliance', 'Unlimited Storage'].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-white">
                                                <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6 border-t border-stone-800/80">
                                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Enterprise-Grade AI</span>
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
                </div>
            </div>
        </div>
    );
};

export default PricingModal;
