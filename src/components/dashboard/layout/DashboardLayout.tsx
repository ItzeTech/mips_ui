import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoutDialog from './LogoutDialog';

export const  DashboardLayoutWithOutlet: React.FC = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const navigate = useNavigate();

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
  
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
        
        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          animate={{ 
            marginLeft: sidebarExpanded ? '0px' : '0px',
            width: sidebarExpanded ? 'calc(100% - 260px)' : 'calc(100% - 80px)'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <TopBar 
            sidebarExpanded={sidebarExpanded} 
            onLogout={() => setShowLogoutDialog(true)} 
          />
          
          {/* Use Outlet to render nested routes */}
          <main className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
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

  