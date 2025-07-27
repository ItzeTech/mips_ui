// components/dashboard/sales/SalesHeader.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  CubeIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface SalesHeaderProps {
  onCreateClick: (mineralType: string) => void;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({ onCreateClick }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('sales.title', 'Sales Management')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {t('sales.subtitle', 'Manage your mineral sales')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button as={motion.button}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span>{t('sales.create_new', 'New Sale')}</span>
                <ChevronDownIcon className="ml-1 sm:ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TANTALUM')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-blue-500" aria-hidden="true" />
                        {t('sales.create_tantalum', 'Tantalum Sale')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TIN')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-amber-500" aria-hidden="true" />
                        {t('sales.create_tin', 'Tin Sale')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-200'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => onCreateClick('TUNGSTEN')}
                      >
                        <CubeIcon className="mr-2 h-5 w-5 text-green-500" aria-hidden="true" />
                        {t('sales.create_tungsten', 'Tungsten Sale')}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default SalesHeader;