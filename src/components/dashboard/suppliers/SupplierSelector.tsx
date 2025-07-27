// components/dashboard/suppliers/SupplierSelector.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchSuppliers_all, Supplier } from '../../../features/user/suppliersSlice';
import { UserIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SupplierSelectorProps {
  onSelect: (supplierId: string, supplierName: string) => void;
  selectedSupplierId?: string;
}

const SupplierSelector: React.FC<SupplierSelectorProps> = ({ onSelect, selectedSupplierId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  
  const { suppliers_all, status, isFetched } = useSelector((state: RootState) => state.suppliers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Fetch suppliers if not already loaded
  useEffect(() => {
    if (!isFetched && status !== 'loading') {
      dispatch(fetchSuppliers_all());
    }
  }, [dispatch, isFetched, status]);
  
  // Find and set selected supplier when selectedSupplierId changes or suppliers load
  useEffect(() => {
    if (selectedSupplierId && suppliers_all.length > 0) {
      const supplier = suppliers_all.find(s => s.id === selectedSupplierId);
      if (supplier) {
        setSelectedSupplier(supplier);
      }
    }
  }, [selectedSupplierId, suppliers_all]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter suppliers based on search term
  const filteredSuppliers = suppliers_all.filter(supplier => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchTermLower) ||
      supplier.phone_number.includes(searchTerm) ||
      (supplier.company && supplier.company.toLowerCase().includes(searchTermLower))
    );
  });
  
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDropdownOpen(false);
    onSelect(supplier.id, supplier.name);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={selectedSupplier ? selectedSupplier.name : t('advancePayments.select_supplier', 'Select or search supplier')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isDropdownOpen) setIsDropdownOpen(true);
          }}
          onClick={() => setIsDropdownOpen(true)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {status === 'loading' ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              {t('advancePayments.loading_suppliers', 'Loading suppliers...')}
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('advancePayments.no_suppliers_found', 'No suppliers found')}
            </div>
          ) : (
            <ul className="py-1">
              {filteredSuppliers.map((supplier) => (
                <li 
                  key={supplier.id}
                  onClick={() => handleSelectSupplier(supplier)}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                    selectedSupplier?.id === supplier.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {supplier.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.phone_number}
                      {supplier.company && ` • ${supplier.company}`}
                    </div>
                  </div>
                  {selectedSupplier?.id === supplier.id && (
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierSelector;