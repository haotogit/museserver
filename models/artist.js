const mongoose = require('mongoose');

const conn = require('../utilities/connectDb');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: String,
  images: Array,
  genres: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  popularity: Number,
  externalId: {
    type: String,
    index: true,
    unique: true
  },
  externalUri: String
}, { timestamps: true });

const Artist = conn.model('Artist', ArtistSchema);

module.exports.create = (newArtist) => Artist.create(newArtist);
