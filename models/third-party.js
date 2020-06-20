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

module.exports.getByUserId = (id) => promiser('find', { userId: id });

module.exports.update = (id, updateInfo, correlationId) => new Promise((resolve, reject) => {
  // don't new there, remove
  ThirdParty.findOneAndUpdate({ _id: id }, updateInfo, { new: true })
    .then(res => {
      logger.info(`Updated thirdPartyId ${id}, with: ${JSON.stringify(updateInfo)}, correlationId ${correlationId}`);
      resolve(res);
    })
    .catch(reject);
});

module.exports.delete = (_id) => promiser('findOneAndRemove', { _id });
