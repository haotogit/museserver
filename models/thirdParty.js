const mongoose = require('mongoose');

const conn = require('../utilities/connectDb');

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

const ThirdParty = conn.model('ThirdParty', ThirdPartySchema);

module.exports.create = (options) => ThirdParty.create(options);

module.exports.getByUserId = (id) => ThirdParty.find({ userId: id }).exec('find');

module.exports.update = (id, updateInfo) => ThirdParty.findOneAndUpdate({ _id: id }, updateInfo, { new: true })
  .populate('artists')
  .catch(err => {
    throw new Error(`error updating thirdparty id: ${id}`);
  });

module.exports.delete = (id) => ThirdParty.findOneAndRemove({ _id: id }).exec();
