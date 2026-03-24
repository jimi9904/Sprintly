import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VISIBLE_COUNT = 5;

const RecentActivity = () => {
    const { activities } = useSelector((state) => state.activity);
    const [showAll, setShowAll] = useState(false);

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getActivityDetails = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('created')) return { color: 'bg-stone-300 dark:bg-stone-600' };
        if (actionLower.includes('assigned') || actionLower.includes('completed') || actionLower.includes('done')) return { color: 'bg-blue-500' };
        if (actionLower.includes('priority') || actionLower.includes('due date') || actionLower.includes('deadline')) return { color: 'bg-orange-500' };
        if (actionLower.includes('comment')) return { color: 'bg-indigo-500' };
        return { color: 'bg-stone-300 dark:bg-stone-600' };
    };

    const visibleActivities = showAll ? activities : activities.slice(0, VISIBLE_COUNT);
    const hasMore = activities.length > VISIBLE_COUNT;

    return (
        <div className="flex flex-col p-6 relative bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center mb-6 relative z-10 gap-3">
                <Activity className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-stone-900 dark:text-white pb-0.5">
                    Recent Activity
                </h3>
            </div>

            <div className="relative z-10">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-stone-500 text-sm">
                        <Activity className="w-8 h-8 text-stone-300 mb-2" />
                        <p className="font-medium">No activity yet</p>
                    </div>
                ) : (
                    <>
                        <div className="relative pl-3 space-y-6 before:absolute before:inset-y-2 before:left-[17px] before:w-px before:bg-stone-200 dark:before:bg-stone-800">
                            <AnimatePresence initial={false}>
                                {visibleActivities.map((activity, index) => {
                                    const details = getActivityDetails(activity.action);
                                    return (
                                        <motion.div
                                            key={activity.id || index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.25, delay: index * 0.04 }}
                                            className="relative pl-10 group"
                                        >
                                            <div className="absolute left-[2px] top-1.5 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0a0a0a] z-10">
                                                <div className={`w-2 h-2 rounded-full ${details.color}`}></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-[15px] text-stone-800 dark:text-stone-200 leading-snug">
                                                    <span className="font-bold text-black dark:text-white mr-1.5">
                                                        {activity.user === 'You' ? 'You' : activity.user}
                                                    </span>
                                                    <span className="text-stone-700 dark:text-stone-300">
                                                        {activity.action}
                                                    </span>
                                                    {activity.target && (
                                                        <span className="text-orange-500 ml-1.5">
                                                            {activity.target}
                                                        </span>
                                                    )}
                                                </div>
                                                {activity.detail && (
                                                    <div className="text-[13px] text-stone-400 dark:text-stone-500 italic mt-0.5">
                                                        "{activity.detail}"
                                                    </div>
                                                )}
                                                <div className="text-[12px] text-stone-400 dark:text-stone-500 mt-1">
                                                    {formatTime(activity.time)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {hasMore && (
                            <button
                                onClick={() => setShowAll(v => !v)}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-white bg-stone-100 dark:bg-stone-800/60 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
                            >
                                {showAll ? 'Show less' : `View past activity (${activities.length - VISIBLE_COUNT} more)`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
