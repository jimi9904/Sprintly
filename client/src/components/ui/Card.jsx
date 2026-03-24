import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`
      bg-white dark:bg-stone-800 
      border border-stone-200 dark:border-stone-700 
      rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300
      ${noPadding ? '' : 'p-6'}
      ${className}
    `}>
            {children}
        </div>
    );
};

export default Card;
