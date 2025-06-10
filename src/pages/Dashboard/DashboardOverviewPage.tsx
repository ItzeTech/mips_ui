import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiClock, FiCalendar, FiPieChart, FiActivity, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import IconWrapper from '../../components/common/IconWrapper';

// Mock data for demonstration
const projectsData = [
  { id: 1, name: 'Project Alpha', status: 'In Progress', progress: 75, lastUpdated: '2025-06-09', team: 'Frontend', priority: 'High' },
  { id: 2, name: 'Project Beta', status: 'Completed', progress: 100, lastUpdated: '2025-06-08', team: 'Backend', priority: 'Medium' },
  { id: 3, name: 'Project Gamma', status: 'Planning', progress: 15, lastUpdated: '2025-06-07', team: 'Design', priority: 'Low' },
  { id: 4, name: 'Project Delta', status: 'In Progress', progress: 45, lastUpdated: '2025-06-06', team: 'QA', priority: 'High' },
  { id: 5, name: 'Project Epsilon', status: 'On Hold', progress: 60, lastUpdated: '2025-06-05', team: 'DevOps', priority: 'Medium' },
];

// Mock stat data
const statsData = [
  { id: 'active_projects', label: 'Active Projects', value: 8, change: '+14%', icon: <IconWrapper Icon={FiActivity} />, color: 'bg-blue-500' },
  { id: 'team_members', label: 'Team Members', value: 24, change: '+2', icon: <IconWrapper Icon={FiUsers} />, color: 'bg-purple-500' },
  { id: 'completion_rate', label: 'Completion Rate', value: '72%', change: '+5%', icon: <IconWrapper Icon={FiCheckCircle} />, color: 'bg-green-500' },
  { id: 'avg_time', label: 'Avg. Completion Time', value: '12 days', change: '-2d', icon: <IconWrapper Icon={FiClock}/>, color: 'bg-amber-500' },
];

const DashboardOverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      controls.start('visible');
    }, 800);
    return () => clearTimeout(timer);
  }, [controls]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projectsData];
    
    if (filterStatus) {
      result = result.filter(project => project.status === filterStatus);
    }
    
    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'progress') {
        return sortDirection === 'asc' 
          ? a.progress - b.progress 
          : b.progress - a.progress;
      } else if (sortField === 'lastUpdated') {
        return sortDirection === 'asc' 
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime() 
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      return 0;
    });
    
    return result;
  }, [filterStatus, sortField, sortDirection]);

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Progress bar variants
  const progressVariants = {
    hidden: { width: 0 },
    visible: (progress: number) => ({
      width: `${progress}%`,
      transition: { duration: 1, delay: 0.2, ease: "easeOut" }
    })
  };

  // Status badge styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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

  // Render stat cards
  const renderStatCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
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
                    <span className={`ml-2 text-xs font-medium ${
                      stat.change.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render projects table
  const renderProjectsTable = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('projects')}</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 pr-8 appearance-none"
                  value={filterStatus || ""}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">{t('all_statuses')}</option>
                  <option value="In Progress">{t('in_progress')}</option>
                  <option value="Completed">{t('completed')}</option>
                  <option value="Planning">{t('planning')}</option>
                  <option value="On Hold">{t('on_hold')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {/* <FiFilter className="h-4 w-4 text-gray-400" /> */}
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      {t('project_name')}
                      {sortField === 'name' && (
                        sortDirection === 'asc' 
                          ? <IconWrapper Icon={FiArrowUp} className="ml-1 h-4 w-4" />
                          : <IconWrapper Icon={FiArrowDown} className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('progress')}
                  >
                    <div className="flex items-center">
                      {t('progress')}
                      {sortField === 'progress' && (
                        sortDirection === 'asc' 
                          ? <IconWrapper Icon={FiArrowUp} className="ml-1 h-4 w-4" />
                          : <IconWrapper Icon={FiArrowDown} className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastUpdated')}
                  >
                    <div className="flex items-center">
                      {t('last_updated')}
                      {sortField === 'lastUpdated' && (
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
                  {filteredProjects.map((project, index) => (
                    <motion.tr 
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-1">
                          <motion.div
                            custom={project.progress}
                            initial="hidden"
                            animate="visible"
                            variants={progressVariants}
                            className={`h-2.5 rounded-full ${
                              project.progress >= 100
                                ? 'bg-green-600'
                                : project.progress > 60
                                ? 'bg-blue-600'
                                : project.progress > 30
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <div className="text-xs text-right">{project.progress}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          {/* <FiCalendar className="mr-2 h-4 w-4 text-gray-400" /> */}
                          <IconWrapper Icon={FiCalendar} className="mr-2 h-4 w-4 text-gray-400" />
                          {new Date(project.lastUpdated).toLocaleDateString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  // Chart data (simplified mock)
  const getChartSection = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              {/* <FiPieChart className="mr-2" /> */}
              <IconWrapper Icon={FiPieChart} className="mr-2" />
              {t('project_status_distribution')}
            </h3>
            <div className="h-60 flex items-center justify-center">
              <div className="flex space-x-8">
                {['In Progress', 'Completed', 'Planning', 'On Hold'].map((status, idx) => {
                  const count = projectsData.filter(p => p.status === status).length;
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
                  return (
                    <motion.div 
                      key={status}
                      initial={{ height: 0 }}
                      animate={{ height: `${count * 40}px` }}
                      transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                      className="relative w-16 flex flex-col items-center"
                    >
                      <div className={`w-full rounded-t-lg ${colors[idx]}`} style={{ flexGrow: 1 }}></div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{status}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{count}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              {/* <FiTrendingUp className="mr-2" /> */}
              <IconWrapper Icon={FiTrendingUp} className="mr-2" />
              {t('completion_trend')}
            </h3>
            <div className="h-60 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <motion.path
                  d="M 0,200 L 40,180 L 80,190 L 120,170 L 160,150 L 200,130 L 240,110 L 280,90 L 320,80 L 360,70 L 400,60"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
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
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">{t('loading_dashboard')}</p>
        </motion.div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
          
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
              {t('overview')}
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
              {t('analytics')}
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
              {renderProjectsTable()}
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


export default DashboardOverviewPage;