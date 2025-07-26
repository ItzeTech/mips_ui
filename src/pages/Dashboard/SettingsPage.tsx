// pages/SettingsPage.tsx - with responsive adjustments and translations
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cog6ToothIcon,
  CircleStackIcon,
  CubeIcon,
  RectangleGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import TantalumSettingsForm from '../../components/settings/TantalumSettingsForm';
import TinSettingsForm from '../../components/settings/TinSettingsForm';
import TungstenSettingsForm from '../../components/settings/TungstenSettingsForm';
import GeneralSettingsForm from '../../components/settings/generalSettingsForm';

type ActiveTab = 'general' | 'tantalum' | 'tin' | 'tungsten';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('general');

  const settingsTypes = [
    {
      id: 'general' as ActiveTab,
      name: t('settings.general'),
      icon: BuildingOfficeIcon,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'tantalum' as ActiveTab,
      name: t('settings.tantalum'),
      icon: CircleStackIcon,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800'
    },
    {
      id: 'tin' as ActiveTab,
      name: t('settings.tin'),
      icon: CubeIcon,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'tungsten' as ActiveTab,
      name: t('settings.tungsten'),
      icon: RectangleGroupIcon,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-3 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-4 sm:mb-8"
        >
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl shadow-lg">
              <Cog6ToothIcon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('settings.system_settings')}
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
                {t('settings.manage_system_configurations')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          variants={itemVariants}
          className="mb-4 sm:mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-3xl p-1 sm:p-2 shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {settingsTypes.map((setting) => (
                <motion.button
                  key={setting.id}
                  onClick={() => setActiveTab(setting.id)}
                  className={`relative flex-1 flex items-center justify-center space-x-2 px-2 sm:px-6 py-2 sm:py-4 rounded-lg sm:rounded-2xl text-xs sm:text-base font-semibold transition-all duration-300 ${
                    activeTab === setting.id
                      ? `bg-gradient-to-r ${setting.color} text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <setting.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span className="hidden sm:block">{setting.name}</span>
                  
                  {activeTab === setting.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-lg sm:rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                key="general"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 md:p-8"
              >
                <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg">
                    <BuildingOfficeIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('settings.general_settings')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {t('settings.configure_company_info')}
                    </p>
                  </div>
                </div>
                <GeneralSettingsForm />
              </motion.div>
            )}

            {activeTab === 'tantalum' && (
              <motion.div
                key="tantalum"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 md:p-8"
              >
                <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg">
                    <CircleStackIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('settings.tantalum_settings')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {t('settings.configure_tantalum')}
                    </p>
                  </div>
                </div>
                <TantalumSettingsForm />
              </motion.div>
            )}

            {activeTab === 'tin' && (
              <motion.div
                key="tin"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 md:p-8"
              >
                <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl md:rounded-2xl shadow-lg">
                    <CubeIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('settings.tin_settings')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {t('settings.configure_tin')}
                    </p>
                  </div>
                </div>
                <TinSettingsForm />
              </motion.div>
            )}

            {activeTab === 'tungsten' && (
              <motion.div
                key="tungsten"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4 md:p-8"
              >
                <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl md:rounded-2xl shadow-lg">
                    <RectangleGroupIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {t('settings.tungsten_settings')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {t('settings.configure_tungsten')}
                    </p>
                  </div>
                </div>
                <TungstenSettingsForm />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;