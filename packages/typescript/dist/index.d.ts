import { LatLng } from "leaflet";
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
export declare const getSector: (sectors_manifest: object, coordinates: LatLng) => string | null;
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
export declare const getCountry: (sector_manifest: object, coordinates: LatLng) => string | null;
/**
 * Asynchronously convert coordinates to a country name.
 *
 * Fetch the world sector manifest to determine the sector, then fetch the
 * sector polygon data to identify the specific country polygon containing the coordinate.
 *
 * This is just a premade workflow to show how to operate the functions: getSector, getCountry.
 *
 * @param coordinates - Coordinates as LatLng object.
 * @returns Promise resolving to country key string if found; otherwise null.
 */
export declare const coordinatesToCountry: (coordinates: LatLng, urls?: {
    manifest: string;
    sectors: string;
}) => Promise<string | null>;
