const mongoose = require('mongoose');

const conn = require('../utilities/connectDb'),
  config = require('../config/config');

const Schema = mongoose.Schema;

const ThirdPartySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: String,
  access_token: String,
  refresh_token: String,
  artists: Array,
  genres: Array,
  top10: Array,
  tracks: Array,
}, { timestamps: true });

const ThirdParty = conn.model('ThirdParty', ThirdPartySchema);

module.exports.create = (options) => ThirdParty.create(options);

module.exports.getByUserId = (id) => ThirdParty.find({ userId: id }).exec();

module.exports.getAll = () => ThirdParty.find().exec();
