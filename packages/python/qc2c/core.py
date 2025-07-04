from typing import Dict, List, Optional


def get_sector(
    sectors_manifest: Dict[str, List[float]], coordinates: Dict[str, float]
) -> Optional[str]:
    """
    Find which sector a coordinate falls into based on bounding boxes.

    Args:
        sectors_manifest: Dict mapping sector keys to bounding box lists [lat_min, lng_min, lat_max, lng_max].
        coordinates: Dict with 'lat' and 'lng' keys.

    Returns:
        Sector key if found, else None.
    """
    lat = coordinates["lat"]
    lng = coordinates["lng"]

    for key, bounds in sectors_manifest.items():
        lat_min, lng_min, lat_max, lng_max = bounds
        if lat_min <= lat <= lat_max and lng_min <= lng <= lng_max:
            return key
    return None


def point_in_polygon(point: List[float], polygon: List[List[float]]) -> bool:
    """
    Check if a point is inside a polygon using ray casting algorithm.

    Args:
        point: [lat, lng]
        polygon: List of [lat, lng] points defining polygon vertices.

    Returns:
        True if point is inside polygon, else False.
    """
    x, y = point
    inside = False
    n = len(polygon)

    for i in range(n):
        j = (i - 1) % n
        xi, yi = polygon[i]
        xj, yj = polygon[j]

        intersect = ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / (yj - yi + 1e-15) + xi
        )
        if intersect:
            inside = not inside
    return inside


def get_country(
    sector_manifest: Dict[str, List[List[float]]], coordinates: Dict[str, float]
) -> Optional[str]:
    """
    Determine the country within a sector by testing polygons.

    Args:
        sector_manifest: Dict mapping country keys to polygons (list of coordinate lists).
        coordinates: Dict with 'lat' and 'lng' keys.

    Returns:
        Country key if found, else None.
    """
    point = [coordinates["lat"], coordinates["lng"]]

    for key, polygon in sector_manifest.items():
        if point_in_polygon(point, polygon):
            return key
    return None
