import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [focused, setFocused] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(forgotPassword(email));
        if (forgotPassword.fulfilled.match(result)) {
            setSubmitted(true);
            setResendCooldown(60);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        const result = await dispatch(forgotPassword(email));
        if (forgotPassword.fulfilled.match(result)) {
            setResendCooldown(60);
        }
    };

    return (
        <div className="w-full space-y-7">
            {/* Back link */}
            <div
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
            >
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to sign in
                </Link>
            </div>

            {!submitted ? (
                <>
                    {/* Header */}
                    <div
                        className="space-y-1.5"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(-14px)',
                            transition: 'opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s',
                        }}
                    >
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-red-600 shadow-lg shadow-primary-500/30 mb-4">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
                            Reset Password
                        </h1>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                            Enter your email and we'll send you a secure link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
                            transition: 'opacity 0.55s ease 0.12s, transform 0.55s ease 0.12s',
                        }}
                    >
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-primary-500' : 'text-stone-400'}`}
                                />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    required
                                    className={`
                                        w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all text-sm font-medium
                                        bg-white/50 dark:bg-black/20 text-stone-900 dark:text-white placeholder-stone-500
                                        ${focused
                                            ? 'border-primary-500/50 dark:border-primary-400/50 ring-4 ring-primary-500/10'
                                            : 'border-white/50 dark:border-white/10 hover:border-primary-300 dark:hover:border-stone-500'}
                                    `}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-6 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none items-center shadow-xl shadow-stone-900/10 dark:shadow-white/10 mt-6"
                        >

                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending link...
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                </>
            ) : (
                /* Success State */
                <div
                    className="space-y-6 text-center py-4"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'scale(1)' : 'scale(0.92)',
                        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    {/* Animated checkmark */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500 animate-[check-pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Check your email</h2>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-xs mx-auto">
                            We've sent a password reset link to{' '}
                            <span className="font-semibold text-stone-700 dark:text-stone-200">{email}</span>.
                            It expires in 15 minutes.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 text-left space-y-2 text-sm text-stone-500 dark:text-stone-400">
                        <p className="font-medium text-stone-700 dark:text-stone-300">Didn't receive it?</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Check your spam or junk folder</li>
                            <li>Make sure the email address is correct</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || loading}
                        className="
                            flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
                            border-2 border-stone-200 dark:border-stone-700 text-sm font-medium
                            text-stone-600 dark:text-stone-300
                            hover:border-primary-300 dark:hover:border-stone-500
                            hover:text-primary-600 dark:hover:text-primary-400
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200
                        "
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                        ) : (
                            <RefreshCcw className={`w-4 h-4 ${resendCooldown > 0 ? '' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        )}
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
                    </button>
                </div>
            )}

            {/* Footer */}
            <p
                className="text-center text-sm text-stone-500 dark:text-stone-400"
                style={{
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 0.5s ease 0.3s',
                }}
            >
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-400 transition-colors hover:underline underline-offset-2">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
