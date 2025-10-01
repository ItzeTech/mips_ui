// components/dashboard/minerals/tungsten/tabs/FinancialTab.tsx
import { CurrencyDollarIcon, CheckBadgeIcon, DocumentTextIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react'
import { FinancialFormData, LabFormData } from '../../../../../features/minerals/tungstenSlice';
import { contentVariants, FINANCE_STATUS_OPTIONS, formatNumber } from '../../../../../utils/util';
import RenderInput from '../../common/RenderInput';
import RenderSelect from '../../common/RenderSelect';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';
import { TungstenSettingsData } from '../../../../../features/settings/tungstenSettingSlice';
import HoverInfoCard from '../../common/HoverInfoCard';



interface FinancialTabInterface {
    financialForm: FinancialFormData;
    net_weight: number | null;
    setFinancialForm: React.Dispatch<React.SetStateAction<FinancialFormData>>;
    errors?: Record<string, string>
    labForm: LabFormData;
    calculatedValues: any;
    TungstenSettingsData?: TungstenSettingsData | null;
    setUseCustomFees: React.Dispatch<React.SetStateAction<boolean>>;
    useCustomFees: boolean;
    isFinancialDisabled?: boolean;
}

const CustomFeeToggle = ({ isEnabled, onChange }: { isEnabled: boolean, onChange: (enabled: boolean) => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => onChange(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isEnabled ? 'Custom fees enabled' : 'Using global settings'}
      </span>
    </div>
  );
};

export default function FinancialTab({
  financialForm,
  net_weight,
  setFinancialForm,
  errors = {},
  labForm,
  calculatedValues,
  TungstenSettingsData,
  setUseCustomFees,
  useCustomFees,
  isFinancialDisabled
}: FinancialTabInterface) {

    const { t } = useTranslation();

    // Function to handle resetting to global settings
  const handleResetToGlobalSettings = () => {
    if(TungstenSettingsData) {
      setFinancialForm(prev => ({
        ...prev,
        rra_percentage_fee: TungstenSettingsData.rra_percentage,
        rma_usd_per_ton_fee: TungstenSettingsData.rma_usd_per_ton,
        inkomane_fee_per_kg_rwf_fee: TungstenSettingsData.inkomane_fee_per_kg_rwf
      }));
    }else{
      setFinancialForm(prev => ({
        ...prev,
        rra_percentage_fee: null,
        rma_usd_per_ton_fee: null,
        inkomane_fee_per_kg_rwf_fee: null,
        rra_price_per_percentage_fee: null
    }));
    }
    
    setUseCustomFees(false);
  };

  // Function to handle initializing with global settings
  const handleInitializeWithGlobalSettings = () => {
    if (TungstenSettingsData) {
      setFinancialForm(prev => ({
        ...prev,
        rra_percentage_fee: TungstenSettingsData.rra_percentage,
        rma_usd_per_ton_fee: TungstenSettingsData.rma_usd_per_ton,
        inkomane_fee_per_kg_rwf_fee: TungstenSettingsData.inkomane_fee_per_kg_rwf
      }));
      setUseCustomFees(true);
    }
  };

    if(!TungstenSettingsData) {
      return (
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl">
                <ExclamationCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('tungsten.settings_required')}</h3>
                <p className="text-sm mt-1">{t('tungsten.tungstenSettingsMissing')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    
    const renderPurchaseWO3Input = (errors: Record<string, string>, field: string) => {
        const availableValues = [];
        if (labForm.wo3_percentage) {
          availableValues.push({ 
            label: 'Internal', 
            value: labForm.wo3_percentage,
            color: 'slate' 
          });
        }
        if (labForm.alex_stewart_wo3_percentage) {
          availableValues.push({ 
            label: 'Alex Stewart', 
            value: labForm.alex_stewart_wo3_percentage,
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
              {t('tungsten.purchase_wo3_percentage', 'Purchase WO3 %')}
            </label>
            
            {/* Available values display - Inline with label */}
            {availableValues.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {t('tungsten.quick_select', 'Quick Select')}
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
                        onClick={() => setFinancialForm(prev => ({ ...prev, purchase_wo3_percentage: item.value }))}
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
      
            {/* Input field */}
            <div className="relative">
              <NumericFormat
                value={financialForm.purchase_wo3_percentage || null}
                decimalScale={3}
                allowNegative={false}
                allowLeadingZeros={true}
                onValueChange={(values) => {
                  setFinancialForm(prev => ({ 
                    ...prev, 
                    purchase_wo3_percentage: values.floatValue || null 
                  }))
                }}
                suffix=""  
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter purchase WO3 percentage"       
              />

              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('tungsten.purchase_wo3_hint', 'You can use one of the available lab values or enter a custom percentage')}
            </p>
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                {errors[field]}
              </p>
            )}
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
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-emerald-500" />
              {t('tungsten.pricing_inputs', 'Pricing Inputs')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RenderInput
              label={t('tungsten.mtu', 'MTU')}
              value={financialForm.mtu}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, mtu: value }))}
              type="number"
              suffix="$"
              field="mtu"
              errors={errors}
            />

            <RenderInput
              label={t('tungsten.exchange_rate', 'Exchange Rate (USD to RWF)')}
              value={financialForm.exchange_rate}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, exchange_rate: value }))}
              type="number"
              field="exchange_rate"
              errors={errors}
            />

            {/* Special Purchase WO3% input */}
            <div className="space-y-2">
              {renderPurchaseWO3Input(errors, 'purchase_wo3_percentage')}
            </div>

            <RenderInput
              label={t('tungsten.price_of_tag', 'Price of Tag per Kg (RWF)')}
              value={financialForm.price_of_tag_per_kg_rwf}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, price_of_tag_per_kg_rwf: value }))}
              type="number"
              suffix="RWF"
              field="price_of_tag_per_kg_rwf"
              errors={errors}
              canHaveZero={true}
            />

            <RenderInput
              label={t('tantalum.transport_charge', 'Transport Charge in USD')}
              value={financialForm.transport_charge}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, transport_charge: value }))}
              type="number"
              suffix="$"
              field="transport_charge"
              errors={errors}
            />

            <RenderInput
              label={t('tantalum.alex_stewart_charge', 'Alex Stewart Charge in USD')}
              value={financialForm.alex_stewart_charge}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, alex_stewart_charge: value }))}
              type="number"
              suffix="$"
              field="alex_stewart_charge"
              errors={errors}
            />
          </div>
        </div>

        {/* Finance Status */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckBadgeIcon className="w-5 h-5 mr-2 text-emerald-500" />
              {t('tungsten.finance_status_management', 'Finance Status')}
          </h3>
          <div className="max-w-md">
            <RenderSelect
              label={t('tungsten.finance_status_label', 'Finance Status')}
              value={financialForm.finance_status}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, finance_status: value }))}
              options={FINANCE_STATUS_OPTIONS}
              field='finance_status_label'
              errors={errors}
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-indigo-500" />
                {t('tantalum.fee_settings', 'Fee Settings')}
            </h3>
            <CustomFeeToggle 
              isEnabled={useCustomFees}
              onChange={(enabled) => {
                setUseCustomFees(enabled);
                if (enabled && !financialForm.rra_percentage_fee) {
                  handleInitializeWithGlobalSettings();
                }
              }}
            />
          </div>
          
          {useCustomFees ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <RenderInput
                  label={t('tantalum.rra_percentage', 'RRA Percentage')}
                  value={financialForm.rra_percentage_fee}
                  onChange={(value) => setFinancialForm(prev => ({ ...prev, rra_percentage_fee: value }))}
                  type="number"
                  suffix="%"
                  field="rra_percentage_fee"
                  errors={errors}
                />

                <RenderInput
                  label={t('tantalum.rma_usd_per_kg', 'RMA per Kg')}
                  value={financialForm.rma_usd_per_ton_fee}
                  onChange={(value) => setFinancialForm(prev => ({ ...prev, rma_usd_per_ton_fee: value }))}
                  type="number"
                  suffix="$"
                  field="rma_usd_per_ton_fee"
                  errors={errors}
                />

                <RenderInput
                  label={t('tantalum.inkomane_fee_per_kg', 'Inkomane Fee per Kg')}
                  value={financialForm.inkomane_fee_per_kg_rwf_fee}
                  onChange={(value) => setFinancialForm(prev => ({ ...prev, inkomane_fee_per_kg_rwf_fee: value }))}
                  type="number"
                  suffix="RWF"
                  field="inkomane_fee_per_kg_rwf_fee"
                  errors={errors}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleResetToGlobalSettings}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('tantalum.reset_to_global', 'Reset to global settings')}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {t('tantalum.using_global_settings', 'Using global fee settings')}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>{t('tantalum.rra_percentage_label', 'RRA Percentage')}: {TungstenSettingsData?.rra_percentage}%</li>
                      <li>{t('tantalum.rma_usd_per_kg_label', 'RMA per Kg')}: ${TungstenSettingsData?.rma_usd_per_ton ? TungstenSettingsData.rma_usd_per_ton : 0}</li>
                      <li>{t('tantalum.inkomane_fee_label', 'Inkomane Fee per Kg')}: {TungstenSettingsData?.inkomane_fee_per_kg_rwf} RWF</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

        {/* Calculated Values */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-emerald-600" />
              {t('tungsten.calculated_values', 'Calculated Values')}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HoverInfoCard
                title={t('tungsten.price_per_kg', 'Price per kg')}
                value={`$${formatNumber(calculatedValues.price_per_kg)}`}
                color="emerald"
                formula="(MTU * Purchase WO3%) / 1000"
                data={[
                  { label: "MTU", value: formatNumber(financialForm.mtu) },
                  { label: "Purchase WO3 %", value: formatNumber(financialForm.purchase_wo3_percentage) + '%' }
                ]}
                outputLabel="Price per kg"
                outputValue={`$${formatNumber(calculatedValues.price_per_kg)}`}
              />

              <HoverInfoCard
                title={t('tungsten.total_amount', 'Total Amount')}
                value={`$${formatNumber(calculatedValues.total_amount)}`}
                color="emerald"
                formula="price per kg * net weight"
                data={[
                  { label: "Price per kg", value: `$${formatNumber(calculatedValues.price_per_kg)}` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Total Amount"
                outputValue={`$${formatNumber(calculatedValues.total_amount)}`}
              />

              <HoverInfoCard
                title={`${t('tungsten.rra', 'RRA')} (${(financialForm.rra_percentage_fee ?? TungstenSettingsData?.rra_percentage)}%)`}
                value={`$${formatNumber(calculatedValues.rra)}`}
                color="emerald"
                formula="Total amount * RRA %"
                data={[
                  { label: "Total amount", value: `$${formatNumber(calculatedValues.total_amount)}` },
                  { label: "RRA %", value: `${(financialForm.rra_percentage_fee ?? TungstenSettingsData?.rra_percentage)}%` },
                ]}
                outputLabel="RRA"
                outputValue={`$${formatNumber(calculatedValues.rra)}`}
              />

              <HoverInfoCard
                title={`${t('tungsten.rma', 'RMA')} ($${(financialForm.rma_usd_per_ton_fee ?? TungstenSettingsData?.rma_usd_per_ton)})`}
                value={`$${formatNumber(calculatedValues.rma)}`}
                color="emerald"
                formula="RMA per ton * (Net weight / 1000)"
                data={[
                  { label: "RMA per ton", value: `$${(financialForm.rma_usd_per_ton_fee ?? TungstenSettingsData?.rma_usd_per_ton)}` },
                  { label: "Net Weight", value: formatNumber(net_weight) + " kg" },
                ]}
                outputLabel="RMA"
                outputValue={`$${formatNumber(calculatedValues.rma)}`}
              />

              <HoverInfoCard
                title={`${t('tungsten.inkomane_fee', 'Inkomane Fee')} (${(financialForm.inkomane_fee_per_kg_rwf_fee ?? TungstenSettingsData?.inkomane_fee_per_kg_rwf)} RWF)`}
                value={`${formatNumber(calculatedValues.inkomane_fee)} RWF`}
                color="emerald"
                formula="inkomane fee * net weight"
                data={[
                  { label: "Inkomane fee", value: `${(financialForm.inkomane_fee_per_kg_rwf_fee ?? TungstenSettingsData?.inkomane_fee_per_kg_rwf)} RWF` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Inkomane Fee"
                outputValue={`${formatNumber(calculatedValues.inkomane_fee)} RWF`}
              />

              <HoverInfoCard
                title={t('tungsten.advance', 'Advance')}
                value={`${formatNumber((calculatedValues.advance ?? 0))} RWF`}
                color="emerald"
                formula="price of tag per kg * net weight"
                data={[
                  { label: "Price of Tag per Kg", value: formatNumber(financialForm.price_of_tag_per_kg_rwf) },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Advance"
                outputValue={`${formatNumber((calculatedValues.advance ?? 0))} RWF`}
              />

              <HoverInfoCard
                title={t('tungsten.total_charge', 'Total Charge')}
                value={`$${formatNumber(calculatedValues.total_charge)}`}
                color="emerald"
                formula="RRA + RMA + (Inkomane / Exchange Rate) + (Advance / Exchange Rate) + Transport Charge + Alex Stewart Charge"
                data={[
                  { label: "RRA", value: `$${formatNumber(calculatedValues.rra)}` },
                  { label: "RMA", value: `$${formatNumber(calculatedValues.rma)}` },
                  { label: "Inkomane / Exchange Rate", value: `(${calculatedValues.inkomane_fee} / ${financialForm?.exchange_rate}) = $${financialForm?.exchange_rate ? calculatedValues.inkomane_fee / financialForm?.exchange_rate: '...'}` },
                  { label: "Advance / Exchange Rate", value: `(${(calculatedValues.advance ?? 0)} / ${financialForm?.exchange_rate}) = $${financialForm?.exchange_rate ? (calculatedValues.advance ?? 0) / financialForm?.exchange_rate: '...'}` },
                  { label: "Transport Charge", value: `$${financialForm.transport_charge ?? 0}` },
                  { label: "Alex Stewart Charge", value: `$${financialForm.alex_stewart_charge ?? 0}` },
                ]}
                outputLabel="Total Charge"
                outputValue={`$${formatNumber(calculatedValues.total_charge)}`}
              />

              <HoverInfoCard
                title={t('tungsten.net_amount', 'Net Amount')}
                value={`$${formatNumber(calculatedValues.net_amount)}`}
                color="green"
                formula="total amount - total charge"
                data={[
                  { label: "Total Amount", value: `$${formatNumber(calculatedValues.total_amount)}` },
                  { label: "Total Charge", value: `$${formatNumber(calculatedValues.total_charge)}` },
                ]}
                outputLabel="Net Amount"
                outputValue={`$${formatNumber(calculatedValues.net_amount)}`}
              />
            </div>
          </div>
      </motion.div>
  )
}