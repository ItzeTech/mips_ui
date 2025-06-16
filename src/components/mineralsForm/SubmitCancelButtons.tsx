// components/SubmitCancelButtons.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SubmitCancelButtonsProps {
  loading: boolean;
  onCancel: () => void;
  submitLabel?: string;
  creating: string;
  create: string;
  cancel: string;

}

const SubmitCancelButtons: React.FC<SubmitCancelButtonsProps> = ({
  loading,
  onCancel,
  submitLabel = 'Submit',
  creating,
  create,
  cancel

}) => {
  return (
    <motion.div className="flex space-x-3 pt-4">
        <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-2xl transition-colors duration-200"
        >
            {cancel}
        </button>
        <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
            {loading ? (
            <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{creating}</span>
            </>
            ) : (
            <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>{create}</span>
            </>
            )}
        </motion.button>
    </motion.div>
  );
};

export default SubmitCancelButtons;
