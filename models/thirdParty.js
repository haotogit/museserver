const mongoose = require('mongoose');

const conn = require('../utilities/connectDb');

const Schema = mongoose.Schema;

const ThirdPartySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Number,
  artists: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  genres: Array,
  top10: Array,
  tracks: Array,
}, { timestamps: true });

const ThirdParty = conn.model('ThirdParty', ThirdPartySchema);

module.exports.create = (options) => ThirdParty.create(options);

module.exports.getByUserId = (id) => ThirdParty.find({ userId: id }).exec('find');

module.exports.update = (id, updateInfo) => new Promise((resolve, reject) => {
  return ThirdParty.findOneAndUpdate({ _id: id }, updateInfo, (err, result) => {
    if (err) throw new Error(`error updating thirdparty id: ${id}`)
      resolve(result);
  });
});

module.exports.delete = (id) => ThirdParty.findOneAndRemove({ _id: id }).exec();
