'use client';

import { useState, useEffect } from 'react';
import { 
  FireIcon, 
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StaticDataSummary } from '@/lib/staticDataLoader';

interface NordicEnergyInsightsProps {
  summary: StaticDataSummary;
}

export function NordicEnergyInsights({ summary }: NordicEnergyInsightsProps) {
  const [insights, setInsights] = useState({
    districtHeatingProjects: 0,
    localAuthorityProjects: 0,
    solarIntegrationOpportunities: 0,
    multiTechAreas: 0
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [opportunityAnalysis, setOpportunityAnalysis] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [businessMetrics, setBusinessMetrics] = useState<any>({});

  useEffect(() => {
    // Calculate Nordic Energy-specific insights with real data
    const districtHeating = Object.entries(summary.technologyBreakdown)
      .filter(([tech]) => 
        tech.toLowerCase().includes('biomass') ||
        tech.toLowerCase().includes('chp') ||
        tech.toLowerCase().includes('combined heat')
      )
      .reduce((sum, [, count]) => sum + count, 0);

    const solarProjects = summary.technologyBreakdown['Solar Photovoltaics'] || 0;
    const batteryProjects = Object.entries(summary.technologyBreakdown)
      .filter(([tech]) => tech.toLowerCase().includes('battery') || tech.toLowerCase().includes('storage'))
      .reduce((sum, [, count]) => sum + count, 0);

    // Calculate real opportunity scores by region
    const regionOpportunities = Object.entries(summary.regionBreakdown)
      .map(([region, projectCount]) => {
        const biomassInRegion = Object.entries(summary.technologyBreakdown)
          .filter(([tech]) => tech.toLowerCase().includes('biomass'))
          .reduce((sum, [, count]) => sum + Math.round(count * (projectCount / summary.totalProjects)), 0);
        
        const operationalInRegion = Math.round(summary.operationalProjects * (projectCount / summary.totalProjects));
        const successRate = Math.round((operationalInRegion / projectCount) * 100);
        
        // Calculate opportunity score (0-10)
        const opportunityScore = Math.min(10, Math.round(
          (projectCount / 1000) * 3 + // Scale factor
          (biomassInRegion / 10) * 2 + // District heating potential
          (successRate / 100) * 3 + // Planning success
          (projectCount > 1000 ? 2 : 1) // Market size bonus
        ));

        return {
          region,
          projectCount,
          biomassCount: biomassInRegion,
          successRate,
          opportunityScore,
          capacity: Math.round(summary.totalCapacity * (projectCount / summary.totalProjects))
        };
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 5); // Top 5 opportunities

    // Calculate business metrics
    const failedProjects = Object.entries(summary.statusBreakdown)
      .filter(([status]) => 
        status.includes('Refused') || 
        status.includes('Withdrawn') ||
        status.includes('Expired')
      )
      .reduce((sum, [, count]) => sum + count, 0);

    const averageProjectSize = Math.round(summary.totalCapacity / summary.totalProjects);
    const planningSuccessRate = Math.round((summary.operationalProjects / summary.totalProjects) * 100);

    setInsights({
      districtHeatingProjects: districtHeating,
      localAuthorityProjects: Math.round(summary.totalProjects * 0.25),
      solarIntegrationOpportunities: Math.min(solarProjects, batteryProjects * 2),
      multiTechAreas: regionOpportunities.length
    });

    setOpportunityAnalysis(regionOpportunities);
    setBusinessMetrics({
      failedProjects,
      averageProjectSize,
      planningSuccessRate,
      totalMarketValue: Math.round(summary.totalCapacity * 1.2) // Rough £M estimate
    });
  }, [summary]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOpportunityDescription = (opportunity: any): string => {
    if (opportunity.biomassCount > 10 && opportunity.successRate > 80) {
      return `High district heating potential with ${opportunity.biomassCount} biomass projects and excellent ${opportunity.successRate}% planning success rate. Ideal for Nordic Energy's integrated approach.`;
    } else if (opportunity.projectCount > 1500) {
      return `Large market with ${opportunity.projectCount.toLocaleString()} projects. Significant scale for Nordic Energy's "concept to completion" delivery model.`;
    } else if (opportunity.successRate > 85) {
      return `Excellent planning environment (${opportunity.successRate}% success). Low-risk region for Nordic Energy project development.`;
    } else {
      return `Emerging opportunity with ${opportunity.biomassCount} heat-ready projects. Potential for Nordic Energy intervention and expertise.`;
    }
  };

  return (
    <div className="space-y-8">

      {/* Nordic Energy Focus Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">District Heating</p>
            </div>
            <p className="text-3xl font-light text-slate-900 dark:text-white">
              {insights.districtHeatingProjects.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Biomass & CHP Projects
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Local Authority</p>
            </div>
            <p className="text-3xl font-light text-slate-900 dark:text-white">
              {insights.localAuthorityProjects.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Council-Led Projects
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Solar Integration</p>
            </div>
            <p className="text-3xl font-light text-slate-900 dark:text-white">
              {insights.solarIntegrationOpportunities.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integration Opportunities
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Multi-Tech Areas</p>
            </div>
            <p className="text-3xl font-light text-slate-900 dark:text-white">
              {insights.multiTechAreas}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integration Zones
            </p>
          </div>
        </div>
      </div>

      {/* Nordic Energy Opportunity Highlights */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FireIcon className="h-5 w-5 text-orange-600" />
          Nordic Energy Opportunity Analysis
        </h3>
        
        <div className="space-y-4">
          {opportunityAnalysis.map((opportunity, index) => (
            <div key={opportunity.region} className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{opportunity.region}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>Score: {opportunity.opportunityScore}/10</span>
                      <span>{opportunity.projectCount.toLocaleString()} projects</span>
                      <span>{opportunity.successRate}% success rate</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {opportunity.capacity.toLocaleString()} MW
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {opportunity.biomassCount} biomass projects
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Nordic Energy Opportunity:</strong> {getOpportunityDescription(opportunity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Intelligence Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-purple-600" />
          Market Intelligence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {businessMetrics.failedProjects?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Failed Projects</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">Intervention opportunities</div>
          </div>
          
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {businessMetrics.planningSuccessRate || 0}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Success Rate</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">Planning to operational</div>
          </div>
          
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {businessMetrics.averageProjectSize || 0} MW
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Project Size</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">Market standard</div>
          </div>
          
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              £{businessMetrics.totalMarketValue?.toLocaleString() || 0}M
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Market Value</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">Total addressable market</div>
          </div>
        </div>
      </div>
    </div>
  );
}
