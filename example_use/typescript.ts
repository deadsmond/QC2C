// general react imports
import { LatLng } from 'leaflet';
import pointInPolygon from 'point-in-polygon';

const WORLD_SECTOR_MANIFEST = 'world_sectors.json';

const getSector = (sectors_manifest: object, coordinates: LatLng) => {
  for (const [key, bounds] of Object.entries(sectors_manifest)) {
    const [lat_min, lng_min, lat_max, lng_max] = bounds;
    if (
      lat_min <= coordinates.lat &&
      coordinates.lat <= lat_max &&
      lng_min <= coordinates.lng &&
      coordinates.lng <= lng_max
    ) {
      return key;
    }
  }
  return null;
};

const getCountry = (sector_manifest: object, coordinates: LatLng) => {
  const point = [coordinates.lat, coordinates.lng];
  for (const [key, polygon] of Object.entries(sector_manifest)) {
    if (pointInPolygon(point, polygon)) {
      return key;
    }
  }
  return null;
};

export const coordinatesToCountry = async (coordinates: LatLng): Promise<string | null> => {
  try {
    // get world sectors
    let response = await fetch(`/${WORLD_SECTOR_MANIFEST}`);
    if (!response.ok) {
      throw new Error(`Failed to get ${WORLD_SECTOR_MANIFEST}`);
    }
    let data = await response.json();
    const sector = getSector(data, coordinates);
    // get specific sector
    response = await fetch(`/${sector}`);
    if (!response.ok) {
      throw new Error(`Failed to get ${sector}`);
    }
    data = await response.json();
    // get correct country within sector
    return getCountry(data, coordinates);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
