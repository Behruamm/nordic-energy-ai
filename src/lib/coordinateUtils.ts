// Simple coordinate conversion utilities
// Note: This is a simplified conversion. For production, use a proper projection library like proj4js

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Convert British National Grid (OSGB36) to approximate WGS84 lat/lng
 * This is a simplified conversion - for precise mapping, use proj4js
 */
export function convertBNGToLatLng(easting: number, northing: number): Coordinates | null {
  if (!easting || !northing || isNaN(easting) || isNaN(northing) || easting === 0 || northing === 0) {
    return null;
  }

  // Simplified conversion (approximate)
  // Real conversion would use complex mathematical transformations
  
  // UK bounds check (rough)
  if (easting < 0 || easting > 800000 || northing < 0 || northing > 1400000) {
    return null;
  }

  // Simplified linear transformation (not accurate, but gives rough positioning)
  const lat = 49.0 + (northing - 0) / 111000;
  const lng = -8.0 + (easting - 0) / (111000 * Math.cos(lat * Math.PI / 180));

  // Bounds check for reasonable UK coordinates
  if (lat < 49.0 || lat > 61.0 || lng < -8.0 || lng > 2.0) {
    return null;
  }

  return { lat, lng };
}

/**
 * Get color for technology type
 */
export const technologyColors = {
  'Solar Photovoltaics': '#F59E0B', // amber
  'Solar': '#F59E0B', // amber
  'Wind Onshore': '#10B981', // emerald
  'Wind Offshore': '#3B82F6', // blue
  'Wind': '#10B981', // emerald (default for wind)
  'Biomass': '#8B5CF6', // violet
  'Hydro': '#06B6D4', // cyan
  'Battery': '#EF4444', // red
  'Storage': '#EF4444', // red
  'Nuclear': '#F97316', // orange
  'Gas': '#6B7280', // gray
  'Coal': '#374151', // dark gray
  'Default': '#6B7280' // gray
};

/**
 * Get color for development status
 */
export const statusColors = {
  'Operational': '#10B981', // green
  'Under Construction': '#F59E0B', // amber
  'Planning Permission Granted': '#3B82F6', // blue
  'Application Submitted': '#8B5CF6', // violet
  'Application Refused': '#EF4444', // red
  'Application Withdrawn': '#6B7280', // gray
  'Default': '#6B7280' // gray
};

export function getTechnologyColor(technology: string): string {
  if (!technology) return technologyColors.Default;
  
  const key = Object.keys(technologyColors).find(tech => 
    technology.toLowerCase().includes(tech.toLowerCase())
  );
  return key ? technologyColors[key as keyof typeof technologyColors] : technologyColors.Default;
}

export function getStatusColor(status: string): string {
  return statusColors[status as keyof typeof statusColors] || statusColors.Default;
}
