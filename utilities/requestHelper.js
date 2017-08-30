const uuid = require('uuid/v4');

module.exports = (request) => {
  let { url, method } = request;

  return { url, method, correlationId: uuid() };
};
