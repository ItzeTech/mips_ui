// components/dashboard/minerals/tungsten/tabs/LabTab.tsx
import { RectangleGroupIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from 'react'
import { contentVariants } from '../../../../../utils/util'
import RenderInput from '../../common/RenderInput'
import { LabFormData } from '../../../../../features/minerals/tungstenSlice'
import { useTranslation } from 'react-i18next'


interface LabTabInterface {
    labForm: LabFormData;
    setLabForm: React.Dispatch<React.SetStateAction<LabFormData>>;
    errors?: Record<string, string>;
    isLabDisabled?: boolean;
}

export default function LabTab({labForm, setLabForm, errors={}, isLabDisabled}: LabTabInterface) {
    const { t } = useTranslation();
  return (
    <motion.div
        key="lab"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
    >
        {/* Internal Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <RectangleGroupIcon className="w-5 h-5 mr-2 text-emerald-500" />
            {t('tungsten.internal_analysis', 'Internal Analysis')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <RenderInput
                label={t('tungsten.wo3_percentage', 'WO3 %')}
                value={labForm.wo3_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, wo3_percentage: value }))}
                type="number"
                suffix="%"
                field="wo3_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tungsten.w_percentage', 'W %')}
                value={labForm.w_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, w_percentage: value }))}
                type="number"
                suffix="%"
                field="w_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tungsten.fe_percentage', 'Fe %')}
                value={labForm.fe_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, fe_percentage: value }))}
                type="number"
                suffix="%"
                field="fe_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tungsten.bal_percentage', 'Bal %')}
                value={labForm.bal_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, bal_percentage: value }))}
                type="number"
                suffix="%"
                field="bal_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />
        </div>
        </div>
        
        {/* Alex Stewart Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ArrowPathIcon className="w-5 h-5 mr-2 text-emerald-500" />
            {t('tungsten.alex_stewart_analysis', 'Alex Stewart Analysis')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
            <RenderInput
                label={t('tungsten.alex_stewart_wo3_percentage', 'Alex Stewart WO3 %')}
                value={labForm.alex_stewart_wo3_percentage}
                onChange={(value) =>
                setLabForm((prev) => ({ ...prev, alex_stewart_wo3_percentage: value }))
                }
                type="number"
                suffix="%"
                field="alex_stewart_wo3_percentage"
                errors={errors}
                disabled={isLabDisabled}
            />
        </div>
        </div>
    </motion.div>
  )
}