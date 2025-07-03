var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pointInPolygon from "point-in-polygon";
const WORLD_SECTOR_MANIFEST = "world_sectors.json";
const getSector = (sectors_manifest, coordinates) => {
    for (const [key, bounds] of Object.entries(sectors_manifest)) {
        const [lat_min, lng_min, lat_max, lng_max] = bounds;
        if (lat_min <= coordinates.lat &&
            coordinates.lat <= lat_max &&
            lng_min <= coordinates.lng &&
            coordinates.lng <= lng_max) {
            return key;
        }
    }
    return null;
};
const getCountry = (sector_manifest, coordinates) => {
    const point = [coordinates.lat, coordinates.lng];
    for (const [key, polygon] of Object.entries(sector_manifest)) {
        if (pointInPolygon(point, polygon)) {
            return key;
        }
    }
    return null;
};
export const coordinatesToCountry = (coordinates) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get world sectors
        let response = yield fetch(`/${WORLD_SECTOR_MANIFEST}`);
        if (!response.ok) {
            throw new Error(`Failed to get ${WORLD_SECTOR_MANIFEST}`);
        }
        let data = yield response.json();
        const sector = getSector(data, coordinates);
        // get specific sector
        response = yield fetch(`/${sector}`);
        if (!response.ok) {
            throw new Error(`Failed to get ${sector}`);
        }
        data = yield response.json();
        // get correct country within sector
        return getCountry(data, coordinates);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
});
