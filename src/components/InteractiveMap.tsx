'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { EnergyProject } from '@/lib/dataLoader';
import { convertBNGToLatLng, getTechnologyColor } from '@/lib/coordinateUtils';
import { 
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false });

interface InteractiveMapProps {
  projects: EnergyProject[];
}



export function InteractiveMap({ projects }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<EnergyProject[]>([]);
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter] = useState<[number, number]>([54.5, -2.0]); // UK center
  const [mapZoom] = useState(6);
  const [maxMarkersToShow] = useState(1000); // Limit markers for performance

  // Get projects with valid coordinates
  const projectsWithCoords = projects.filter(project => 
    project.xCoordinate && 
    project.yCoordinate && 
    !isNaN(project.xCoordinate) && 
    !isNaN(project.yCoordinate) &&
    project.xCoordinate !== 0 &&
    project.yCoordinate !== 0
  );

  // Get unique technologies and statuses for filters
  const technologies = Array.from(new Set(projectsWithCoords.map(p => p.technologyType).filter(Boolean)));
  const statuses = Array.from(new Set(projectsWithCoords.map(p => p.developmentStatusShort).filter(Boolean)));

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let filtered = projectsWithCoords;

    if (selectedTechnology !== 'all') {
      filtered = filtered.filter(project => 
        project.technologyType?.toLowerCase().includes(selectedTechnology.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => 
        project.developmentStatusShort === selectedStatus
      );
    }

    // Limit markers for performance - show largest capacity projects first
    const limitedFiltered = filtered
      .sort((a, b) => (b.installedCapacity || 0) - (a.installedCapacity || 0))
      .slice(0, maxMarkersToShow);

    setFilteredProjects(limitedFiltered);
  }, [selectedTechnology, selectedStatus, projects, maxMarkersToShow, projectsWithCoords]);



  // Memoize icon creation for better performance
  const createCustomIcon = useMemo(() => {
    if (typeof window === 'undefined') return () => null;
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    const iconCache = new Map();
    
    return (project: EnergyProject) => {
      const technology = project.technologyType || '';
      
      // Use cached icon if available
      if (iconCache.has(technology)) {
        return iconCache.get(technology);
      }
      
      const color = getTechnologyColor(technology);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 10px;
            height: 10px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
          "></div>
        `,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });
      
      // Cache the icon for reuse
      iconCache.set(technology, icon);
      return icon;
    };
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 min-w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technology Type
              </label>
              <select
                value={selectedTechnology}
                onChange={(e) => setSelectedTechnology(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Technologies</option>
                {technologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Development Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredProjects.length.toLocaleString()} of {projectsWithCoords.length.toLocaleString()} projects
              {filteredProjects.length >= maxMarkersToShow && (
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚡ Showing top {maxMarkersToShow} projects by capacity for performance
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup>
          {filteredProjects.map((project, index) => {
            // Convert British National Grid to Lat/Lng using utility
            const coords = convertBNGToLatLng(project.xCoordinate, project.yCoordinate);
            
            if (!coords) return null;

            return (
              <Marker
                key={`${project.refId}-${index}`}
                position={[coords.lat, coords.lng]}
                icon={createCustomIcon(project)}
              >
                <Popup>
                  <div className="p-2 min-w-64">
                    <h4 className="font-semibold text-lg mb-2 text-slate-900">
                      {project.siteName || 'Unnamed Project'}
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Technology:</span>
                        <span className="ml-2 text-slate-600">{project.technologyType || 'Unknown'}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-slate-700">Status:</span>
                        <span className="ml-2 text-slate-600">{project.developmentStatusShort || 'Unknown'}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-slate-700">Capacity:</span>
                        <span className="ml-2 text-slate-600">
                          {project.installedCapacity ? `${project.installedCapacity} MW` : 'Not specified'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-slate-700">Operator:</span>
                        <span className="ml-2 text-slate-600">{project.operator || 'Not specified'}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium text-slate-700">Location:</span>
                        <span className="ml-2 text-slate-600">
                          {project.county && project.region ? `${project.county}, ${project.region}` : project.region || project.county || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
