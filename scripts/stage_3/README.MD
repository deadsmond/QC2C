# Stage 3
1. copy stage 2 results
2. merge all polygons that overlap itself within a single country - 
no need to keep all of them if they cover the same area
3. simplify polygons with `Voronoi diagrams` - remove all unnecessary borders
