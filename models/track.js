const mongoose = require('mongoose');
const promise = require('bluebird');

const conn = require('../utilities/connectDb'),
  config = require('../config/config');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  name: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

const Track = conn.model('Track', TrackSchema);

module.exports.create = (options) => Track.create(options);
