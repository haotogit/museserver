const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: String,
  images: [Schema.Types.Mixed],
  popularity: Number,
  externalId: {
    type: String,
    index: true,
  },
  externalUri: String
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true 
  },
  toObject: {
    virtuals: true
  }
});

ArtistSchema.virtual('genres', {
  ref: 'Genre',
  localField: '_id',
  foreignField: 'artistId'
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports.create = (newArtist) => Artist.create(newArtist);
