const mongoose = require('mongoose');

const conn = require('../utilities/connectDb');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: String,
  images: Array,
  genres: Array,
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
