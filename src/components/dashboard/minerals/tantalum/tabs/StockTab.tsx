import { ScaleIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { StockFormData } from '../../../../../features/minerals/tantalumSlice';
import RenderSelect from '../../common/RenderSelect';
import RenderInput from '../../common/RenderInput';
import { useTranslation } from 'react-i18next';
import { contentVariants, formatDate, STOCK_STATUS_OPTIONS } from '../../../../../utils/util';

  
interface StockTabInterface {
    stockForm: StockFormData;
    setStockForm: React.Dispatch<React.SetStateAction<StockFormData>>;
    errors?: Record<string, string>
}

export default function StockTab({stockForm, setStockForm, errors = {}}: StockTabInterface) {

  const { t } = useTranslation();
  return (
    <motion.div
        key="stock"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
    >
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ScaleIcon className="w-5 h-5 mr-2 text-indigo-500" />
            {t('tantalum.stock_information', 'Stock Information')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RenderInput
                label={t('tantalum.net_weight', 'Net Weight (kg)')}
                value={stockForm.net_weight}
                onChange={(value) => setStockForm((prev) => ({ ...prev, net_weight: value }))}
                type="number"
                suffix="kg"
                field="net_weight"
                errors={errors}
            />

            <RenderInput
                label={t('tantalum.date_of_sampling', 'Date of Sampling')}
                value={formatDate(stockForm.date_of_sampling)}
                onChange={(value) => setStockForm((prev) => ({ ...prev, date_of_sampling: value }))}
                type="date"
                field="date_of_sampling"
                errors={errors}
            />

            <RenderInput
                label={t('tantalum.date_of_delivery', 'Date of Delivery')}
                value={formatDate(stockForm?.date_of_delivery ? stockForm?.date_of_delivery : '')}
                onChange={(value) => setStockForm((prev) => ({ ...prev, date_of_delivery: value }))}
                type="date"
                field="date_of_delivery"
                errors={errors}
            />

            <RenderSelect
                label={t('tantalum.stock_status_label', 'Stock Status')}
                value={stockForm.stock_status}
                onChange={(value) => setStockForm(prev => ({ ...prev, stock_status: value }))}
                options={STOCK_STATUS_OPTIONS}
                field='stock_status_label'
                errors={errors}
            />
        </div>
        </div>
    </motion.div>
  )
}
