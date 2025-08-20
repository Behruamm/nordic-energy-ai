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
import { Layout } from '@/components/Layout';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                Welcome to Nordic Energy AI
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Analyze UK renewable energy projects with AI-powered insights
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Projects</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {summary?.totalProjects.toLocaleString() || '0'}
                    </p>
                  </div>
                  <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Capacity</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {summary?.totalCapacity.toLocaleString() || '0'} MW
                    </p>
                  </div>
                  <BoltIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Operational</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {summary?.operationalProjects.toLocaleString() || '0'}
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Technologies</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {summary?.uniqueTechnologies || '0'}
                    </p>
                  </div>
                  <CpuChipIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            {summary && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <TechnologyChart summary={summary} />
                  <StatusChart summary={summary} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <RegionChart summary={summary} />
                  <CapacityChart summary={summary} />
                </div>
              </>
            )}




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
