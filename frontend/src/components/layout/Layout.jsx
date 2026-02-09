import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from '../Common/Navbar';

const Layout = ({ links = [] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  /* navigate removed */

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Init state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className={`flex flex-col min-h-screen font-sans text-foreground overflow-x-hidden ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Top Navbar */}
      <div className="z-50">
        <Navbar 
          links={links} 
          showLogout={true} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <div className="flex flex-1 pt-[80px]">
        {/* Unified Sidebar */}
        <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            links={links}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full relative transition-all duration-300 bg-gray-50/50 min-h-[calc(100vh-80px)]">
            <AnimatePresence mode="wait">
                <Outlet />
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;