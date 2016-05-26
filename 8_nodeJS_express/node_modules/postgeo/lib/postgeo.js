(function () {
  var async = require("async"),
      pg = require("pg"),
      topojson = require("topojson");

  var postgeo = {};

  postgeo.connect = function(credentials) {
    this.connection = credentials;
  }

  postgeo.query = function(query, format, callback) {
    var root = this;

    async.waterfall([
      function(callback) {
        if (query.indexOf("AS geometry") !== -1) {
          callback(null)
        } else {
          callback({ "error": "query must select GeoJSON geometry 'AS geometry'" });
        }
      },
      function(callback) {
        pg.connect(root.connection, function(error, client, done) {
          if (error) {
            callback({ "error": error });
            client.end();
          } else {
            client.query(query, function(err, result) {
              if (err) {
                client.end();
                callback({ "error": err });
              } else {
                client.end();
                callback(null, { "geometry": result.rows });
              }
            });
          }
        });
      },
      function(data, callback) {
        var output = { "type": "FeatureCollection", "features": [] };

        async.each(data.geometry, function(row, geomCallback) {
          var parsedRow = { "type": "Feature", "geometry": JSON.parse(row.geometry) };

          if (Object.keys(row).length > 1) {
            parsedRow.properties = {};
            async.each(Object.keys(row), function(property, propCallback) {
              if (property != "geometry") {
                parsedRow.properties[property] = row[property];
              }
              propCallback();
            }, function(error) {
              output.features.push(parsedRow)
              geomCallback();
            });
          } else {
            output.features.push(parsedRow)
            geomCallback();
          }
          
        },
        function(err) {
          if (format === "topojson") {
            callback(null, topojson.topology({ output: output }));
          } else {
            callback(null, output);
          }
        });
      }
    ],function(error, data) {
      if (error) {
        callback(error);
      } else {
        callback(data);
      }
    });
  }

  module.exports = postgeo;
})();