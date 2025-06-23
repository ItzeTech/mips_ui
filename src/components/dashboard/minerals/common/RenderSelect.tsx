import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface RenderSelectInterface {
  label: string;
  value: string;
  onChange: (value: any) => void;
  options: Record<string, string>; // options as key: translationKey
  disabled?: boolean;
  field: string;
  errors?: Record<string, string>;
}

const RenderSelect = ({
  label,
  value,
  onChange,
  options = {},
  disabled = false,
  field = '',
  errors = {}
}: RenderSelectInterface) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'border-gray-300'
        }`}
      >
        {Object.entries(options).map(([optionValue, translationKey]) => (
          <option key={optionValue} value={optionValue}>
            {t(translationKey)}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );
};

export default RenderSelect;
