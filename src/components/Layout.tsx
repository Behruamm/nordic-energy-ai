'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { InteractiveMap } from './InteractiveMap';
import { AIAssistant } from './AIAssistant';
import { dataLoader, EnergyProject } from '@/lib/dataLoader';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [projects, setProjects] = useState<EnergyProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const loadProjects = async () => {
      if (projects.length === 0) {
        setIsLoadingProjects(true);
        try {
          const data = await dataLoader.loadData();
          setProjects(data);
        } catch (error) {
          console.error('Failed to load projects:', error);
        } finally {
          setIsLoadingProjects(false);
        }
      }
    };

    loadProjects();
  }, [projects.length]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return children; // Current dashboard content
      case 'ai-chat':
        return (
          <div className="h-full p-4">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-slate-600 dark:text-slate-400">Initializing Nordic Energy AI analyst...</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <AIAssistant projects={projects} />
              </div>
            )}
          </div>
        );
      case 'map':
        return (
          <div className="h-full p-4">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading project locations...</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <InteractiveMap projects={projects} />
              </div>
            )}
          </div>
        );

      default:
        return children;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
