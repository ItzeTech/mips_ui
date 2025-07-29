// components/common/Badge.tsx
import React from 'react';

type BadgeColor = 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray';

type BadgeProps = {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
};

const getColorClasses = (color: BadgeColor): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'red':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'indigo':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'pink':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
    case 'gray':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm':
      return 'text-xs px-2 py-0.5';
    case 'md':
      return 'text-sm px-2.5 py-0.5';
    case 'lg':
      return 'text-base px-3 py-1';
    default:
      return 'text-sm px-2.5 py-0.5';
  }
};

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'blue',
  size = 'md'
}) => {
  const colorClasses = getColorClasses(color);
  const sizeClasses = getSizeClasses(size);
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colorClasses} ${sizeClasses}`}>
      {children}
    </span>
  );
};

export default Badge;