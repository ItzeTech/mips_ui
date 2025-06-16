import React from 'react'
import { motion } from 'framer-motion'
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'

interface SaveFormButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
  hasChanges: boolean
  label: string
}

const SaveFormButton: React.FC<SaveFormButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  hasChanges,
  label
}) => {
  return (
    <motion.button
      whileHover={{ scale: hasChanges ? 1.05 : 1 }}
      whileTap={{ scale: hasChanges ? 0.95 : 1 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 font-medium rounded-xl shadow-md transition-all duration-200 flex items-center ${
        hasChanges && !isLoading
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg'
          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
      }`}
    >
      {isLoading ? (
        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CheckIcon className="w-4 h-4 mr-2" />
      )}
      {label}
    </motion.button>
  )
}

export default SaveFormButton
