// components/dashboard/suppliers/SupplierSelector.tsx (if you need to update it)
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../../config/axiosInstance';

interface Supplier {
  id: string;
  name: string;
  phone_number: string;
  company?: string;
}

interface SupplierSelectorProps {
  onSelect: (id: string, name: string) => void;
  selectedSupplierId?: string;
}

const SupplierSelector: React.FC<SupplierSelectorProps> = ({ onSelect, selectedSupplierId }) => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/suppliers');
      const supplierData = Array.isArray(response.data.data?.items) ? response.data.data.items : [];
      setSuppliers(supplierData);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone_number.includes(searchTerm) ||
    (supplier.company && supplier.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsOpen(false);
    setSearchTerm('');
    onSelect(supplier.id, supplier.name);
  };

  return (
    <div className="relative">
      <div
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
          {selectedSupplier ? (
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{selectedSupplier.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSupplier.phone_number}</p>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {t('payments.select_supplier', 'Select a supplier...')}
            </span>
          )}
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('payments.search_suppliers', 'Search suppliers...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">
                  {t('payments.loading', 'Loading...')}
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  {t('payments.no_suppliers_found', 'No suppliers found')}
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    onClick={() => handleSelect(supplier)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.phone_number}</p>
                        {supplier.company && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{supplier.company}</p>
                        )}
                      </div>
                      {selectedSupplier?.id === supplier.id && (
                        <CheckIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplierSelector;