import unittest
from python.qc2c.core import get_sector, get_country, point_in_polygon


class SectorCountryTest(unittest.TestCase):

    def test_point_in_polygon(self):
        polygon = [[0, 0], [0, 2], [2, 2], [2, 0]]
        inside_point = [1, 1]
        outside_point = [3, 3]

        self.assertTrue(point_in_polygon(inside_point, polygon))
        self.assertFalse(point_in_polygon(outside_point, polygon))

    def test_get_sector(self):
        sectors_manifest = {"sector1": [0, 0, 5, 5], "sector2": [6, 6, 10, 10]}

        coords_inside_sector1 = {"lat": 3, "lng": 3}
        coords_inside_sector2 = {"lat": 7, "lng": 7}
        coords_outside = {"lat": 11, "lng": 11}

        self.assertEqual(get_sector(sectors_manifest, coords_inside_sector1), "sector1")
        self.assertEqual(get_sector(sectors_manifest, coords_inside_sector2), "sector2")
        self.assertIsNone(get_sector(sectors_manifest, coords_outside))

    def test_get_country(self):
        sector_manifest = {
            "country1": [[0, 0], [0, 5], [5, 5], [5, 0]],
            "country2": [[6, 6], [6, 10], [10, 10], [10, 6]],
        }

        coords_in_country1 = {"lat": 2, "lng": 2}
        coords_in_country2 = {"lat": 7, "lng": 7}
        coords_outside = {"lat": 11, "lng": 11}

        self.assertEqual(get_country(sector_manifest, coords_in_country1), "country1")
        self.assertEqual(get_country(sector_manifest, coords_in_country2), "country2")
        self.assertIsNone(get_country(sector_manifest, coords_outside))
