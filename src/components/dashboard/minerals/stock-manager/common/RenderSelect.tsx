const RenderSelect = (
    label: string,
    value: string,
    onChange: (value: any) => void,
    options: Record<string, { en: string; rw: string }>,
    disabled = false
  ) => (
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
        {Object.entries(options).map(([optionValue, labels]) => (
          <option key={optionValue} value={optionValue}>
            {labels.en} ({labels.rw})
          </option>
        ))}
      </select>
    </div>
  );


export default RenderSelect;