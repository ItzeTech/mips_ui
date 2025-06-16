import { motion } from "framer-motion";

const LoadingSkeleton: React.FC = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-blue-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
                <div>
                  <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="h-12 w-36 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-2xl animate-pulse"></div>
            </div>
          </div>
  
          {/* Search and Stats Skeleton */}
          <div className="mb-8">
            <div className="h-16 w-full bg-white/80 dark:bg-gray-800/80 rounded-2xl animate-pulse mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-white/80 dark:bg-gray-800/80 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
  
          {/* Table Skeleton */}
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl overflow-hidden">
            <div className="p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-2xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-xl animate-pulse"></div>
                    <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-xl animate-pulse"></div>
                    <div className="w-8 h-8 bg-amber-200 dark:bg-amber-800 rounded-xl animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default LoadingSkeleton;