import React, { useState, useEffect, useCallback } from "react";
import { handleAuthFromURL, checkAuth, startAuthMonitor } from "./utils/authHandler";

import Sidebar from "./components/Layout/Sidebar.jsx";
import Header from "./components/Layout/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import MyServices from "./pages/MyServices.jsx";
import AddItem from "./pages/AddItem.jsx";
import ReceivedOrders from "./pages/ReceivedOrders.jsx";
import Profile from "./pages/Profile.jsx";
import Wallet from "./pages/Wallet.jsx";
import Ongoing from "./pages/Ongoing.jsx";
import Settings from "./components/Layout/Settings.jsx";

import { NotificationProvider } from "./components/context/NotificationContext.jsx";
import { Routes, Route } from "react-router-dom"; 
import OrderDetailsView from "./pages/OrderDetailsView.jsx";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [editItemId, setEditItemId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSetCurrentPage = useCallback((page, itemId = null) => {
    setCurrentPage(page);
    setEditItemId(itemId);
  }, []);

  useEffect(() => {
    const authData = handleAuthFromURL();
    if (!authData) {
      checkAuth();
    }

    startAuthMonitor();

    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(savedPage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "Inter, sans-serif" }}>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Sidebar
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          isMobileOpen={isSidebarOpen}
          setIsMobileOpen={setIsSidebarOpen}
        />

        <div className="flex-1 lg:ml-64 flex flex-col">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

          {/* ✅ FIX: Routes must be rendered inside the return JSX */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<ReceivedOrders />} />
              <Route
                path="/add"
                element={<AddItem/>}
              />
              <Route path="/services" element={<MyServices setCurrentPage={handleSetCurrentPage} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/ongoing" element={<Ongoing />} />
              <Route path="/edit-profile" element={<Profile />} />
              <Route path="/orders/view-details" element={<OrderDetailsView />} />
            </Routes>
          </main>
        </div>

        <style>{`
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
    </NotificationProvider>
  );
};

export default App;
