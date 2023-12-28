# Stage 4
1. copy stage 3 results
2. unpack gzip files!
3. merge all polygons that overlap itself within a single country - 
no need to keep all of them if they cover the same area
4. simplify polygons with `Voronoi diagrams` - remove all unnecessary borders
