import { BeakerIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import React from 'react'
import { contentVariants } from '../../../../../../utils/util'
import RenderInput from '../../common/RenderInput'
import { LabFormData } from '../../../../../../features/minerals/tantalumSlice'
import { useTranslation } from 'react-i18next'


interface LabTabInterface {
    labForm: LabFormData;
    setLabForm: React.Dispatch<React.SetStateAction<LabFormData>>;
    errors?: Record<string, string>
}

export default function LabTab({labForm, setLabForm, errors={}}: LabTabInterface) {
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
            <BeakerIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.internal_analysis', 'Internal Analysis')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {RenderInput(
            t('tantalum.internal_ta2o5', 'Internal Ta2O5'),
            labForm.internal_ta2o5,
            (value) => setLabForm(prev => ({ ...prev, internal_ta2o5: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.internal_nb2o5', 'Internal Nb2O5'),
            labForm.internal_nb2o5,
            (value) => setLabForm(prev => ({ ...prev, internal_nb2o5: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.nb_percentage', 'Nb %'),
            labForm.nb_percentage,
            (value) => setLabForm(prev => ({ ...prev, nb_percentage: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.sn_percentage', 'Sn %'),
            labForm.sn_percentage,
            (value) => setLabForm(prev => ({ ...prev, sn_percentage: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.fe_percentage', 'Fe %'),
            labForm.fe_percentage,
            (value) => setLabForm(prev => ({ ...prev, fe_percentage: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.w_percentage', 'W %'),
            labForm.w_percentage,
            (value) => setLabForm(prev => ({ ...prev, w_percentage: value })),
            'number',
            '%'
            )}
        </div>
        </div>
        
        {/* Alex Stewart Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ArrowPathIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.alex_stewart_analysis', 'Alex Stewart Analysis')}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
            {RenderInput(
            t('tantalum.alex_stewart_ta2o5', 'Alex Stewart Ta2O5'),
            labForm.alex_stewart_ta2o5,
            (value) => setLabForm(prev => ({ ...prev, alex_stewart_ta2o5: value })),
            'number',
            '%'
            )}
            {RenderInput(
            t('tantalum.alex_stewart_nb2o5', 'Alex Stewart Nb2O5'),
            labForm.alex_stewart_nb2o5,
            (value) => setLabForm(prev => ({ ...prev, alex_stewart_nb2o5: value })),
            'number',
            '%'
            )}
        </div>
        </div>
    </motion.div>
  )
}
