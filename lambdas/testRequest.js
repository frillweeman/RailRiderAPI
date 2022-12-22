const { getNearbyRailroads } = require("./overpass")

module.exports.handler = async (event) => {
  console.log('Event: ', event);
  const params = event.queryStringParameters;

  try {
    const railways = await getNearbyRailroads(params.coordinates, params.radius);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(railways)
    }
  } catch(e) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: e
      })
    };
  }
}
