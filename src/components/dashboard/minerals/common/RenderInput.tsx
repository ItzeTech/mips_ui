import React from 'react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from 'react-number-format';

interface RenderInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'number' | 'text' | 'date';
  suffix?: string;
  disabled?: boolean;
  step?: string;
  field?: string;
  errors?: Record<string, string>;
  allowNegative?: boolean;
  allowLeadingZeros?: boolean;
  decimalScale?: number;
  canHaveZero?: boolean;
}

const RenderInput: React.FC<RenderInputProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  suffix = '',
  disabled = false,
  step = 'any',
  field = '',
  errors = {},
  allowNegative = false,
  allowLeadingZeros = true,
  decimalScale = 2,
  canHaveZero = false
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="relative">
    {
        type === 'number' ?

        <NumericFormat
            value={value}
            decimalScale={decimalScale}
            allowNegative={allowNegative}
            allowLeadingZeros={allowLeadingZeros}
            onValueChange={(values) => {
                onChange(values.floatValue || (canHaveZero ? 0 : null))
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
            placeholder={`Enter ${label.toLowerCase()}`}    
        />
        :

        <input
            type={type}
            step={step}
            value={value || ''}
            onChange={(e) =>
                onChange(e.target.value)
            }
            disabled={disabled}
            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
            placeholder={`Enter ${label.toLowerCase()}`}
        />

    }
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
          {suffix}
        </span>
      )}
    </div>
    {errors[field] && (
      <p className="text-red-500 text-xs mt-1 flex items-center">
        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
        {errors[field]}
      </p>
    )}
  </div>
);

export default RenderInput;
