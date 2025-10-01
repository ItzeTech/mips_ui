import React from "react";

interface HoverInfoCardProps {
  title: string;
  value: string | number;
  color?: string; // for text color, e.g., "green" or "red"
  formula: string;
  data: { label: string; value: string | number }[];
  outputLabel: string;
  outputValue: string | number;
}

const HoverInfoCard: React.FC<HoverInfoCardProps> = ({
  title,
  value,
  color = "green",
  formula,
  data,
  outputLabel,
  outputValue,
}) => {

  return (
    <div className="relative group">
      {/* Main Card */}
      <div
        className={`bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border-2 border-${color}-200 dark:border-${color}-700`}
      >
        <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
          {title}
        </div>
        <div
          className={`text-lg font-bold text-${color}-600 dark:text-${color}-200`}
        >
          {value}
        </div>
      </div>

      {/* Hover Box */}
      <div className="pointer-events-none absolute z-50 left-1/2 top-0 translate-y-[-110%] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-64 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 p-4 rounded-xl shadow-2xl">
        <div>
          <div className="font-semibold mb-2">{title} Breakdown</div>
          <div className="text-xs mb-2 text-gray-500">
            <strong>Formula:</strong> {formula}
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1">
            {data.map((item, idx) => (
              <li key={idx}>
                {item.label}: <span className="font-medium">{item.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-xs font-semibold border-t pt-2 flex justify-between">
            <span>{outputLabel}</span>
            <span>{outputValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverInfoCard;
