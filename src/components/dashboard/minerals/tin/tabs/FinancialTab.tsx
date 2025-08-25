// components/dashboard/minerals/tin/tabs/FinancialTab.tsx
import { CurrencyDollarIcon, CheckBadgeIcon, DocumentTextIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import React from 'react'
import { FinancialFormData, LabFormData } from '../../../../../features/minerals/tinSlice';
import { contentVariants, FINANCE_STATUS_OPTIONS, formatNumber } from '../../../../../utils/util';
import RenderInput from '../../common/RenderInput';
import RenderSelect from '../../common/RenderSelect';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';
import { TinSettingsData } from '../../../../../features/settings/tinSettingSlice';
import HoverInfoCard from '../../common/HoverInfoCard';



interface FinancialTabInterface {
    financialForm: FinancialFormData;
    net_weight: number | null;
    setFinancialForm: React.Dispatch<React.SetStateAction<FinancialFormData>>;
    errors?: Record<string, string>
    labForm: LabFormData;
    calculatedValues: any;
    TinSettingsData?: TinSettingsData | null;
}

export default function FinancialTab({
  financialForm,
  net_weight,
  setFinancialForm,
  errors = {},
  labForm,
  calculatedValues,
  TinSettingsData
}: FinancialTabInterface) {

    const { t } = useTranslation();

    if(!TinSettingsData) {
      return (
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-3 text-amber-800 dark:text-amber-300">
              <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-xl">
                <ExclamationCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('tin.settings_required')}</h3>
                <p className="text-sm mt-1">{t('tin.tinSettingsMissing')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    
    const renderPurchaseSnInput = (errors: Record<string, string>, field: string) => {
        const availableValues = [];
        if (labForm.internal_sn_percentage) {
          availableValues.push({ 
            label: 'Internal', 
            value: labForm.internal_sn_percentage,
            color: 'slate' 
          });
        }
        if (labForm.alex_stewart_sn_percentage) {
          availableValues.push({ 
            label: 'Alex Stewart', 
            value: labForm.alex_stewart_sn_percentage,
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
              {t('tin.purchase_sn_percentage', 'Purchase Sn %')}
            </label>
            
            {/* Available values display - Inline with label */}
            {availableValues.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {t('tin.quick_select', 'Quick Select')}
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
                        onClick={() => setFinancialForm(prev => ({ ...prev, purchase_sn_percentage: item.value }))}
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
                value={financialForm.purchase_sn_percentage || null}
                decimalScale={3}
                allowNegative={false}
                allowLeadingZeros={true}
                onValueChange={(values) => {
                  setFinancialForm(prev => ({ 
                    ...prev, 
                    purchase_sn_percentage: values.floatValue || null 
                  }))
                }}
                suffix=""  
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter purchase Sn percentage"       
              />

              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('tin.purchase_sn_hint', 'You can use one of the available lab values or enter a custom percentage')}
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
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-amber-500" />
              {t('tin.pricing_inputs', 'Pricing Inputs')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RenderInput
              label={t('tin.lme_rate', 'LME Rate')}
              value={financialForm.lme_rate}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, lme_rate: value }))}
              type="number"
              suffix="$"
              field="lme_rate"
              errors={errors}
            />

            <RenderInput
              label={t('tin.internal_tc', 'Internal Treatment Charge')}
              value={financialForm.internal_tc}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, internal_tc: value }))}
              type="number"
              suffix="$"
              field="internal_tc"
              errors={errors}
              canHaveZero={true}
            />

            <RenderInput
              label={t('tin.price_of_tag', 'Price of Tag per Kg (RWF)')}
              value={financialForm.price_of_tag_per_kg_rwf}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, price_of_tag_per_kg_rwf: value }))}
              type="number"
              suffix="RWF"
              field="price_of_tag_per_kg_rwf"
              errors={errors}
              canHaveZero={true}
            />


            <RenderInput
              label={t('tin.fluctuation_fee', 'Fluctuation Fee')}
              value={financialForm.fluctuation_fee}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, fluctuation_fee: value }))}
              type="number"
              suffix="$"
              field="fluctuation_fee"
              errors={errors}
              canHaveZero={true}
            />
            
            {/* Special Purchase Sn% input */}
            <div className="space-y-2">
              {renderPurchaseSnInput(errors, 'purchase_sn_percentage')}
            </div>

            <RenderInput
              label={t('tin.exchange_rate', 'Exchange Rate (USD to RWF)')}
              value={financialForm.exchange_rate}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, exchange_rate: value }))}
              type="number"
              field="exchange_rate"
              errors={errors}
            />

          </div>
        </div>

        {/* Finance Status */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckBadgeIcon className="w-5 h-5 mr-2 text-amber-500" />
              {t('tin.finance_status_management', 'Finance Status')}
          </h3>
          <div className="max-w-md">
            <RenderSelect
              label={t('tin.finance_status_label', 'Finance Status')}
              value={financialForm.finance_status}
              onChange={(value) => setFinancialForm(prev => ({ ...prev, finance_status: value }))}
              options={FINANCE_STATUS_OPTIONS}
              field='finance_status_label'
              errors={errors}
            />
          </div>
        </div>

        {/* Calculated Values */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-amber-600" />
              {t('tin.calculated_values', 'Calculated Values')}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HoverInfoCard
                title={t('tin.rra_price_per_kg', 'RRA Price per kg')}
                value={`$${formatNumber(calculatedValues.rra_price_per_kg)}`}
                color="amber"
                formula="((LME * Purchase Sn %) - Govt TC) / 1000"
                data={[
                  { label: "LME Rate", value: formatNumber(financialForm.lme_rate) },
                  { label: "Purchase Sn %", value: formatNumber(financialForm.purchase_sn_percentage) + '%' },
                  { label: "Govt TC", value: formatNumber(financialForm.government_tc) },
                ]}
                outputLabel="RRA Price per kg"
                outputValue={`$${formatNumber(calculatedValues.rra_price_per_kg)}`}
              />

              <HoverInfoCard
                title={t('tin.internal_price_per_kg', 'Internal Price/kg')}
                value={`$${formatNumber(calculatedValues.internal_price_per_kg)}`}
                color="amber"
                formula="(((LME - FF) * Purchase Sn %) - Internal TC) / 1000"
                data={[
                  { label: "LME Rate", value: formatNumber(financialForm.lme_rate) },
                  { label: "Fluctuation Fee", value: formatNumber(financialForm.fluctuation_fee) },
                  { label: "Purchase Sn %", value: formatNumber(financialForm.purchase_sn_percentage) + '%' },
                  { label: "Internal TC", value: formatNumber(financialForm.internal_tc) },
                ]}
                outputLabel="Internal Price/kg"
                outputValue={`$${formatNumber(calculatedValues.internal_price_per_kg)}`}
              />

              <HoverInfoCard
                title={t('tin.total_amount', 'Total Amount')}
                value={`$${formatNumber(calculatedValues.total_amount)}`}
                color="amber"
                formula="internal price/kg * net weight"
                data={[
                  { label: "Internal Price/kg", value: `$${formatNumber(calculatedValues.internal_price_per_kg)}` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Total Amount"
                outputValue={`$${formatNumber(calculatedValues.total_amount)}`}
              />

              <HoverInfoCard
                title={`${t('tin.rra', 'RRA')} (${TinSettingsData?.rra_percentage / 100}%)`}
                value={`$${formatNumber(calculatedValues.rra)}`}
                color="amber"
                formula="(RRA price/kg * RRA %) * net weight"
                data={[
                  { label: "RRA Price/kg", value: `$${formatNumber(calculatedValues.rra_price_per_kg)}` },
                  { label: "RRA %", value: `${TinSettingsData?.rra_percentage / 100}%` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="RRA"
                outputValue={`$${formatNumber(calculatedValues.rra)}`}
              />

              <HoverInfoCard
                title={`${t('tin.rma', 'RMA')} (${TinSettingsData?.rma_per_kg_rwf} RWF)`}
                value={`${formatNumber(calculatedValues.rma)} RWF`}
                color="amber"
                formula="RMA per kg * net weight"
                data={[
                  { label: "RMA per kg", value: `${TinSettingsData?.rma_per_kg_rwf} RWF` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="RMA"
                outputValue={`${formatNumber(calculatedValues.rma)} RWF`}
              />

              <HoverInfoCard
                title={`${t('tin.inkomane_fee', 'Inkomane Fee')} (${TinSettingsData?.inkomane_fee_per_kg_rwf} RWF)`}
                value={`${formatNumber(calculatedValues.inkomane_fee)} RWF`}
                color="amber"
                formula="inkomane fee * net weight"
                data={[
                  { label: "Inkomane fee", value: `${TinSettingsData?.inkomane_fee_per_kg_rwf} RWF` },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Inkomane Fee"
                outputValue={`${formatNumber(calculatedValues.inkomane_fee)} RWF`}
              />

              <HoverInfoCard
                title={t('tin.advance', 'Advance')}
                value={`${formatNumber(calculatedValues.advance)} RWF`}
                color="amber"
                formula="price of tag per kg * net weight"
                data={[
                  { label: "Price of Tag per Kg", value: formatNumber(financialForm.price_of_tag_per_kg_rwf) },
                  { label: "Net Weight", value: formatNumber(net_weight) },
                ]}
                outputLabel="Advance"
                outputValue={`${formatNumber(calculatedValues.advance)} RWF`}
              />

              <HoverInfoCard
                title={t('tin.total_charge', 'Total Charge')}
                value={`$${formatNumber(calculatedValues.total_charge)}`}
                color="amber"
                formula="RRA + (RMA / Exchange Rate) + (Inkomane / Exchange Rate) + (Advance / Exchange Rate)"
                data={[
                  { label: "RRA", value: `$${formatNumber(calculatedValues.rra)}` },
                  { label: "RMA / Exchange Rate", value: `(${calculatedValues.rma} / ${financialForm?.exchange_rate}) = $${financialForm?.exchange_rate ? calculatedValues.rma / financialForm?.exchange_rate: '...'}` },
                  { label: "Inkomane / Exchange Rate", value: `(${calculatedValues.inkomane_fee} / ${financialForm?.exchange_rate}) = $${financialForm?.exchange_rate ? calculatedValues.inkomane_fee / financialForm?.exchange_rate: '...'}` },
                  { label: "Advance / Exchange Rate", value: `(${calculatedValues.advance} / ${financialForm?.exchange_rate}) = $${financialForm?.exchange_rate ? calculatedValues.advance / financialForm?.exchange_rate: '...'}` },
                ]}
                outputLabel="Total Charge"
                outputValue={`$${formatNumber(calculatedValues.total_charge)}`}
              />

              <HoverInfoCard
                title={t('tin.net_amount', 'Net Amount')}
                value={`$${formatNumber(calculatedValues.net_amount)}`}
                color="orange"
                formula="total amount - total charge"
                data={[
                  { label: "Total Amount", value: `$${formatNumber(calculatedValues.total_amount)}` },
                  { label: "Total Charge", value: `$${formatNumber(calculatedValues.total_charge)}` },
                ]}
                outputLabel="Net Amount"
                outputValue={`$${formatNumber(calculatedValues.net_amount)}`}
              />

              <HoverInfoCard
                title={t('tin.net_amount_in_rwf', 'Net Amount')}
                value={`${formatNumber(calculatedValues.net_amount * (financialForm?.exchange_rate ?? 0))} RWF`}
                color="orange"
                formula="Net Amount * Exchange Rate"
                data={[
                  { label: "Net Amount", value: `$${formatNumber(calculatedValues.net_amount)}` },
                  { label: "Exchange Rate", value: `${formatNumber((financialForm?.exchange_rate ?? 0))}` },
                ]}
                outputLabel="Net Amount In Rwf"
                outputValue={`$${formatNumber(calculatedValues.net_amount * (financialForm?.exchange_rate ?? 0))}`}
              />
            </div>
          </div>
      </motion.div>
  )
}