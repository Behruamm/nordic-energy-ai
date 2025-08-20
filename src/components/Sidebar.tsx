'use client';

import { useState } from 'react';
import { 
  MapIcon, 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: HomeIcon,
    description: 'Overview & Analytics'
  },
  {
    id: 'ai-chat',
    name: 'AI Assistant',
    icon: ChatBubbleLeftRightIcon,
    description: 'Ask questions about data'
  },
  {
    id: 'map',
    name: 'Map View',
    icon: MapIcon,
    description: 'Geographic insights'
  }
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      transition-all duration-300 ease-in-out
      bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col h-screen
      border-r border-slate-200 dark:border-slate-800 shadow-sm
    `}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
                <BoltIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Nordic Energy AI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Analytics Platform</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="p-2 bg-blue-600 rounded-xl mx-auto shadow-sm">
              <BoltIcon className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800 hover:shadow-sm'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.description}</div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Collapse Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            w-full flex items-center justify-center gap-2 
            px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 
            hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer
            transition-colors duration-200
          "
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
