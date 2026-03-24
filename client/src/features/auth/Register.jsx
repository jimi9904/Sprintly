import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Hexagon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // This dispatches register which explicitly stores user data in browser localStorage
        const resultAction = await dispatch(register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        }));

        if (register.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="w-full space-y-8 py-2">
            {/* Brand / Logo */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 text-white">
                    <Hexagon className="w-8 h-8 fill-white/20" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 font-medium">
                        Join Sprintly and start collaborating.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest pl-1">
                        Full Name
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Alex Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 font-medium transition-all"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest pl-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            placeholder="hello@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest pl-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-10 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 font-medium transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest pl-1 line-clamp-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 font-medium transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center shadow-xl shadow-stone-900/10 dark:shadow-white/10 mt-6"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "Create Free Account"
                    )}
                </button>
            </form>

            <div className="text-center pt-2">
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
