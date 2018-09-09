const evProcessor = require('../processors/event');
const responder = require('../utilities/response-helper');

module.exports.createEvent = (req, res, next) => {
  const { body, correlationId } = req;

  evProcessor.createEvent(body)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.getUserEvents = (req, res, next) => {
  const { id } = req.params;
  const { correlationId } = req;
  evProcessor.getUserEvents(id)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};

module.exports.deleteEvent = (req, res, next) => {
  const { id } = req.params;
  const { correlationId } = req;
  evProcessor.deleteEvent(id)
    .then((resp) => responder(res, resp, correlationId))
    .catch(next);
};
