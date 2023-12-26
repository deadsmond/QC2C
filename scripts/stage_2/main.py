import json
from shapely.geometry import shape, Polygon, MultiPolygon, box
from shapely.ops import unary_union
from tqdm import tqdm
import time
import shutil
from os import path


def simplify_polygons(polygons: list) -> dict:
    pass


# data source: https://datahub.io/core/geo-countries
if __name__ == '__main__':
    source_directory = path.dirname(path.abspath(__file__))

    # TODO run stage 2 simplification on stage 1 output data
