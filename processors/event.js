const Event = require('../models/event');

module.exports.createEvent = (newEv) => Event.create(newEv);

module.exports.getUserEvents = (userId) => Event.getUserEvents(userId);

module.exports.deleteEvent = (id) => Event.deleteEvent(id);
