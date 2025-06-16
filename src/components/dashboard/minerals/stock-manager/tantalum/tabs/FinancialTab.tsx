import { CurrencyDollarIcon, CheckBadgeIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react'
import { FinancialFormData, LabFormData } from '../../../../../../features/minerals/tantalumSlice';
import { contentVariants, FINANCE_STATUS_OPTIONS, formatNumber } from '../../../../../../utils/util';
import RenderInput from '../../common/RenderInput';
import RenderSelect from '../../common/RenderSelect';
import { useTranslation } from 'react-i18next';


interface FinancialTabInterface {
    financialForm: FinancialFormData;
    setFinancialForm: React.Dispatch<React.SetStateAction<FinancialFormData>>;
    errors?: Record<string, string>
    labForm: LabFormData;
    calculatedValues: any;
}

export default function FinancialTab({financialForm, setFinancialForm, errors={}, labForm, calculatedValues}: FinancialTabInterface) {

    const { t } = useTranslation();
    const renderPurchaseTa2O5Input = () => {
        const availableValues = [];
        if (labForm.internal_ta2o5) {
          availableValues.push({ 
            label: 'Internal', 
            value: labForm.internal_ta2o5,
            color: 'slate' 
          });
        }
        if (labForm.alex_stewart_ta2o5) {
          availableValues.push({ 
            label: 'Alex Stewart', 
            value: labForm.alex_stewart_ta2o5,
            color: 'gray' 
          });
        }
      
        const getColorClasses = (color: string) => {
          const colors = {
            slate: {
              border: 'border-slate-200 dark:border-slate-700',
              bg: 'bg-slate-50 dark:bg-slate-800/50',
              hover: 'hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/70',
              text: 'text-slate-700 dark:text-slate-300',
              dot: 'bg-slate-400'
            },
            gray: {
              border: 'border-gray-200 dark:border-gray-700',
              bg: 'bg-gray-50 dark:bg-gray-800/50',
              hover: 'hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/70',
              text: 'text-gray-700 dark:text-gray-300',
              dot: 'bg-gray-400'
            }
          };
          return colors[color as keyof typeof colors];
        };
      
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('tantalum.purchase_ta2o5_percentage', 'Purchase Ta2O5 %')}
            </label>
            
            {/* Available values display - Inline with label */}
            {availableValues.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {t('tantalum.quick_select', 'Quick Select')}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {availableValues.map((item, index) => {
                    const colorClasses = getColorClasses(item.color);
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFinancialForm(prev => ({ ...prev, purchase_ta2o5_percentage: item.value }))}
                        className={`group flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hover}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot} group-hover:scale-110 transition-transform duration-200`}></div>
                        <span className={`font-medium ${colorClasses.text}`}>
                          {item.label}
                        </span>
                        <div className="flex items-baseline gap-0.5">
                          <span className={`font-bold ${colorClasses.text}`}>
                            {item.value}
                          </span>
                          <span className={`${colorClasses.text} opacity-60`}>
                            %
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
      
            {/* Input field - UNCHANGED from original */}
            <div className="relative">
              <input
                type="number"
                step="any"
                value={financialForm.purchase_ta2o5_percentage || ''}
                onChange={(e) => setFinancialForm(prev => ({ 
                  ...prev, 
                  purchase_ta2o5_percentage: parseFloat(e.target.value) || null 
                }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter purchase Ta2O5 percentage"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('tantalum.purchase_ta2o5_hint', 'You can use one of the available lab values or enter a custom percentage')}
            </p>
          </div>
        );
      };

  return (
    <motion.div
        key="financial"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
    >
        {/* Input Fields */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.pricing_inputs', 'Pricing Inputs')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RenderInput(
            t('tantalum.price_per_percentage', 'Price Per 1%'),
            financialForm.price_per_percentage,
            (value) => setFinancialForm(prev => ({ ...prev, price_per_percentage: value })),
            'number',
            '$'
            )}
            
            {RenderInput(
            t('tantalum.exchange_rate', 'Exchange Rate (USD to RWF)'),
            financialForm.exchange_rate,
            (value) => setFinancialForm(prev => ({ ...prev, exchange_rate: value })),
            'number'
            )}

            {/* Special Purchase Ta2O5% input */}
            <div className="space-y-2">
            {renderPurchaseTa2O5Input()}
            </div>
            
            {RenderInput(
            t('tantalum.price_of_tag', 'Price of Tag per Kg (RWF)'),
            financialForm.price_of_tag_per_kg_rwf,
            (value) => setFinancialForm(prev => ({ ...prev, price_of_tag_per_kg_rwf: value })),
            'number',
            ' RWF'
            )}
        </div>
        </div>

        {/* Finance Status */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CheckBadgeIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.finance_status_management', 'Finance Status')}
        </h3>
        
        <div className="max-w-md">
            {RenderSelect(
            t('tantalum.finance_status_label', 'Finance Status'),
            financialForm.finance_status,
            (value) => setFinancialForm(prev => ({ ...prev, finance_status: value })),
            FINANCE_STATUS_OPTIONS
            )}
        </div>
        </div>

        {/* Calculated Values */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-green-600" />
            {t('tantalum.calculated_values', 'Calculated Values')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.unit_price', 'Unit Price')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatNumber(calculatedValues.unit_price)}
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.total_amount', 'Total Amount')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatNumber(calculatedValues.total_amount)}
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.rra', 'RRA (3%)')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatNumber(calculatedValues.rra)}
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.rma', 'RMA')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatNumber(calculatedValues.rma)}
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.inkomane_fee', 'Inkomane Fee')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(calculatedValues.inkomane_fee)} RWF
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.advance', 'Advance')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(calculatedValues.advance)} RWF
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.total_charge', 'Total Charge')}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatNumber(calculatedValues.total_charge)}
            </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm border-2 border-green-200 dark:border-green-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('tantalum.net_amount', 'Net Amount')}
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                ${formatNumber(calculatedValues.net_amount)}
            </div>
            </div>
        </div>
        </div>
    </motion.div>
  )
}
