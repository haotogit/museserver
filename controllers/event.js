const evProcessor = require('../processors/event');
const responder = require('../utilities/response-helper');

module.exports.createEvent = (req, res, next) => {
  const { body, correlationId } = req;

  evProcessor.createEvent(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};
