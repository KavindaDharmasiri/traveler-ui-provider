import React, { useState, useEffect, useCallback } from 'react';
import { handleAuthFromURL, checkAuth, startAuthMonitor } from './utils/authHandler';

// Import Layout Components - Added .jsx extension for explicit resolution
import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Header.jsx';

// Import Page Components - Added .jsx extension for explicit resolution
import Dashboard from './pages/Dashboard.jsx';
import MyServices from './pages/MyServices.jsx';
import AddItem from './pages/AddItem.jsx';
import ReceivedOrders from './pages/ReceivedOrders.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './components/Layout/Settings.jsx';

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editItemId, setEditItemId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Enhanced setCurrentPage to handle item ID for editing
  const handleSetCurrentPage = useCallback((page, itemId = null) => {
    setCurrentPage(page);
    setEditItemId(itemId);
  }, []);

  // Set the current page based on state to ensure re-render
  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <ReceivedOrders />;
      case 'add':
        return <AddItem setCurrentPage={handleSetCurrentPage} editItemId={editItemId} />;
      case 'services':
        return <MyServices setCurrentPage={handleSetCurrentPage} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }, [currentPage, editItemId, handleSetCurrentPage]);

  // Handle auth and page state persistence
  useEffect(() => {
    const authData = handleAuthFromURL();
    if (!authData) {
      checkAuth();
    }
    
    startAuthMonitor();
    
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);


  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleSetCurrentPage}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderPage()}
        </main>
      </div>

      {/* Custom styles for scrollbar and animation (can be moved to a CSS file in a full project) */}
      <style>{`
        /* Using global styles for custom scrollbar, which Tailwind doesn't easily support */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        /* Animation classes for visual fidelity to original */
        .animate-on-scroll {
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          transform: translateY(20px);
        }
        .animate-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default App;