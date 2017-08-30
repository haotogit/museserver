const uuid = require('uuid/v4');

module.exports = (request) => {
  const correlationId = uuid();
  let { url, method } = request;

  request.correlationId = correlationId;

  return {
    url,
    method,
    correlationId
  };
};
