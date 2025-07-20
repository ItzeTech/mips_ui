// HeaderCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderCardProps {
  title: string;
  description: string;
  onClose: () => void;
  itemVariants?: any;
  Icon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

const defaultItemVariants = {
  hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    }
};

const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  description,
  onClose,
  itemVariants = defaultItemVariants,
  Icon = <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
  closeIcon = <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
}) => {
  return (
    <motion.div
      className="p-3 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-2 sm:mr-4 flex-shrink-0">
          {Icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {description}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-2"
        aria-label="Close"
      >
        {closeIcon}
      </motion.button>
    </motion.div>
  );
};

export default HeaderCard;