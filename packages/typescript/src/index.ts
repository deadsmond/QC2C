// Import LatLng type from Leaflet for coordinate typing
import { LatLng } from "leaflet";

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
 * @param sectors_manifest - Object mapping sector keys to bounding box arrays [lat_min, lng_min, lat_max, lng_max].
 * @param coordinates - Coordinates as LatLng object.
 * @returns Sector key string if found; otherwise null.
 */
const getSector = (
  sectors_manifest: object,
  coordinates: LatLng
): string | null => {
  // Iterate through each sector entry in the manifest
  for (const [key, bounds] of Object.entries(sectors_manifest)) {
    // Destructure the bounding box into min/max latitudes and longitudes
    const [lat_min, lng_min, lat_max, lng_max] = bounds;

    // Check if the coordinate lies within the bounding box
    if (
      lat_min <= coordinates.lat &&
      coordinates.lat <= lat_max &&
      lng_min <= coordinates.lng &&
      coordinates.lng <= lng_max
    ) {
      // Return the sector key if coordinate is inside the bounding box
      return key;
    }
  }

  // Return null if no sector contains the coordinate
  return null;
};

/**
 * Determine the country within a sector by testing polygons.
 *
 * Represent the coordinate as an array and iterate through each country's polygon
 * to check if the coordinate lies inside.
 *
 * @param sector_manifest - Object mapping country keys to polygon coordinate arrays.
 * @param coordinates - Coordinates as LatLng object.
 * @returns Country key string if found; otherwise null.
 */
const getCountry = (
  sector_manifest: object,
  coordinates: LatLng
): string | null => {
  // Represent coordinate as an array to match point-in-polygon input format
  const point = [coordinates.lat, coordinates.lng];

  // Iterate through each country's polygon in the sector manifest
  for (const [key, polygon] of Object.entries(sector_manifest)) {
    // Return the country key if the point lies inside the polygon
    if (pointInPolygon(point, polygon)) {
      return key;
    }
  }

  // Return null if point does not match any polygon
  return null;
};

/**
 * Asynchronously convert coordinates to a country name.
 *
 * Fetch the world sector manifest to determine the sector, then fetch the
 * sector polygon data to identify the specific country polygon containing the coordinate.
 *
 * @param coordinates - Coordinates as LatLng object.
 * @returns Promise resolving to country key string if found; otherwise null.
 */
export const coordinatesToCountry = async (
  coordinates: LatLng
): Promise<string | null> => {
  try {
    // Fetch the world sector manifest file
    let response = await fetch(`/${WORLD_SECTOR_MANIFEST}`);

    // Throw error if request fails
    if (!response.ok) {
      throw new Error(`Failed to get ${WORLD_SECTOR_MANIFEST}`);
    }

    // Parse the sector manifest JSON
    let data = await response.json();

    // Determine the relevant sector key for the coordinates
    const sector = getSector(data, coordinates);

    // Fetch the sector-specific polygon data
    response = await fetch(`/${sector}`);

    // Throw error if request fails
    if (!response.ok) {
      throw new Error(`Failed to get ${sector}`);
    }

    // Parse the sector polygon data
    data = await response.json();

    // Determine and return the country within the sector
    return getCountry(data, coordinates);
  } catch (error) {
    // Log any fetch or processing errors
    console.error("Error fetching data:", error);

    // Return null in case of failure
    return null;
  }
};
