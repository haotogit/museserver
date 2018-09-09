const mongoose = require('mongoose');
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
}, { timestamps: true });

const ThirdParty = mongoose.model('ThirdParty', ThirdPartySchema);
const promiser = require('../utilities/query-promiser')(ThirdParty);

module.exports.create = (options) => promiser('create', options);

module.exports.getByUserId = (id) => promiser('find', { userId: id });

module.exports.update = (id, updateInfo) => ThirdParty.findOneAndUpdate({ _id: id }, updateInfo, { new: true })
  .populate('artists')
  .catch(err => {
    throw new Error(`error updating thirdparty id: ${id}`);
  });

module.exports.delete = (_id) => promiser('findOneAndRemove', { _id });
