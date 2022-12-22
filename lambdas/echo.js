module.exports.handler = async (event) => {
  console.log('Event: ', event);
  const responseMessage = 'Hello, World';
  const params = event.queryStringParameters;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: responseMessage,
      params
    })
  };
}
