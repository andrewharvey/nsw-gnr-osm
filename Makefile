all: dist/gnr.osm

gnr.zip:
	wget http://www.gnb.nsw.gov.au/__gnb/$@
	wget http://www.gnb.nsw.gov.au/__data/assets/pdf_file/0011/59627/Glossary_of_Designation_Values_2017.pdf
	wget http://www.gnb.nsw.gov.au/__data/assets/pdf_file/0003/59628/Glossary_of_Status_Values_GNB.pdf

gnr.csv: gnr.zip
	unzip $<
	cat gnr_part1.csv | head -n 6 | tail -n 1 > $@
	for f in gnr_part*.csv ; do cat $$f | tail -n +7 >> $@ ; done
	rm -f $< gnr_part*.csv

dist/gnr.osm.geojson: gnr.csv
	./src/gnr2geojson-osm.js

dist/gnr.osm: dist/gnr.osm.geojson
	./node_modules/.bin/geojson2osm $< > $@

clean:
	rm -f gnr.zip gnr.csv gnr.osm.geojson gnr.osm Glossary_of_Designation_Values_2017.pdf Glossary_of_Status_Values_GNB.pdf
