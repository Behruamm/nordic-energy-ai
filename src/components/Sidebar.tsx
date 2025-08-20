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
    name: 'Intelligence Hub',
    icon: HomeIcon,
    description: 'Nordic Energy insights'
  },
  {
    id: 'ai-chat',
    name: 'AI Analyst',
    icon: ChatBubbleLeftRightIcon,
    description: 'Strategic energy intelligence'
  },
  {
    id: 'map',
    name: 'Project Map',
    icon: MapIcon,
    description: 'Geographic opportunities'
  }
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      transition-all duration-300 ease-in-out
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-900 dark:text-white flex flex-col h-screen
      border-r border-slate-200/50 dark:border-slate-800/50
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
                <p className="text-xs text-slate-500 dark:text-slate-400">Intelligence Platform</p>
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
                      ? 'bg-blue-600/90 text-white backdrop-blur-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
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
        <div className="flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="
              p-2 rounded-lg text-slate-500 dark:text-slate-400 
              hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer
              transition-colors duration-200
            "
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
