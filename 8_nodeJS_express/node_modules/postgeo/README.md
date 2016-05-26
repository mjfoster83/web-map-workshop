# postgeo
A Node.js module for returning [PostGIS](http://postgis.net/) queries as usable [GeoJSON](http://geojson.org/) or [TopoJSON](https://github.com/mbostock/topojson) objects. While PostGIS allows you to select geometries as GeoJSON with [ST_AsGeoJSON](http://www.postgis.org/docs/ST_AsGeoJSON.html), it does not return the entire query as a usable GeoJSON FeatureCollection for use with mapping APIs such as [Leaflet.js](http://leafletjs.com/) or [D3.js](http://d3js.org/).

Heavily influenced by Bryan McBride's [PostGIS to GeoJSON](https://gist.github.com/bmcbride/1913855/) PHP script and [postgis2geojson.py](https://github.com/jczaplew/postgis2geojson).

###### Example Usage
````
var postgeo = require("postgeo");

postgeo.connect("postgres://user@host:port/database");

postgeo.query("SELECT id, name ST_AsGeoJSON(geom) AS geometry FROM table", "geojson", function(data) {
    console.log(data);
});
````

######  Installation
````
npm install postgeo
````


## API
The API is very limited for now, but there is a lot of room for extension and improvement. Feel free to contribute!

---------------------------------------

### connect(credentials)
Takes a single string parameter, credentials, in the format

 ````
postgres://user@host:port/database
````
 In most cases _host_ will be ```localhost``` and _port_ will be ```5432```.

---------------------------------------

### query(sql, format, callback(output))
**Arguments** (all are required)

+ sql - The query to be executed on the database. **Must include _ST_AsGeoJSON(geom) AS geometry_ ** in order to work properly.
+ format - can be either "geojson" or "topojson"
+ callback - a function with one parameter that returns the output of the query

---------------------------------------

## License
CC0


