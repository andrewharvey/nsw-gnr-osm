# About
Tools to help turn the Geographical Names Board of New South Wales (GNB) [Geographical Names Register (GNR)](http://www.gnb.nsw.gov.au/place_naming/placename_search) into an OSM like schema in the GeoJSON and OSM format.

Skip the build and use the pre-built [gnr.osm](https://github.com/andrewharvey/nsw-gnr-osm/blob/master/dist/gnr.osm) or [gnr.osm.geojson](https://github.com/andrewharvey/nsw-gnr-osm/blob/master/dist/gnr.osm.geojson).

# Licensing
The GNR is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/deed.en). © State of New South Wales through the Geographical Names Board 2016. http://www.gnb.nsw.gov.au/copyright

The OSMF CC BY Waiver [has been completed by the Geographical Names Board](https://wiki.openstreetmap.org/wiki/File:NSW_GNB_170427_OpenStreetMap.pdf) meaning this data is free to be used in OpenStreetMap.

This code is [licensed](https://github.com/andrewharvey/nsw-gnr-osm/blob/master/LICENSE) under The ISC License.

# Install & Run

Instal the prerequisites `make npm wget unzip`.

Install the Node dependencies:

    npm install

Run the script to generate the .geojson and .osm files:

    make
