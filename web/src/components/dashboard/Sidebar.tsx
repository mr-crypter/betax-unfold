import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bot, Settings, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../libs/utils';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  const navItems = [
    { icon: Bot, label: 'Chat Bot', to: '/dashboard' },
    { icon: Settings, label: 'Templates Contracts', to: '/dashboard/contracts-templates' },
    { icon: Settings, label: 'Deployed Contracts', to: '/dashboard/deployed-contracts' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-gray-800 text-white shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-10 transition-all duration-300 transform",
        "bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700",
        "bg-gray-900 border-r border-gray-700",
        "shadow-[4px_0_24px_-2px_rgba(0,0,0,0.3)] flex flex-col h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isOpen ? "w-72 lg:w-64" : "w-0 lg:w-20",
        !isOpen && "lg:block hidden"
      )}>
      

        <nav className="px-3 py-6 space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-900/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-colors duration-200',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
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
                    isActive ? 'text-white/80' : 'text-gray-400 group-hover:text-white',
                    'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0',
                    !isOpen && "lg:hidden"
                  )}
                />
              </NavLink>
            );
          })}
        </nav>

        <div className={cn(
          "border-t border-gray-700 p-4",
          !isOpen && "lg:p-2"
        )}>
          <div className="space-y-3">
            <div className={cn(
              "flex items-center",
              isOpen ? "justify-between" : "lg:justify-center"
            )}>
              <h1 className={cn(
                "text-sm font-medium text-white",
                !isOpen && "lg:hidden"
              )}>
                Wallet
              </h1>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className={cn(
                  "inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors",
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
            <div className="text-sm text-gray-400 truncate">
              Wallet Address
            </div>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-9 bg-gray-800 rounded-full p-1.5 border border-gray-700 shadow-md hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className={cn(
            "h-4 w-4 text-white transition-transform duration-200",
            !isOpen && "rotate-180"
          )} />
        </button>
      </aside>
    </>
  );
};