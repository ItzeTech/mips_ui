import { CircleStackIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from 'react'
import { contentVariants } from '../../../../../utils/util'
import RenderInput from '../../common/RenderInput'
import { LabFormData } from '../../../../../features/minerals/tantalumSlice'
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
            <CircleStackIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.internal_analysis', 'Internal Analysis')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <RenderInput
                label={t('tantalum.internal_ta2o5', 'Internal Ta2O5')}
                value={labForm.internal_ta2o5}
                onChange={(value) => setLabForm(prev => ({ ...prev, internal_ta2o5: value }))}
                type="number"
                suffix="%"
                field="internal_ta2o5"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tantalum.internal_nb2o5', 'Internal Nb2O5')}
                value={labForm.internal_nb2o5}
                onChange={(value) => setLabForm(prev => ({ ...prev, internal_nb2o5: value }))}
                type="number"
                suffix="%"
                field="internal_nb2o5"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tantalum.nb_percentage', 'Nb %')}
                value={labForm.nb_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, nb_percentage: value }))}
                type="number"
                suffix="%"
                field="nb_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tantalum.sn_percentage', 'Sn %')}
                value={labForm.sn_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, sn_percentage: value }))}
                type="number"
                suffix="%"
                field="sn_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tantalum.fe_percentage', 'Fe %')}
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
                label={t('tantalum.w_percentage', 'W %')}
                value={labForm.w_percentage}
                onChange={(value) => setLabForm(prev => ({ ...prev, w_percentage: value }))}
                type="number"
                suffix="%"
                field="w_percentage"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />
            </div>

        </div>
        
        {/* Alex Stewart Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ArrowPathIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.alex_stewart_analysis', 'Alex Stewart Analysis')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
            <RenderInput
                label={t('tantalum.alex_stewart_ta2o5', 'Alex Stewart Ta2O5')}
                value={labForm.alex_stewart_ta2o5}
                onChange={(value) =>
                setLabForm((prev) => ({ ...prev, alex_stewart_ta2o5: value }))
                }
                type="number"
                suffix="%"
                field="alex_stewart_ta2o5"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />

            <RenderInput
                label={t('tantalum.alex_stewart_nb2o5', 'Alex Stewart Nb2O5')}
                value={labForm.alex_stewart_nb2o5}
                onChange={(value) =>
                setLabForm((prev) => ({ ...prev, alex_stewart_nb2o5: value }))
                }
                type="number"
                suffix="%"
                field="alex_stewart_nb2o5"
                errors={errors}
                canHaveZero={true}
                disabled={isLabDisabled}
            />
            </div>
        </div>
    </motion.div>
  )
}
