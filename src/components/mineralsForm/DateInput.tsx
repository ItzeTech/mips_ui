// DateInput.tsx
import React from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';

interface DateInputProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, selected, onChange, error }) => {
  return (
    <motion.div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
        {label}
      </label>
      <div className="relative">
        <div className="absolute z-10 inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <DatePicker
          selected={selected}
          onChange={onChange}
          className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200 text-sm sm:text-base`}
          dateFormat="yyyy-MM-dd"
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default DateInput;