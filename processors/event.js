const Event = require('../models/event');

module.exports.createEvent = (newEv) => Event.create(newEv);
