'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  BoltIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { dataLoader, DataSummary } from '@/lib/dataLoader';
import { TechnologyChart, StatusChart, RegionChart, CapacityChart } from '@/components/Charts';
import { NordicEnergyInsights } from '@/components/NordicEnergyInsights';
import { DashboardFilters } from '@/components/DashboardFilters';
import { Layout } from '@/components/Layout';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dataLoader.loadData();
        const dataSummary = dataLoader.getSummary();
        setSummary(dataSummary);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter data based on selected filters
  const getFilteredData = () => {
    if (!summary) return null;

    const allProjects = dataLoader.getData();
    let filtered = allProjects;

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(project => project.region === selectedRegion);
    }

    // Apply technology filter
    if (selectedTechnology !== 'all') {
      if (selectedTechnology === 'District Heating & CHP') {
        filtered = filtered.filter(project => 
          project.technologyType?.toLowerCase().includes('biomass') ||
          project.technologyType?.toLowerCase().includes('chp') ||
          project.technologyType?.toLowerCase().includes('combined heat')
        );
      } else {
        filtered = filtered.filter(project => 
          project.technologyType?.toLowerCase().includes(selectedTechnology.toLowerCase())
        );
      }
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.developmentStatusShort === selectedStatus);
    }

    // Calculate filtered summary
    const technologyBreakdown: { [key: string]: number } = {};
    const statusBreakdown: { [key: string]: number } = {};
    const regionBreakdown: { [key: string]: number } = {};
    
    let totalCapacity = 0;
    let operationalProjects = 0;

    filtered.forEach(project => {
      if (project.technologyType) {
        technologyBreakdown[project.technologyType] = 
          (technologyBreakdown[project.technologyType] || 0) + 1;
      }
      if (project.developmentStatusShort) {
        statusBreakdown[project.developmentStatusShort] = 
          (statusBreakdown[project.developmentStatusShort] || 0) + 1;
      }
      if (project.region) {
        regionBreakdown[project.region] = 
          (regionBreakdown[project.region] || 0) + 1;
      }
      if (project.installedCapacity && !isNaN(project.installedCapacity)) {
        totalCapacity += project.installedCapacity;
      }
      if (project.developmentStatusShort === 'Operational') {
        operationalProjects++;
      }
    });

    return {
      totalProjects: filtered.length,
      totalCapacity: Math.round(totalCapacity),
      operationalProjects,
      uniqueTechnologies: Object.keys(technologyBreakdown).length,
      technologyBreakdown,
      statusBreakdown,
      regionBreakdown
    };
  };

  const filteredSummary = getFilteredData();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'nordic-focus', name: 'Nordic Energy Focus', icon: BoltIcon }
  ];

    const renderTabContent = () => {
    if (!summary || !filteredSummary) return null;

    const displaySummary = filteredSummary;

    switch (activeTab) {
      case 'overview':
  return (
          <div className="space-y-8">
            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Projects</p>
                  </div>
                  <p className="text-3xl font-light text-slate-900 dark:text-white">
                    {displaySummary.totalProjects.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Capacity</p>
                  </div>
                  <p className="text-3xl font-light text-slate-900 dark:text-white">
                    {displaySummary.totalCapacity.toLocaleString()} <span className="text-lg text-slate-500">MW</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Operational</p>
                  </div>
                  <p className="text-3xl font-light text-slate-900 dark:text-white">
                    {displaySummary.operationalProjects.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Technologies</p>
                  </div>
                  <p className="text-3xl font-light text-slate-900 dark:text-white">
                    {displaySummary.uniqueTechnologies}
                  </p>
                </div>
              </div>
            </div>

            {/* All Charts in Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TechnologyChart summary={displaySummary} />
              <StatusChart summary={displaySummary} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RegionChart summary={displaySummary} />
              <CapacityChart summary={displaySummary} />
            </div>
          </div>
        );

      case 'nordic-focus':
        return <NordicEnergyInsights summary={displaySummary} />;

      default:
        return null;
    }
  };

  const dashboardContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading energy data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-2">Error loading data</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Nordic Energy AI Intelligence
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Comprehensive analysis of UK renewable energy projects with specialized insights
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

                        {/* Filters */}
            {summary && filteredSummary && (
              <DashboardFilters
                summary={summary}
                filteredSummary={filteredSummary}
                selectedRegion={selectedRegion}
                selectedTechnology={selectedTechnology}
                selectedStatus={selectedStatus}
                onRegionChange={setSelectedRegion}
                onTechnologyChange={setSelectedTechnology}
                onStatusChange={setSelectedStatus}
                activeTab={activeTab}
              />
            )}

            {/* Tab Content */}
            <div className="min-h-96">
              {renderTabContent()}
        </div>
          </>
        )}
    </div>
  );

  return (
    <Layout>
      {dashboardContent}
    </Layout>
  );
}
