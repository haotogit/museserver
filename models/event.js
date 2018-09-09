const mongoose = require('mongoose');
const config = require('../config/config');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  externalId: {
    type: String,
    index: true
  }
}, {
  timestamps: true,
  strict: false
});

const Event = mongoose.model('Event', EventSchema);
const promiser = require('../utilities/query-promiser')(Event);

module.exports.create = (options) => promiser('create', options);

module.exports.getUserEvents = (userId) => promiser('find', { userId });

module.exports.deleteEvent = (_id) => promiser('deleteOne', { _id });
