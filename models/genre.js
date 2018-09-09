const mongoose = require('mongoose');
const config = require('../config/config');

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

const Genre = mongoose.model('Genre', GenreSchema);
const promiser = require('../utilities/query-promiser')(Genre);

module.exports.create = (options) => promiser('create', options);
