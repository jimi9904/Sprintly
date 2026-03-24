import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500 relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
                </div>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-500 dark:text-stone-400 font-medium text-sm animate-pulse"
            >
                Loading Sprintly...
            </motion.p>
        </div>
    );
};

export default PageLoader;
