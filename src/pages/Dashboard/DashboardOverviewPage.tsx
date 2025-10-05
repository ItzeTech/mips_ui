import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  FiDatabase, 
  FiDollarSign, 
  FiPackage, 
  FiFilter, 
  FiArrowUp, 
  FiArrowDown,
  FiPieChart,
  FiGrid,
  FiTrendingUp
} from 'react-icons/fi';
import IconWrapper from '../../components/common/IconWrapper';
import axiosInstance from '../../config/axiosInstance';

// Define types for the API response
interface MineralStats {
  total_weight_instock: number;
  weight_instock_and_paid: number;
  weight_instock_and_invoiced: number;
  weight_unpaid: number;
  weight_exported: number;
  count_instock: number;
  count_paid: number;
  count_invoiced: number;
  count_unpaid: number;
  count_exported: number;
}

interface DashboardData {
  tantalum: MineralStats;
  tin: MineralStats;
  tungsten: MineralStats;
  total_advance_amount: number;
  advance_count: number;
  total_minerals_count: number;
  total_minerals_weight: number;
  total_exported_count: number;
  total_exported_weight: number;
}

// Updated MineralData interface
interface MineralData {
  id: string;
  type: string;
  totalWeight: number;
  paidWeight: number;
  invoicedWeight: number;
  unpaidWeight: number;
  exportedWeight: number;
  count: number;
  paidCount: number;
  invoicedCount: number;
  unpaidCount: number;
  exportedCount: number;
}

interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  subtext: string | null;
  icon: React.ReactNode;
  color: string;
}

interface ChartDataItem {
  type: string;
  weight: number;
}

const MineralsDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filterMineralType, setFilterMineralType] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('weight');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance.get('/dashboard/stats');
        if (response.data && response.data.data) {
          setDashboardData(response.data.data);
          controls.start('visible');
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [controls]);

  // Create a mineralsData array for table display
  const mineralsData = useMemo<MineralData[]>(() => {
    if (!dashboardData) return [];
    
    const minerals: MineralData[] = [];
    
    // Tantalum data
    minerals.push({
      id: 'tantalum',
      type: 'TANTALUM',
      totalWeight: dashboardData.tantalum.total_weight_instock,
      paidWeight: dashboardData.tantalum.weight_instock_and_paid,
      invoicedWeight: dashboardData.tantalum.weight_instock_and_invoiced,
      unpaidWeight: dashboardData.tantalum.weight_unpaid,
      exportedWeight: dashboardData.tantalum.weight_exported,
      count: dashboardData.tantalum.count_instock,
      paidCount: dashboardData.tantalum.count_paid,
      invoicedCount: dashboardData.tantalum.count_invoiced,
      unpaidCount: dashboardData.tantalum.count_unpaid,
      exportedCount: dashboardData.tantalum.count_exported
    });
    
    // Tin data
    minerals.push({
      id: 'tin',
      type: 'TIN',
      totalWeight: dashboardData.tin.total_weight_instock,
      paidWeight: dashboardData.tin.weight_instock_and_paid,
      invoicedWeight: dashboardData.tin.weight_instock_and_invoiced,
      unpaidWeight: dashboardData.tin.weight_unpaid,
      exportedWeight: dashboardData.tin.weight_exported,
      count: dashboardData.tin.count_instock,
      paidCount: dashboardData.tin.count_paid,
      invoicedCount: dashboardData.tin.count_invoiced,
      unpaidCount: dashboardData.tin.count_unpaid,
      exportedCount: dashboardData.tin.count_exported
    });
    
    // Tungsten data
    minerals.push({
      id: 'tungsten',
      type: 'TUNGSTEN',
      totalWeight: dashboardData.tungsten.total_weight_instock,
      paidWeight: dashboardData.tungsten.weight_instock_and_paid,
      invoicedWeight: dashboardData.tungsten.weight_instock_and_invoiced,
      unpaidWeight: dashboardData.tungsten.weight_unpaid,
      exportedWeight: dashboardData.tungsten.weight_exported,
      count: dashboardData.tungsten.count_instock,
      paidCount: dashboardData.tungsten.count_paid,
      invoicedCount: dashboardData.tungsten.count_invoiced,
      unpaidCount: dashboardData.tungsten.count_unpaid,
      exportedCount: dashboardData.tungsten.count_exported
    });
    
    return minerals;
  }, [dashboardData]);

  // Filtered and sorted minerals
  const filteredMinerals = useMemo(() => {
    let result = [...mineralsData];
    
    if (filterMineralType) {
      result = result.filter(mineral => mineral.type === filterMineralType);
    }
    
    result.sort((a, b) => {
      if (sortField === 'type') {
        return sortDirection === 'asc' 
          ? a.type.localeCompare(b.type) 
          : b.type.localeCompare(a.type);
      } else if (sortField === 'weight') {
        return sortDirection === 'asc' 
          ? a.totalWeight - b.totalWeight 
          : b.totalWeight - a.totalWeight;
      } else if (sortField === 'count') {
        return sortDirection === 'asc' 
          ? a.count - b.count 
          : b.count - a.count;
      }
      return 0;
    });
    
    return result;
  }, [filterMineralType, sortField, sortDirection, mineralsData]);

  // Toggle sort direction or change sort field
  const handleSort = (field: string): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get color based on mineral type
  const getMineralColor = (type: string): string => {
    switch (type) {
      case 'TANTALUM':
        return 'bg-blue-500';
      case 'TIN':
        return 'bg-amber-500';
      case 'TUNGSTEN':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get color based on mineral type for badges
  const getMineralBadgeColor = (type: string): string => {
    switch (type) {
      case 'TANTALUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'TIN':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      case 'TUNGSTEN':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const translateMineral = (type: string) => {
    switch (type) {
      case 'TANTALUM':
        return t('sidebar.menu.tantalum');
      case 'TIN':
        return t('sidebar.menu.tin');
      case 'TUNGSTEN':
        return t('sidebar.menu.tungsten');
      default:
        return type;
    }
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  // Tab variants
  const tabVariants = {
    inactive: { opacity: 0.7, y: 0 },
    active: { opacity: 1, y: 0, color: "rgb(79, 70, 229)" }
  };

  // Prepare data for stat cards
  // Prepare data for stat cards
const statsData = useMemo<StatCardData[]>(() => {
  if (!dashboardData) return [];
  
  return [
    { 
      id: 'total_minerals', 
      label: t('dashboard.total_minerals'), 
      value: dashboardData.total_minerals_count,
      subtext: `${t('dashboard.in_stock')}`,
      icon: <IconWrapper Icon={FiPackage} />, 
      color: 'bg-indigo-500' 
    },
    { 
      id: 'total_weight', 
      label: t('dashboard.total_weight'), 
      value: `${dashboardData.total_minerals_weight.toFixed(2)} kg`,
      subtext: null,
      icon: <IconWrapper Icon={FiDatabase} />, 
      color: 'bg-blue-500' 
    },
    { 
      id: 'total_exported', 
      label: t('dashboard.exported_minerals'), 
      value: dashboardData.total_exported_count,
      subtext: `${dashboardData.total_exported_weight.toFixed(2)} kg`,
      icon: <IconWrapper Icon={FiTrendingUp} />, 
      color: 'bg-purple-500' 
    },
    { 
      id: 'advance_amount', 
      label: t('dashboard.total_advance'), 
      value: `$${dashboardData.total_advance_amount.toFixed(2)}`,
      subtext: `${dashboardData.advance_count} ${t('dashboard.payments')}`,
      icon: <IconWrapper Icon={FiDollarSign} />, 
      color: 'bg-green-500' 
    }
  ];
}, [dashboardData, t]);

  // Render stat cards
  const renderStatCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                  </div>
                  {stat.subtext && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.subtext}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render minerals table
  const renderMineralsTable = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('dashboard.minerals_inventory')}</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 pr-8 appearance-none"
                  value={filterMineralType || ""}
                  onChange={(e) => setFilterMineralType(e.target.value ? e.target.value : null)}
                >
                  <option value="">{t('dashboard.all_minerals')}</option>
                  <option value="TANTALUM">{t('dashboard.tantalum')}</option>
                  <option value="TIN">{t('dashboard.tin')}</option>
                  <option value="TUNGSTEN">{t('dashboard.tungsten')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <IconWrapper Icon={FiFilter} className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      {t('dashboard.mineral_type')}
                      {sortField === 'type' && (
                        sortDirection === 'asc' 
                          ? <IconWrapper Icon={FiArrowUp} className="ml-1 h-4 w-4" />
                          : <IconWrapper Icon={FiArrowDown} className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('weight')}
                  >
                    <div className="flex items-center">
                      {t('dashboard.total_weight')}
                      {sortField === 'weight' && (
                        sortDirection === 'asc' 
                          ? <IconWrapper Icon={FiArrowUp} className="ml-1 h-4 w-4" />
                          : <IconWrapper Icon={FiArrowDown} className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {t('dashboard.weight_breakdown')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('count')}
                  >
                    <div className="flex items-center">
                      {t('dashboard.items_count')}
                      {sortField === 'count' && (
                        sortDirection === 'asc' 
                          ? <IconWrapper Icon={FiArrowUp} className="ml-1 h-4 w-4" />
                          : <IconWrapper Icon={FiArrowDown} className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredMinerals.map((mineral, index) => (
                    <motion.tr 
                      key={mineral.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMineralBadgeColor(mineral.type)}`}>
                          {translateMineral(mineral.type).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <IconWrapper Icon={FiDatabase} className="mr-2 h-4 w-4 text-gray-400" />
                          {mineral.totalWeight.toFixed(2)} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-gray-600 dark:text-gray-400 mr-1">{t('dashboard.paid')}:</span>
                            <span className="font-medium">{mineral.paidWeight.toFixed(2)} kg</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            <span className="text-gray-600 dark:text-gray-400 mr-1">{t('dashboard.invoiced')}:</span>
                            <span className="font-medium">{mineral.invoicedWeight.toFixed(2)} kg</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            <span className="text-gray-600 dark:text-gray-400 mr-1">{t('dashboard.unpaid')}:</span>
                            <span className="font-medium">{mineral.unpaidWeight.toFixed(2)} kg</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                            <span className="text-gray-600 dark:text-gray-400 mr-1">{t('dashboard.exported')}:</span>
                            <span className="font-medium">{mineral.exportedWeight.toFixed(2)} kg</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <IconWrapper Icon={FiPackage} className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="font-medium">{mineral.count}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({mineral.paidCount}/{mineral.invoicedCount}/{mineral.unpaidCount}/{mineral.exportedCount})
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="font-medium mr-2">{t('dashboard.item_count_legend')}:</span>
            <span className="mr-1">(</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              {t('dashboard.paid')}
            </span>
            <span className="mx-1">/</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
              {t('dashboard.invoiced')}
            </span>
            <span className="mx-1">/</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              {t('dashboard.unpaid')}
            </span>
            <span className="ml-1">/</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
              {t('dashboard.exported')}
            </span>
            <span className="ml-1">)</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render detailed minerals cards
  const renderDetailedMineralsCards = () => {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {mineralsData.map((mineral, index) => (
          <motion.div
            key={mineral.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 ${getMineralColor(mineral.type)} rounded-lg flex items-center justify-center text-white`}>
                  <IconWrapper Icon={FiDatabase} className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{translateMineral(mineral.type).toUpperCase()}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dashboard.weight_breakdown')}</h4>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.total')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.totalWeight.toFixed(2)} kg</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <div className="text-xs text-green-600 dark:text-green-400">{t('dashboard.paid')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.paidWeight.toFixed(2)} kg</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                      <div className="text-xs text-amber-600 dark:text-amber-400">{t('dashboard.invoiced')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.invoicedWeight.toFixed(2)} kg</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <div className="text-xs text-red-600 dark:text-red-400">{t('dashboard.unpaid')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.unpaidWeight.toFixed(2)} kg</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                      <div className="text-xs text-purple-600 dark:text-purple-400">{t('dashboard.exported')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.exportedWeight.toFixed(2)} kg</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dashboard.count_breakdown')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.total')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.count}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <div className="text-xs text-red-600 dark:text-red-400">{t('dashboard.unpaid')}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{mineral.unpaidCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Chart data
  const getChartSection = () => {
    if (!dashboardData) return null;
    
    // Prepare data for charts
    const mineralDistributionData: ChartDataItem[] = [
      { type: 'TANTALUM', weight: dashboardData.tantalum.total_weight_instock },
      { type: 'TIN', weight: dashboardData.tin.total_weight_instock },
      { type: 'TUNGSTEN', weight: dashboardData.tungsten.total_weight_instock }
    ];
    
    // Calculate max values for scale
    const maxWeight = Math.max(
      ...mineralDistributionData.map(item => item.weight)
    );
    
    return (
      <>
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mineral Weight Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                <IconWrapper Icon={FiPieChart} className="mr-2" />
                {t('dashboard.mineral_distribution')}
              </h3>
              <div className="h-60 flex items-center justify-center">
                <div className="flex space-x-8">
                  {mineralDistributionData.map((item, idx) => {
                    const scale = maxWeight > 0 ? item.weight / maxWeight : 0;
                    return (
                      <div key={item.type} className="flex flex-col items-center">
                        <div className="relative w-16 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <motion.div 
                            initial={{ height: '0%' }}
                            animate={{ height: `${scale * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                            className={`absolute bottom-0 w-full ${getMineralColor(item.type)}`}
                          ></motion.div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{translateMineral(item.type).toUpperCase()}</div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.weight.toFixed(2)} kg</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {(scale * 100).toFixed(0)}% {t('dashboard.of_max')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Mineral Counts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                <IconWrapper Icon={FiGrid} className="mr-2" />
                {t('dashboard.minerals_count')}
              </h3>
              <div className="h-60 flex items-center justify-center">
                <div className="flex space-x-8">
                  {mineralsData.map((mineral, idx) => {
                    const maxCount = Math.max(...mineralsData.map(m => m.count));
                    const scale = maxCount > 0 ? mineral.count / maxCount : 0;
                    return (
                      <div key={mineral.type} className="flex flex-col items-center">
                        <div className="relative w-16 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <motion.div 
                            initial={{ height: '0%' }}
                            animate={{ height: `${scale * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                            className={`absolute bottom-0 w-full ${getMineralColor(mineral.type)}`}
                          ></motion.div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{translateMineral(mineral.type).toUpperCase()}</div>
                        <div className="font-medium text-gray-900 dark:text-white">{mineral.count}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {(scale * 100).toFixed(0)}% {t('dashboard.of_total')}
                        </div>
                      </div>                    
                      );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Exported Weight Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                <IconWrapper Icon={FiTrendingUp} className="mr-2" />
                {t('dashboard.exported_comparison')}
              </h3>
              <div className="h-60 flex items-center justify-center">
                <div className="flex space-x-8">
                  {mineralsData.map((mineral, idx) => {
                    // Calculate ratio of exported vs total (including exported)
                    const totalWithExported = mineral.totalWeight + mineral.exportedWeight;
                    const exportedRatio = totalWithExported > 0 
                      ? mineral.exportedWeight / totalWithExported 
                      : 0;
                    
                    return (
                      <div key={mineral.id} className="flex flex-col items-center">
                        <div className="relative w-16 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <motion.div 
                            initial={{ height: '0%' }}
                            animate={{ height: `${exportedRatio * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`absolute bottom-0 w-full ${getMineralColor(mineral.type)}`}
                          ></motion.div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{translateMineral(mineral.type).toUpperCase()}</div>
                        <div className="font-medium text-gray-900 dark:text-white">{mineral.exportedWeight.toFixed(2)} kg</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {(exportedRatio * 100).toFixed(0)}% {t('dashboard.of_total')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Mineral breakdown cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
            <IconWrapper Icon={FiTrendingUp} className="mr-2" />
            {t('dashboard.detailed_breakdown')}
          </h3>
          {renderDetailedMineralsCards()}
        </motion.div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <svg className="mx-auto h-12 w-12 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">{t('dashboard.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t('dashboard.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.minerals_dashboard')}
          </h1>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <motion.button
              variants={tabVariants}
              animate={activeTab === 'overview' ? 'active' : 'inactive'}
              whileHover={{ opacity: 1 }}
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === 'overview' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              {t('dashboard.overview')}
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeTab === 'analytics' ? 'active' : 'inactive'}
              whileHover={{ opacity: 1 }}
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === 'analytics' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              {t('dashboard.analytics')}
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStatCards()}
              {renderMineralsTable()}
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStatCards()}
              {getChartSection()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MineralsDashboardPage;