import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Hexagon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        // Load recent users from browser history (localStorage)
        const historyData = localStorage.getItem('sprintly_user');
        if (historyData) {
            try {
                const parsed = JSON.parse(historyData);
                // Pre-fill email if data is available in browser local storage
                if (parsed.email) {
                    setFormData((prev) => ({ ...prev, email: parsed.email }));
                    setRecentUsers([parsed]);
                }
            } catch (err) {
                console.error("Could not load user data from browser history.");
            }
        }
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // This dispatches login which uses dummy auth in localStorage (browser history)
        const resultAction = await dispatch(login(formData));
        if (login.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    const handleSelectRecentUser = (user) => {
        setFormData((prev) => ({ ...prev, email: user.email }));
    };

    return (
        <div className="w-full space-y-8">
            {/* Brand / Logo */}
            <div data-aos="fade-down" data-aos-delay="0" className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 text-white">
                    <Hexagon className="w-8 h-8 fill-white/20" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 font-medium">
                        Access your workspace seamlessly.
                    </p>
                </div>
            </div>

            {/* Browser History / Saved Users */}
            {recentUsers.length > 0 && (
                <div data-aos="fade-up" data-aos-delay="100" className="pt-2 pb-1">
                    <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 text-center">
                        Saved from Browser History
                    </div>
                    {recentUsers.map((u, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectRecentUser(u)}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/40 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-yellow-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                    {u.name ? u.name.charAt(0) : u.email.charAt(0)}
                                </div>
                                <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                                    {u.email}
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary-500 transition-colors" />
                        </button>
                    ))}
                </div>
            )}

            {/* Form */}
            <form data-aos="fade-up" data-aos-delay="150" onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-stone-500 font-medium transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center pl-1 pr-1">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">
                            Password
                        </label>
                        <Link to="/forgot-password" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl outline-none focus:border-primary-500/50 dark:focus:border-primary-400/50 focus:ring-4 focus:ring-primary-500/10 text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-stone-500 font-medium transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
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
                        "Sign In to Account"
                    )}
                </button>
            </form>

            <div data-aos="fade-up" data-aos-delay="250" className="text-center pt-2">
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    New to Sprintly?{' '}
                    <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
