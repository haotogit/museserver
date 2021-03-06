const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');
const makeToken = require('../utilities/make-token');
const config = require('../config/config');
const tools = require('../utilities/tools');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true
  },
  password: { 
    type: String, 
    required: true,
  },
  roles: [String],
  name: String,
  lat: Number,
  long: Number,
  searchOpts: {
    currSrc: String,
    by: String
  },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true 
  },
  toObject: {
    virtuals: true
  }
});

// arrays that grow without bound are a MongoDB
// anti-pattern per docs
// https://mongoosejs.com/docs/populate.html#populate-virtuals
UserSchema.virtual('artists', {
  ref: 'Artist',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('tracks', {
  ref: 'Track',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('genres', {
  ref: 'Genre',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('thirdParties', {
  ref: 'ThirdParty',
  localField: '_id',
  foreignField: 'userId'
});

const auxModels = {
  genres: {
    fields: 'name createdAt updatedAt',
    sorter: 'factor'
  },
  artists: {
    fields: 'name createdAt updatedAt',
    sorter: 'factor'
  },
  tracks: {
    fields: 'name createdAt updatedAt',
    sorter: 'factor'
  },
  thirdParties: {
    fields: ''
  }
};

function mapListItem(type, list) {
  let key,
    i = 0,
    aggregated = {},
    total = list.length;

  while (i < list.length) {
    key = tools.upperCaser(list[i].name);
    if (aggregated[key]) {
      aggregated[key].factor++;
    } else {
      aggregated[key] = {
        name: key,
      };

      aggregated[key].factor = 1;
    }

    i++;
  }

  return Object.keys(aggregated).map((key) => {
    return aggregated[key];
  });
}

UserSchema.methods.public = function() {
  let obj = Object.assign({}, this.toJSON());
  delete obj.password;
  return obj;
};

UserSchema.methods.comparePassword = function(password, cb) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.makeProfile = function() {
  this.genres = this.genres && this.genres.length !== 0 ? mapListItem('genres', this.genres) : null;
  this.artists = this.artists && this.artists.length !== 0 ? mapListItem('artists', this.artists) : null;
  this.tracks = this.tracks && this.tracks.length !== 0 ? mapListItem('tracks', this.tracks) : null;
  return this;
};

// this didn't work... booohooo
UserSchema.methods.loadProfile = function(filter) {
  console.log('filter===', filter)
  let arr, prevIndex, key;
  let regx = RegExp(':', 'g');
  while((arr = regx.exec(filter)) !== null) {
    key = prevIndex ? 
      filter.substring(prevIndex, arr.index) : filter.substring(0, arr.index);
    prevIndex = arr.index+1;
    console.log('key===', key)
    this.populate(key);
  }
    console.log('this===', this)
  return this;
};

UserSchema.pre('save', function(next) {
  let user = this;

  if (!this.isModified('password')) return next();

  bcrypt.hash(user.password, 10).then(function(hash) {
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
// this is because mongoose queries return query object and are not promises
const promiser = require('../utilities/query-promiser')(User);

module.exports.createUser = (newUser) => {
  newUser.searchOpts = {
    currSrc: 'spotify',
    by: 'artists'
  };

  return promiser('create', newUser);
};

module.exports.authUser = (creds) => promiser('findOne', { username: creds.username })
  .then((user) => {
    let accessToken;

    if (!user) throw new Error(`No user found with: ${JSON.stringify(creds)}`);

    return user.comparePassword(creds.password)
      .then((resp) => {
        if (!resp) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

        return new Promise((resolve, reject) => {
          jwt.sign(makeToken(user), config.app.tokenSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw new Error(err.message);
            accessToken = token;
            resolve(user);
          });
        })
        .then((currUser) => exports.withProfile(currUser._id, 'all'))
        .then((userWithProfile) => {
          userWithProfile.accessToken = accessToken;
          return userWithProfile;
        });
      });
  });

module.exports.getById = (id, opts) => promiser('findById', id)
  .then(user => user.public());

module.exports.getByIdRaw = (id) => promiser('findById', id);

module.exports.update = (_id, updateInfo) => new Promise((resolve, reject) => {
  User.findOneAndUpdate({ _id }, updateInfo, { new: true })
    .then(result => result.public())
    .catch(reject);
});

module.exports.withProfile = (_id, filter) => {
  let query, regx, prevIndex, arr;
    query = User.findById(_id);
    regx = RegExp(':', 'g');

  if (filter === 'all') {
    for (let key in auxModels) {
      query.populate({
        path: key,
        select: auxModels[key].fields,
      });
    }
  } else {
    // TODO: review and fix
    while((arr = regx.exec(filter)) !== null) {
      key = prevIndex ? 
        filter.substring(prevIndex, arr.index) : filter.substring(0, arr.index);
      prevIndex = arr.index+1;
      query.populate(key);
    }
  }

  return new Promise((resolve, reject) => {
    query
      .then(user => resolve(user.makeProfile().public()))
      .catch(reject);
  });
};
