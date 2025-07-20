// SelectInput.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  label: string;
  icon: React.ReactNode;
  iconLabel: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
  placeholder?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  icon,
  iconLabel,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select an option'
}) => {
  return (
    <motion.div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        {icon}
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          {iconLabel}
        </div>

        <select
          value={value}
          onChange={onChange}
          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border ${
            error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200 text-sm sm:text-base'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs sm:text-sm text-red-600 flex items-center"
        >
          <ExclamationTriangleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SelectInput;