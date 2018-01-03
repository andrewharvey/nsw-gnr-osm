#!/usr/bin/env node

var fs = require('fs');
var csv = require('ya-csv');
var assert = require('assert');

var valueMap = {
    'GAZETTE DATE': 'start_date:name',
    'PREVIOUS NAMES': 'old_name',
    'DESCRIPTION': 'description',
    'PLACENAME': 'name',
    'GEOGRAPHICAL NAME': 'alt_name',
    'ORIGIN': 'name:origin',
    'MEANING': 'name:meaning'
};

var schemaMap = {};
// http://www.gnb.nsw.gov.au/__data/assets/pdf_file/0011/59627/Glossary_of_Designation_Values.pdf
var schemaReader = csv.createCsvFileReader('src/gnrToOSMMapping.csv', {
    separator: '\t',
    columnsFromHeader: true
});
schemaReader.addListener('data', function (data) {
    schemaMap[data.designation] = data.tags ? data.tags.split(',') : null;
});

schemaReader.addListener('end', function (data) {
    var reader = csv.createCsvFileReader('gnr.csv', {
        nestedQuotes: true,
        columnsFromHeader: true
    });
    var features = [];
    reader.addListener('data', function (data) {
        var coordinates = [data['APPROX. GDA94 LONG'], data['APPROX. GDA94 LAT']];
        coordinates = coordinates.map((coordinate) => {
            var dms = coordinate.trim().split(/\s+/);
            if (dms.length != 3) {
                // no coordinates
                return null;
            }
            var dd = Math.abs(dms[0]) + dms[1]/60 + dms[2]/3600;
            if (dms[0].startsWith('-')) {
                dd *= -1;
            }
            return new Number(dd.toFixed(5));
        });

        var properties = {};

        Object.keys(valueMap).forEach(function(key,index) {
            var value = data[key].trim();
            var tagKey = valueMap[key];
            if (value) {
                if (tagKey == 'name') {
                    switch (data['STATUS']) {
                        case 'ABANDONED':
                            tagKey = 'abandoned:name';
                            break;
                        case 'ADVERTISED':
                            tagKey = 'planned:name';
                            break;
                        case 'ASSIGNED':
                        case 'ASSIGNED EDU':
                        case 'ASSIGNED NPWS':
                        case 'CONCUR':
                            break;
                        case 'DEFERRED':
                            tagKey = 'planned:name';
                            break;
                        case 'DISCONTINUED':
                            tagKey = 'historic:name';
                            break;
                        case 'DUAL PROPOSED':
                            tagKey = 'proposed:name';
                            break;
                        case 'DUAL ADVERT':
                            tagKey = 'planned:name';
                            break;
                        case 'PROPOSED':
                            tagKey = 'proposed:name';
                            break;
                        case 'RECORDED':
                            tagKey = 'name';
                            break;
                        case 'REJECTED':
                            tagKey = 'removed:name';
                            break;
                        case 'VARIANT':
                            tagKey = 'alt_name1';
                            break;
                        case 'WITHDRAWN':
                            tagKey = 'removed:name';
                            break;
                    }
                }
                properties[tagKey] = value;
            }
        });

        var keys = schemaMap[data['DESIGNATION']];
        if (keys) {
            keys.forEach((key) => {
                var tag = key.split('=');
                assert(tag.length == 2, 'In gnrToOSMMapping.csv expected a key=value but that was not found.');
                properties[tag[0]] = tag[1];
            });
        }

        properties['gnr_designation'] = data['DESIGNATION'];

        var feature = {
            type: 'Feature',
            properties: properties,
            geometry: (coordinates[0] === null || coordinates[1] === null) ? null : {
                type: 'Point',
                coordinates: coordinates
            }
        };
        features.push(feature);
    });

    reader.addListener('end', function (data) {
        var geojson = {
            type: 'FeatureCollection',
            features: features
        };

        fs.writeFileSync('gnr.osm.geojson', JSON.stringify(geojson));
    });
});
