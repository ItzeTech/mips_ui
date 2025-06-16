// components/inputs/TextInput.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TextInputProps {
  label: string;
  icon: React.ReactNode;
  iconLabel: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  placeholder?: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  iconLabel,
  value,
  onChange,
  type = 'text',
  step,
  placeholder = '',
  error,
}) => {
  return (
    <motion.div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        {icon}
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {iconLabel}
        </div>
        <input
          type={type}
          step={step}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 border ${
            error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200`}
          placeholder={placeholder}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default TextInput;
