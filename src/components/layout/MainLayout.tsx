
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Collapse sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar collapsed={sidebarCollapsed} />}
        
        <main 
          className={`flex-1 overflow-auto transition-all duration-300 ${
            !isMobile ? (sidebarCollapsed ? "ml-[70px]" : "ml-[280px]") : ""
          }`}
        >
          <div className="container mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
