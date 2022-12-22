const { lineString } = require("@turf/turf");
const axios = require("axios");
const osmtogeojson = require("osmtogeojson");

const overpassAPI = axios.create({
  baseURL: "https://overpass-api.de/api/interpreter",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

/**
 * Executes query on the OSM Overpass API
 * @param {string} query query to execute in Overpass DSL
 * @param {boolean} toGeoJson return the results in GeoJson format
 * @returns {Promise<object>} the result of the query in the format specified
 */
function queryOverpass(query, toGeoJson = true) {
  return new Promise((resolve, reject) => {
    overpassAPI.get("", { data: "data=" + encodeURIComponent("[out:json];" + query) })
    .then(({ data }) => resolve(toGeoJson ? osmtogeojson(data) : data))
    .catch(e => reject(e));
  });
}

/**
 * Converts a long operator name to an abbreviation (e.g. Union Pacific -> UP)
 * @param {string} operator long operator name
 * @returns {string} abbreviated operator name
 */
function operatorToAbbreviation(operator) {
  // for right now, just keep uppercase letters
  return operator.match(/[A-Z]/g).join('');
}

/**
 * Gets a list of nearby railroads to a given location and radius
 * @param {string} coordinates location around which to search
 * @param {number} radius radius (in meters) of search around coordinates
 * @returns {Promise<object[]>} array of nearby railroads with OSM id and name
 */
module.exports.getNearbyRailroads = async function(coordinates, radius) {
  const query = `rel[route="railway"](around:${radius},${coordinates});
    out tags;`;
  const { elements } = await queryOverpass(query, false);
  return elements.map(railway => ({
    name: `[${operatorToAbbreviation(railway.tags.operator)}] ${railway.tags.name}`,
    id: railway.id
  }))
}

/**
 * Get a polyline representing the entire railway (for drawing on a map)
 * @param {number} railwayId OSM id of the railway
 * @returns {object} OSM linestring of all nodes of the railway
 */
module.exports.getRailroadPolyline = async function(railwayId) {
  const query = ``;
  const nodes = await queryOverpass(query);
  return lineString(nodes.features.map(point => point.geometry.coordinates));
}

/**
 * Get all level crossings for a given railway
 * @param {number} railwayId OSM id of the railway
 * @returns {object} OSM linestring of all crossings on the railway
 */
module.exports.getAllCrossings = async function(railwayId) {
  const query = `rel(id:${railwayId});
  way(r);
  node(w)["railway"="level_crossing"];
  
  out qt;`

  const crossings = await queryOverpass(query);
  return lineString(crossings.features.map(point => point.geometry.coordinates));
}



// determine current railway and direction

// get all crossings on railway, order points

// compare CL to next crossing

