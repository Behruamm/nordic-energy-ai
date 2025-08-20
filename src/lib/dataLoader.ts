import Papa from 'papaparse';

export interface EnergyProject {
  refId: string;
  operator: string;
  siteName: string;
  technologyType: string;
  installedCapacity: number;
  developmentStatus: string;
  developmentStatusShort: string;
  county: string;
  region: string;
  country: string;
  xCoordinate: number;
  yCoordinate: number;
  planningPermissionGranted?: string;
  operational?: string;
  underConstruction?: string;
}

export interface DataSummary {
  totalProjects: number;
  totalCapacity: number;
  operationalProjects: number;
  uniqueTechnologies: number;
  technologyBreakdown: { [key: string]: number };
  statusBreakdown: { [key: string]: number };
  regionBreakdown: { [key: string]: number };
}

class DataLoader {
  private data: EnergyProject[] = [];
  private isLoaded = false;

  async loadData(): Promise<EnergyProject[]> {
    if (this.isLoaded) {
      return this.data;
    }

    try {
      const response = await fetch('/repd-q2-jul-2025.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => {
            // Transform CSV headers to camelCase
            const headerMap: { [key: string]: string } = {
              'Ref ID': 'refId',
              'Operator (or Applicant)': 'operator',
              'Site Name': 'siteName',
              'Technology Type': 'technologyType',
              'Installed Capacity (MWelec)': 'installedCapacity',
              'Development Status': 'developmentStatus',
              'Development Status (short)': 'developmentStatusShort',
              'County': 'county',
              'Region': 'region',
              'Country': 'country',
              'X-coordinate': 'xCoordinate',
              'Y-coordinate': 'yCoordinate',
              'Planning Permission Granted': 'planningPermissionGranted',
              'Operational': 'operational',
              'Under Construction': 'underConstruction'
            };
            return headerMap[header] || header;
          },
          transform: (value: string, header: string) => {
            // Transform specific fields
            if (header === 'installedCapacity' || header === 'xCoordinate' || header === 'yCoordinate') {
              const num = parseFloat(value);
              return isNaN(num) ? 0 : num;
            }
            return value?.trim() || '';
          },
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
            
            this.data = results.data as EnergyProject[];
            this.isLoaded = true;
            resolve(this.data);
          },
          error: (error: Error) => {
            reject(new Error(`CSV parsing failed: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error('Error loading CSV data:', error);
      throw error;
    }
  }

  getData(): EnergyProject[] {
    return this.data;
  }

  getSummary(): DataSummary {
    if (!this.isLoaded || this.data.length === 0) {
      return {
        totalProjects: 0,
        totalCapacity: 0,
        operationalProjects: 0,
        uniqueTechnologies: 0,
        technologyBreakdown: {},
        statusBreakdown: {},
        regionBreakdown: {}
      };
    }

    const technologyBreakdown: { [key: string]: number } = {};
    const statusBreakdown: { [key: string]: number } = {};
    const regionBreakdown: { [key: string]: number } = {};
    
    let totalCapacity = 0;
    let operationalProjects = 0;

    this.data.forEach(project => {
      // Technology breakdown
      if (project.technologyType) {
        technologyBreakdown[project.technologyType] = 
          (technologyBreakdown[project.technologyType] || 0) + 1;
      }

      // Status breakdown
      if (project.developmentStatusShort) {
        statusBreakdown[project.developmentStatusShort] = 
          (statusBreakdown[project.developmentStatusShort] || 0) + 1;
      }

      // Region breakdown
      if (project.region) {
        regionBreakdown[project.region] = 
          (regionBreakdown[project.region] || 0) + 1;
      }

      // Capacity calculation
      if (project.installedCapacity && !isNaN(project.installedCapacity)) {
        totalCapacity += project.installedCapacity;
      }

      // Operational projects count
      if (project.developmentStatusShort === 'Operational') {
        operationalProjects++;
      }
    });

    const summary = {
      totalProjects: this.data.length,
      totalCapacity: Math.round(totalCapacity),
      operationalProjects,
      uniqueTechnologies: Object.keys(technologyBreakdown).length,
      technologyBreakdown,
      statusBreakdown,
      regionBreakdown
    };

    return summary;
  }

  filterByTechnology(technology: string): EnergyProject[] {
    return this.data.filter(project => 
      project.technologyType?.toLowerCase().includes(technology.toLowerCase())
    );
  }

  filterByStatus(status: string): EnergyProject[] {
    return this.data.filter(project => 
      project.developmentStatusShort?.toLowerCase().includes(status.toLowerCase())
    );
  }

  filterByRegion(region: string): EnergyProject[] {
    return this.data.filter(project => 
      project.region?.toLowerCase().includes(region.toLowerCase())
    );
  }

  getProjectsWithCoordinates(): EnergyProject[] {
    return this.data.filter(project => 
      project.xCoordinate && 
      project.yCoordinate && 
      !isNaN(project.xCoordinate) && 
      !isNaN(project.yCoordinate) &&
      project.xCoordinate !== 0 &&
      project.yCoordinate !== 0
    );
  }
}

// Export singleton instance
export const dataLoader = new DataLoader();
