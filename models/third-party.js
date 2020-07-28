const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Schema = mongoose.Schema;

const ThirdPartySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  source: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Number,
  top10: Array,
  lastEval: Date,
}, { timestamps: true });

const ThirdParty = mongoose.model('ThirdParty', ThirdPartySchema);
const promiser = require('../utils/query-promiser')(ThirdParty);

module.exports.create = (options) => promiser('create', options);

module.exports.getByUserId = (id) => promiser('findOne', { userId: id });

module.exports.update = (id, updateInfo) => ThirdParty.findOneAndUpdate({ _id: id }, updateInfo, { upsert: true, useFindAndModify: false });

module.exports.delete = (_id) => promiser('findOneAndRemove', { _id });
