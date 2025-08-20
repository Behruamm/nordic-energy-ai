'use client';

import { 
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { DataSummary } from '@/lib/dataLoader';

interface DashboardFiltersProps {
  summary: DataSummary;
  filteredSummary: DataSummary;
  selectedRegion: string;
  selectedTechnology: string;
  selectedStatus: string;
  onRegionChange: (region: string) => void;
  onTechnologyChange: (technology: string) => void;
  onStatusChange: (status: string) => void;
  activeTab: string;
}

export function DashboardFilters({
  summary,
  filteredSummary,
  selectedRegion,
  selectedTechnology,
  selectedStatus,
  onRegionChange,
  onTechnologyChange,
  onStatusChange,
  activeTab
}: DashboardFiltersProps) {
  // Get available filter options from data
  const regions = Object.keys(summary.regionBreakdown).sort();
  const technologies = Object.keys(summary.technologyBreakdown).sort();
  const statuses = Object.keys(summary.statusBreakdown).sort();

  // Nordic Energy specific filters
  const nordicTechnologies = [
    'All Technologies',
    'District Heating & CHP',
    'Solar Photovoltaics',
    'Heat Pumps',
    'Wind Onshore',
    'Battery Storage',
    'Biomass'
  ];

  const nordicRegions = [
    'All Regions',
    'Scotland',
    'North West',
    'West Midlands',
    'Yorkshire and Humber',
    'South West',
    'London'
  ];

  const resetFilters = () => {
    onRegionChange('all');
    onTechnologyChange('all');
    onStatusChange('all');
  };

  const getFilteredCount = () => {
    return filteredSummary.totalProjects;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          {activeTab === 'nordic-focus' ? 'Nordic Energy Filters' : 'Data Filters'}
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer hover:underline"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full p-3 border-0 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Regions</option>
            {(activeTab === 'nordic-focus' ? nordicRegions.slice(1) : regions).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Technology Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Technology
          </label>
          <select
            value={selectedTechnology}
            onChange={(e) => onTechnologyChange(e.target.value)}
            className="w-full p-3 border-0 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Technologies</option>
            {(activeTab === 'nordic-focus' ? nordicTechnologies.slice(1) : technologies).map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full p-3 border-0 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Results Summary */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-600 dark:text-slate-400">
            {selectedRegion !== 'all' || selectedTechnology !== 'all' || selectedStatus !== 'all' ? (
              <>
                Filtered results: <span className="font-medium">{getFilteredCount().toLocaleString()}</span> projects
                {activeTab === 'nordic-focus' && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (Nordic Energy focus applied)
                  </span>
                )}
              </>
            ) : (
              <>
                Showing all <span className="font-medium">{summary.totalProjects.toLocaleString()}</span> projects
              </>
            )}
          </div>
          
          {(selectedRegion !== 'all' || selectedTechnology !== 'all' || selectedStatus !== 'all') && (
            <div className="flex items-center gap-2">
              {selectedRegion !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {selectedRegion}
                </span>
              )}
              {selectedTechnology !== 'all' && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                  {selectedTechnology}
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                  {selectedStatus}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
