import React, { useState } from "react";
import { Providers } from "../../Provider";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export const RootLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Providers>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleSidebar={handleToggleSidebar}
        />
        
        {/* Main Content Area */}
        <div className={`
          flex-1 flex flex-col transition-all duration-300
          ${sidebarCollapsed}
          w-full
        `}>
          {/* Navbar */}
          <Navbar onToggleSidebar={handleToggleSidebar} />
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            <main className="w-full">
              {children}
            </main>
          </div>
        </div>
      </div>
    </Providers>
  );
};

