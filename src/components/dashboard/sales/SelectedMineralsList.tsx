// components/dashboard/sales/SelectedMineralsList.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  XMarkIcon, 
  CubeIcon, 
  ScaleIcon, 
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useSelectedMinerals } from '../../../hooks/useSelectedMinerals';
import RenderInput from '../minerals/common/RenderInput';
import { NumericFormat } from 'react-number-format';

interface SelectedMineralsListProps {
  minerals: any[];
  mineralType: string;
}

export interface SaleMineralInput {
  mineral_id: string;
  replenish_kgs: number;
}

const SelectedMineralsList = forwardRef<
  {
    getPrepairedMinerals: () => SaleMineralInput[];
    hasReplenishedMinerals: () => boolean;
    calculateTotalWeight: () => number;
  },
  SelectedMineralsListProps
>(({ minerals, mineralType }, ref) => {
  const { t } = useTranslation();
  const { deselectMineral } = useSelectedMinerals();
  
  // State for tracking which minerals have replenishing enabled
  const [replenishEnabled, setReplenishEnabled] = useState<{[key: string]: boolean}>({});
  // State for tracking replenish amount for each mineral
  const [replenishValues, setReplenishValues] = useState<{[key: string]: number}>({});

  const getMineralTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TANTALUM':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'TIN':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'TUNGSTEN':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  // Toggle replenish mode for a mineral
  const toggleReplenish = (id: string, netWeight: number) => {
    setReplenishEnabled(prev => {
      const newState = {
        ...prev,
        [id]: !prev[id]
      };
      
      // Initialize replenish value when enabled
      if (newState[id] && !replenishValues[id]) {
        setReplenishValues(prevValues => ({
          ...prevValues,
          [id]: netWeight / 2 // Default to half the weight
        }));
      }
      
      return newState;
    });
  };
  
  // Handle replenish amount change
  const handleReplenishChange = (id: string, value: number, maxWeight: number) => {
    // Ensure value is between 0 and max weight
    const safeValue = Math.min(Math.max(0, value), maxWeight);
    setReplenishValues(prev => ({
      ...prev,
      [id]: safeValue
    }));
  };
  
  // Calculate the effective total weight considering replenished amounts
  const calculateTotalWeight = () => {
    return minerals.reduce((sum, item) => {
      // If replenish is enabled for this mineral, use the replenish amount
      // Otherwise use the full net weight
      if (replenishEnabled[item.id]) {
        return sum + (replenishValues[item.id] || 0);
      }
      return sum + item.netWeight;
    }, 0);
  };
  
  // Get prepared minerals data for submission
  const getPrepairedMinerals = () => {
    return minerals.map(mineral => ({
      mineral_id: mineral.id,
      replenish_kgs: replenishEnabled[mineral.id] ? (replenishValues[mineral.id] || 0) : 0
    }));
  };
  
  // Check if any minerals have replenishing enabled
  const hasReplenishedMinerals = () => {
    return Object.keys(replenishEnabled).some(id => replenishEnabled[id] && replenishValues[id] > 0);
  };
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getPrepairedMinerals,
    hasReplenishedMinerals,
    calculateTotalWeight
  }));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getMineralTypeColor(mineralType)}`}>
            {mineralType}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {minerals.length} {t('sales.items_selected', 'items selected')}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('sales.total_weight', 'Total Weight')}: {calculateTotalWeight().toFixed(2)} kg
        </div>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {minerals.map((mineral) => (
          <motion.div
            key={mineral.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border ${
              replenishEnabled[mineral.id] 
                ? 'border-green-300 dark:border-green-700' 
                : 'border-gray-200 dark:border-gray-700'
            } flex flex-col justify-between transition-all duration-200`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                    <CubeIcon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {mineral.lotNumber}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {mineral.supplierName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <ScaleIcon className="w-3 h-3 mr-1" />
                    <span>{mineral.netWeight.toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Improved replenish button with label */}
                <button
                  onClick={() => toggleReplenish(mineral.id, mineral.netWeight)}
                  className={`py-1 px-2 rounded-md flex items-center ${
                    replenishEnabled[mineral.id] 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  } hover:bg-opacity-80 transition-colors text-xs font-medium`}
                >
                  <ArrowPathIcon className="w-3.5 h-3.5 mr-1" />
                  {t('sales.replenish', 'Replenish')}
                </button>
                
                <button
                  onClick={() => deselectMineral(mineral.id, mineralType.toLowerCase() as any)}
                  className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Replenish controls - improved UI */}
            {replenishEnabled[mineral.id] && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('sales.replenish_amount', 'Replenish Amount (kg)')}
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    {/* <input
                      type="number"
                      max={mineral.netWeight}
                      step="0.01"
                      value={replenishValues[mineral.id] || 0}
                      onChange={(e) => handleReplenishChange(mineral.id, parseFloat(e.target.value) || 0, mineral.netWeight)}
                      className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    /> */}
                    <NumericFormat
                        value={replenishValues[mineral.id] || 0}
                        max={mineral.netWeight}
                        decimalScale={2}
                        allowNegative={false}
                        allowLeadingZeros={false}
                        onValueChange={(values) => {
                            handleReplenishChange(mineral.id, values?.floatValue || 0, mineral.netWeight)
                        }}
                        className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`0.00`}
                        step="0.01"
                        min={0}
                    />

                    <button
                      onClick={() => handleReplenishChange(mineral.id, mineral.netWeight, mineral.netWeight)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300"
                    >
                      {t('sales.max', 'Max')}
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {((replenishValues[mineral.id] || 0) / mineral.netWeight * 100).toFixed(0)}%
                    </span>
                    <span>
                      {(replenishValues[mineral.id] || 0).toFixed(2)} / {mineral.netWeight.toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default SelectedMineralsList;