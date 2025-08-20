'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { DataSummary } from '@/lib/dataLoader';

interface ChartsProps {
  summary: DataSummary;
}

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#6B7280', // gray
];

export function TechnologyChart({ summary }: ChartsProps) {
  const [showAll, setShowAll] = useState(false);
  const DISPLAY_LIMIT = 8;

  const allData = Object.entries(summary.technologyBreakdown)
    .map(([tech, count]) => ({
      name: tech,
      value: count,
      percentage: ((count / summary.totalProjects) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const displayData = showAll ? allData : allData.slice(0, DISPLAY_LIMIT);
  const hasMore = allData.length > DISPLAY_LIMIT;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Technology Types
        </h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer hover:underline"
          >
            {showAll ? `Show Top ${DISPLAY_LIMIT}` : `Show All (${allData.length})`}
          </button>
        )}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
              className="fill-slate-600 dark:fill-slate-400"
            />
            <YAxis className="fill-slate-600 dark:fill-slate-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(51 65 85)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number) => [value, 'Projects']}
            />
            <Bar 
              dataKey="value" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusChart({ summary }: ChartsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const MIN_PERCENTAGE_THRESHOLD = 3; // Group categories below 3% into "Others"

  const allData = Object.entries(summary.statusBreakdown)
    .map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / summary.totalProjects) * 100)
    }))
    .sort((a, b) => b.value - a.value);

  // Separate major categories from minor ones
  const majorCategories = allData.filter(item => item.percentage >= MIN_PERCENTAGE_THRESHOLD);
  const minorCategories = allData.filter(item => item.percentage < MIN_PERCENTAGE_THRESHOLD);

  // Create "Others" category if there are minor categories
  const chartData = [...majorCategories];
  if (minorCategories.length > 0) {
    const othersValue = minorCategories.reduce((sum, item) => sum + item.value, 0);
    const othersPercentage = minorCategories.reduce((sum, item) => sum + item.percentage, 0);
    
    chartData.push({
      name: 'Others',
      value: othersValue,
      percentage: othersPercentage
    });
  }

  const displayData = chartData.map(item => ({
    ...item,
    percentage: item.percentage.toFixed(1)
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Development Status
        </h3>
        {minorCategories.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer hover:underline"
          >
            {showDetails ? 'Hide Details' : 'Show All'}
          </button>
        )}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(51 65 85)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                padding: '12px'
              }}
              formatter={(value: number, name: string, props: { payload: { percentage: string } }) => {
                const percentage = props.payload.percentage;
                if (name === 'Others' && showDetails) {
                  return [
                    <div key="others-details" style={{ color: 'white' }}>
                      <div className="font-semibold">{name}: {value.toLocaleString()} projects ({percentage}%)</div>
                      <div className="text-sm mt-2 space-y-1">
                        <div className="font-medium">Breakdown:</div>
                        {minorCategories.map(cat => (
                          <div key={cat.name} className="text-xs">
                            • {cat.name}: {cat.value.toLocaleString()} ({cat.percentage.toFixed(1)}%)
                          </div>
                        ))}
                      </div>
                    </div>,
                    ''
                  ];
                }
                return [
                  <div key="main-info" className="text-center" style={{ color: 'white' }}>
                    <div className="font-semibold text-base">{name}</div>
                    <div className="text-sm mt-1">{value.toLocaleString()} projects ({percentage}%)</div>
                  </div>
                ];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry: { payload: { percentage: string } }) => (
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Details Panel */}
      {showDetails && minorCategories.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Other Categories ({minorCategories.length} items):
          </h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 dark:text-slate-400">
            {minorCategories.map(cat => (
              <div key={cat.name} className="flex justify-between">
                <span>{cat.name}</span>
                <span>{cat.value} ({cat.percentage.toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RegionChart({ summary }: ChartsProps) {
  const [showAll, setShowAll] = useState(false);
  const DISPLAY_LIMIT = 8;

  const allData = Object.entries(summary.regionBreakdown)
    .map(([region, count]) => ({
      name: region,
      value: count,
      percentage: ((count / summary.totalProjects) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const displayData = showAll ? allData : allData.slice(0, DISPLAY_LIMIT);
  const hasMore = allData.length > DISPLAY_LIMIT;



  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Projects by Region
        </h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer hover:underline"
          >
            {showAll ? `Show Top ${DISPLAY_LIMIT}` : `Show All (${allData.length})`}
          </button>
        )}
      </div>
      <div className="h-96">
        {displayData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            No regional data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={displayData} 
              layout="vertical" 
              margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                className="fill-slate-600 dark:fill-slate-400"
                fontSize={12}
                domain={[0, 'dataMax']}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                width={140}
                fontSize={12}
                className="fill-slate-600 dark:fill-slate-400"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(51 65 85)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number, name: string, props: { payload: { percentage: string } }) => [
                  `${value.toLocaleString()} projects (${props.payload.percentage}%)`, 
                  'Projects'
                ]}
              />
              <Bar 
                dataKey="value" 
                fill="#10B981"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
    </div>
  );
}

export function CapacityChart({ summary }: ChartsProps) {
  // Calculate capacity by technology
  // Note: This is a simplified version - in a real app, you'd want to aggregate actual capacity data
  const data = Object.entries(summary.technologyBreakdown)
    .map(([tech, count]) => ({
      name: tech,
      projects: count,
      // Simplified capacity estimation - in real app, calculate from actual data
      capacity: Math.round(count * (summary.totalCapacity / summary.totalProjects))
    }))
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 8);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Estimated Capacity by Technology (MW)
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
              className="fill-slate-600 dark:fill-slate-400"
            />
            <YAxis className="fill-slate-600 dark:fill-slate-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(51 65 85)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value: number) => [value, 'MW']}
            />
            <Bar 
              dataKey="capacity" 
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
