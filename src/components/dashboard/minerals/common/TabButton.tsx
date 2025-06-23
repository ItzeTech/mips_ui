// components/common/TabButton.tsx
import React from 'react'
import { motion } from 'framer-motion'

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hasChanges?: boolean
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label, hasChanges }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl flex items-center transition-all duration-200 ${
        isActive
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium shadow-md'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      {label}
      {hasChanges && (
        <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full"></span>
      )}
    </motion.button>
  )
}

export default TabButton
