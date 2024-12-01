import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Settings, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../libs/utils';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, walletAddress } = useAuth();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Open by default only on desktop

  const navItems = [
    { icon: Bot, label: 'Chat Bot', to: '/dashboard' },
    { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-10 transition-all duration-300 transform",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-r border-gray-200/80 -z-0",
        "shadow-[4px_0_24px_-2px_rgba(0,0,0,0.05)] flex flex-col h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isOpen ? "w-72 lg:w-64" : "w-0 lg:w-20",
        !isOpen && "lg:block hidden" // Hide on mobile when closed
      )}>
        {/* Logo/Brand Area */}
        <div className="p-6 border-b border-gray-200">
          <h1 className={cn(
            "font-bold text-xl text-gray-900 transition-all duration-200",
            !isOpen && "lg:hidden"
          )}>
            Dashboard
          </h1>
        </div>

        <nav className="px-3 py-6 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600',
                        !isOpen && "lg:mx-auto"
                      )}
                    />
                    <span className={cn(
                      "ml-3 transition-all duration-200",
                      !isOpen && "lg:hidden"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-600',
                      'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0',
                      !isOpen && "lg:hidden"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={cn(
          "border-t border-gray-200 p-4 -z-10",
          !isOpen && "lg:p-2"
        )}>
          <div className="space-y-3">
            <div className={cn(
              "flex items-center",
              isOpen ? "justify-between" : "lg:justify-center"
            )}>
              <h1 className={cn(
                "text-sm font-medium text-gray-900",
                !isOpen && "lg:hidden"
              )}>
                Wallet
              </h1>
              <button
                onClick={logout}
                className={cn(
                  "inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors",
                  isOpen ? "px-2 py-1" : "lg:p-2"
                )}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className={cn("ml-1", !isOpen && "lg:hidden")}>
                  Logout
                </span>
              </button>
            </div>
            {walletAddress && (
              <p className={cn(
                "text-xs text-gray-500",
                isOpen ? "break-all" : "lg:hidden"
              )}>
                {isOpen ? walletAddress : null}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-9 bg-white rounded-full p-1.5 border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className={cn(
            "h-4 w-4 text-gray-600 transition-transform duration-200",
            !isOpen && "rotate-180"
          )} />
        </button>
      </aside>
    </>
  );
};