// Import point-in-polygon utility to check if a point lies inside a polygon
import pointInPolygon from "point-in-polygon";

// Define the name of the manifest file containing global sector boundaries
const WORLD_SECTOR_MANIFEST = "world_sectors.json";

/**
 * Find which sector a coordinate falls into based on bounding boxes.
 *
 * Iterate through each sector in the manifest, checking if the coordinates
 * lie within the sector's bounding box.
 *
 * @param {object} sectors_manifest - Object mapping sector keys to bounding box arrays [lat_min, lng_min, lat_max, lng_max].
 * @param {{lat: number, lng: number}} coordinates - Coordinates object with lat and lng properties.
 * @returns {string|null} Sector key string if found; otherwise null.
 */
const getSector = (sectors_manifest, coordinates) => {
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

/**
 * Determine the country within a sector by testing polygons.
 *
 * Represent the coordinate as an array and iterate through each country's polygon
 * to check if the coordinate lies inside.
 *
 * @param {object} sector_manifest - Object mapping country keys to polygon coordinate arrays.
 * @param {{lat: number, lng: number}} coordinates - Coordinates object with lat and lng properties.
 * @returns {string|null} Country key string if found; otherwise null.
 */
const getCountry = (sector_manifest, coordinates) => {
  const point = [coordinates.lat, coordinates.lng];
  for (const [key, polygon] of Object.entries(sector_manifest)) {
    if (pointInPolygon(point, polygon)) {
      return key;
    }
  }
  return null;
};

/**
 * Asynchronously convert coordinates to a country name.
 *
 * Fetch the world sector manifest to determine the sector, then fetch the
 * sector polygon data to identify the specific country polygon containing the coordinate.
 *
 * @param {{lat: number, lng: number}} coordinates - Coordinates object with lat and lng properties.
 * @returns {Promise<string|null>} Promise resolving to country key string if found; otherwise null.
 */
export const coordinatesToCountry = async (coordinates) => {
  try {
    let response = await fetch(`/${WORLD_SECTOR_MANIFEST}`);
    if (!response.ok) {
      throw new Error(`Failed to get ${WORLD_SECTOR_MANIFEST}`);
    }
    let data = await response.json();

    const sector = getSector(data, coordinates);
    if (!sector) return null;

    response = await fetch(`/${sector}`);
    if (!response.ok) {
      throw new Error(`Failed to get ${sector}`);
    }
    data = await response.json();

    return getCountry(data, coordinates);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
