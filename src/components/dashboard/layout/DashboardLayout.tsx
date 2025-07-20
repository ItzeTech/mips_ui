// DashboardLayoutWithOutlet.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoutDialog from './LogoutDialog';

export const DashboardLayoutWithOutlet: React.FC = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // Default to collapsed on mobile
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const navigate = useNavigate();

    // Handle responsive sidebar behavior
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setSidebarExpanded(true); // Expand on desktop
        } else {
          setSidebarExpanded(false); // Collapse on mobile
        }
      };

      // Set initial state
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        // Here you would typically call your logout API
        console.log('Logging out...');
        // Navigate to login page
        setTimeout(() => {
        navigate('/login');
        }, 500);
    };
    
    const toggleSidebar = () => {
      setSidebarExpanded(!sidebarExpanded);
    };

    // Close sidebar when clicking outside on mobile
    const handleMainClick = () => {
      if (window.innerWidth < 768 && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    };
  
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
        
        <motion.div
          className="flex-1 flex flex-col overflow-hidden w-full md:w-auto"
          animate={{ 
            marginLeft: window.innerWidth >= 768 ? (sidebarExpanded ? '0px' : '0px') : '0px'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <TopBar 
            sidebarExpanded={sidebarExpanded} 
            onLogout={() => setShowLogoutDialog(true)} 
          />
          
          {/* Use Outlet to render nested routes */}
          <main 
            className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900"
            onClick={handleMainClick}
          >
            <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
              <Outlet />
            </div>
          </main>

          <LogoutDialog
            isOpen={showLogoutDialog}
            onClose={() => setShowLogoutDialog(false)}
            onConfirm={handleLogout}
          />
        </motion.div>
      </div>
    );
};