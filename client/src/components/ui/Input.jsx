import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500 focus:border-primary-500'
                        }
            focus:ring-2 focus:outline-none transition-all duration-200
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
