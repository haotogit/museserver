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
    required: true,
    index: true
  }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

module.exports.create = (options) => Event.create(options);

module.exports.getUserEvents = (userId) => Event.find({ userId });

module.exports.deleteEvent = (_id) => new Promise((resolve, reject) => {
  Event.deleteOne({ _id })
    .then(ev => resolve(ev.result))
    .catch(err => reject(err));
})
  
