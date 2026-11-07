import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BANGLADESH_DIVISIONS,
  ALL_BANGLADESH_DISTRICTS,
  DivisionData,
  DistrictData,
} from './locations.data';

export interface FormattedLocation {
  id: number;
  district: string;
  districtBn: string;
  division: string;
  divisionBn: string;
  label: string;
  labelBn: string;
}

export interface LocationsResult {
  totalDivisions: number;
  totalDistricts: number;
  divisions: DivisionData[];
  districts: DistrictData[];
  locations: FormattedLocation[];
}

@Injectable()
export class LocationsService {
  /**
   * Format a district into a unified location object
   */
  private formatLocation(district: DistrictData): FormattedLocation {
    return {
      id: district.id,
      district: district.name,
      districtBn: district.bnName,
      division: district.divisionName,
      divisionBn: district.divisionBnName,
      label: `${district.name}, ${district.divisionName}`,
      labelBn: `${district.bnName}, ${district.divisionBnName} বিভাগ`,
    };
  }

  /**
   * Get all divisions along with all 64 districts
   */
  getAll(search?: string, division?: string): LocationsResult {
    let divisions = BANGLADESH_DIVISIONS;
    let districts = ALL_BANGLADESH_DISTRICTS;

    // Filter by division if specified
    if (division?.trim()) {
      const divFilter = division.trim().toLowerCase();
      districts = districts.filter(
        (dis) =>
          dis.divisionName.toLowerCase() === divFilter ||
          dis.divisionBnName.toLowerCase() === divFilter ||
          String(dis.divisionId) === divFilter,
      );
      divisions = divisions.filter(
        (div) =>
          div.name.toLowerCase() === divFilter ||
          div.bnName.toLowerCase() === divFilter ||
          String(div.id) === divFilter,
      );
    }

    // Filter by search keyword
    if (search?.trim()) {
      const term = search.trim().toLowerCase();

      districts = districts.filter(
        (dis) =>
          dis.name.toLowerCase().includes(term) ||
          dis.bnName.toLowerCase().includes(term) ||
          dis.divisionName.toLowerCase().includes(term) ||
          dis.divisionBnName.toLowerCase().includes(term),
      );

      divisions = divisions
        .map((div) => {
          const divMatch =
            div.name.toLowerCase().includes(term) ||
            div.bnName.toLowerCase().includes(term);

          const matchingDistricts = div.districts.filter(
            (dis) =>
              dis.name.toLowerCase().includes(term) ||
              dis.bnName.toLowerCase().includes(term),
          );

          if (divMatch) return div;
          if (matchingDistricts.length > 0) {
            return { ...div, districts: matchingDistricts };
          }
          return null;
        })
        .filter((div): div is DivisionData => div !== null);
    }

    return {
      totalDivisions: divisions.length,
      totalDistricts: districts.length,
      divisions,
      districts,
      locations: districts.map((d) => this.formatLocation(d)),
    };
  }

  /**
   * Get all 8 divisions
   */
  getDivisions() {
    return BANGLADESH_DIVISIONS.map((div) => ({
      id: div.id,
      name: div.name,
      bnName: div.bnName,
      code: div.code,
      totalDistricts: div.districts.length,
      districts: div.districts,
    }));
  }

  /**
   * Get all 64 districts (or filtered)
   */
  getDistricts(division?: string, search?: string): DistrictData[] {
    let list = ALL_BANGLADESH_DISTRICTS;

    if (division?.trim()) {
      const divFilter = division.trim().toLowerCase();
      list = list.filter(
        (dis) =>
          dis.divisionName.toLowerCase() === divFilter ||
          dis.divisionBnName.toLowerCase() === divFilter ||
          String(dis.divisionId) === divFilter,
      );
    }

    if (search?.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (dis) =>
          dis.name.toLowerCase().includes(term) ||
          dis.bnName.toLowerCase().includes(term) ||
          dis.divisionName.toLowerCase().includes(term),
      );
    }

    return list;
  }

  /**
   * Get specific district by name
   */
  getDistrictByName(name: string): DistrictData {
    const term = name.trim().toLowerCase();
    const found = ALL_BANGLADESH_DISTRICTS.find(
      (dis) =>
        dis.name.toLowerCase() === term || dis.bnName.toLowerCase() === term,
    );

    if (!found) {
      throw new NotFoundException(`District '${name}' not found.`);
    }

    return found;
  }
}
