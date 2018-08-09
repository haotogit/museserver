const mongoose = require('mongoose');
const promise = require('bluebird');

const conn = require('../utilities/connectDb'),
  config = require('../config/config');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
    index: true
  }
}, { timestamps: true });

const Genre = conn.model('Genre', GenreSchema);

module.exports.create = (options) => Genre.create(options);
