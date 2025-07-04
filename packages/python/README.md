# Quick Coordinates To Country (QC2C)

QC2C is a package that provides fast, offline country lookup based on geographic coordinates.

## About

This project aims at creation of standard,
approximate offline check whether coordinates are within countries borders
and return country code in ISO Alpha 3.

Approximate borders were created in `main.py` with:

- convex hull of a country
- `geometry.simplify` to reduce amount of points
- multiple iterations to remove unnecessary border points with smoothed curves

### Features

- Approximate offline country lookup using coordinates
- Sectorized approach for performance and scalability
- Uses ISO Alpha-3 country codes for outputs
- Supports gzip-compressed JSON data for efficient loading
- Pure Python implementation for easy integration

### Limitations

- Works only on land coordinates; sea borders are not supported
- Borders are approximate and simplified for performance
- Not intended for political or legal use

## Implementation

### Package Contents

- **core.py**  
  Core logic for:
  - Determining which sector a coordinate falls into (`get_sector`)
  - Identifying the country within a sector (`get_country`)
  - Checking if a point lies inside a polygon (`point_in_polygon`)

- **main.py**  
  Script to generate approximate country border data by:
  - Computing convex hulls of countries
  - Simplifying geometries to reduce points
  - Iteratively smoothing borders to remove artifacts

- **world_sectors.json** and **world_sectors_x.json**  
  Manifest files defining geographic sectors for faster coordinate lookup.

### Compression

Results were compressed with `gzip` to reduce files size and make them accessible for `javascript` applications,
as browsers have native support for this compression algorithm.

It is possible that other compression algorithms (such as `Brotli`) would provide smaller size,
but they are not standard yet.

### How to use

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

- Improved shoreline simplification and polygon triangulation:
  - sea borders can be greatly reduced
  - shore lines can also be represented as straight line (union of original polygon and rectangle))
- islands reduction:
  - islands can be represented as squares or triangles, if they would not intersect with anything else
- Voronoi diagram based region separation
  - best for optimizing islands and shorelines
- Tests:

   0. **Verify output against input data - all coordinates assigned to input coutry should be part of it in output!**
   1. set of pairs `(coordinates, country_code)` that generated output should match;
   2. The trickier the pairs (e.g. regions with mixed spots or irregular borders), the better testing set;
   3. Basic testing would be to generate a net of points created from data_input, covering all land with assigned country code,
   but this testing would force specific accuracy (border irregularities beyond net width won't be detected)
