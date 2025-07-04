# Quick Coordinates To Country - QC2C

Quick Coordinates To Country (QC2C) provides fast and (mostly) offline country check,
based on provided coordinates.

## About

This project aims at creation of standard,
approximate offline check whether coordinates are within countries borders
and return country code in ISO Alpha 3.

Approximate borders were created in `main.py` with:

- convex hull of a country
- `geometry.simplify` to reduce amount of points
- multiple iterations to remove unnecessary border points with smoothed curves

## Compression

Results were compressed with `gzip` to reduce files size and make them accessible for `javascript` applications,
as browsers have native support for this compression algorithm.

It is possible that other compression algorithms (such as `Brotli`) would provide smaller size,
but they are not standard yet.

## How to use

1. host world + sectors manifests on the web or add them to your project
2. Check which sector contains coordinates data
3. Check which country from sector contains coordinates

Example scripts are provided in **example_use** folder.

### How to generate files

1. provide `countries.json`
2. provide `us_states.json`
3. provide `world_sectors.json` manifest
4. run `main.py` to generate `world_sectors_x.json` from provided files

    > 2023.12.24: Stage 1 current total runtime: ~900 seconds

5. _Optional_: run `preview_world_sectors.py` to check sector map for artifacts

> stages 3+ produce `.json.gz` files!

## Politics

1. This project is NOT a political matter
2. We do NOT move borders or decide which land belongs to whom
3. _QC2C_ is **offline approximation** and **WORKS ONLY ON LAND - sea borders are not supported!**
4. If you do not agree with provided borders, don't use it! Make your own or something.
5. Keep your political views out of discussions, commits and merge requests.

## Roadmap

1. ~~**Shore Line Reduction**: sea borders can be greatly reduced,
but this requires iteration through points; **coming in stage 2**~~

2. **Rectangularization x Triangulation** - islands can be represented as squares or triangles,
if they would not intersect with anything else.
Shore lines can also be represented as straight line (union of original polygon and rectangle)
3. **Voronoi Diagram** - Voronoi diagram allows to easily create _separation regions_, but it works for points only.
Maybe it could be used for polygons too? ; **coming in stage 3**
4. **Tests**:
   0. **Verify output against input data - all coordinates assigned to input coutry should be part of it in output!**
   1. set of pairs `(coordinates, country_code)` that generated output should match;
   2. The trickier the pairs (e.g. regions with mixed spots or irregular borders), the better testing set;
   3. Basic testing would be to generate a net of points created from data_input, covering all land with assigned country code,
   but this testing would force specific accuracy (border irregularities beyond net width won't be detected)
