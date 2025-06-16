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
  Icon = <PlusIcon className="w-6 h-6 text-white" />,
  closeIcon = <XMarkIcon className="w-5 h-5" />
}) => {
  return (
    <motion.div
      className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
          {Icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close"
      >
        {closeIcon}
      </motion.button>
    </motion.div>
  );
};

export default HeaderCard;
