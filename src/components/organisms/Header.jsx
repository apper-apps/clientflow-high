import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import ApperIcon from "@/components/ApperIcon";
import { useSidebar } from "@/hooks/useSidebar";
import { AuthContext } from "@/App";

const Header = () => {
const { toggleSidebar } = useSidebar();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ClientFlow Pro
            </h1>
          </div>
        </div>

<div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <ApperIcon name="Bell" size={18} className="text-gray-600 dark:text-gray-300" />
          </Button>
          
          <ThemeToggle />
          

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Welcome, {user.firstName || user.name || 'User'}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
    </header>
  );
};

export default Header;