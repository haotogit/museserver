const mongoose = require('mongoose');
const config = require('../config/config');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

const Track = mongoose.model('Track', TrackSchema);
const promiser = require('../utils/query-promiser')(Track);

module.exports.create = (options) => promiser('create', options);
