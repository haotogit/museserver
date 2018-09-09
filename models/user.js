const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');
const makeToken = require('../utilities/make-token');

const config = require('../config/config');

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

function mapListItem(type, list) {
  let i = 0, j, newObj, aggregated = {},
    total = list.length;
  let dict = {
    genres: {
      fields: ['name', 'factor', 'createdAt', 'updatedAt'],
      sorter: 'factor'
    },
    artists: {
      fields: ['name', 'factor', 'createdAt', 'updatedAt'],
      sorter: 'factor'
    },
    tracks: {
      fields: ['name', 'factor', 'createdAt', 'updatedAt'],
      sorter: 'factor'
    }
  };

  while(i < list.length) {
    let key = list[i].name;
    if (aggregated[key]) {
      aggregated[key].factor++;
    } else {
      aggregated[key] = {};
      aggregated[key].factor = 1;
    }

    aggregated[key]['pct'] = parseFloat(aggregated[key].factor / total).toFixed(1) * 10;
    i++;
  }

  return Object.keys(aggregated).map(key => {
    j = 0;
    newObj = {};
    while(j < dict[type].fields.length) {
      let currFields = dict[type].fields;
      newObj[currFields[j]] = aggregated[key][currFields[j]];
      j++;
    }

    newObj.name = key;
    return newObj;
  })
  .sort((a, b) => {
    if (a[dict[type].sorter] < b[dict[type].sorter]) return 1;
    else if (a[dict[type].sorter] > b[dict[type].sorter]) return -1;
    return 0;
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
  let regx, lastIndex, key, arr;
  this.genres = this.genres && this.genres.length !== 0 ? mapListItem('genres', this.genres).splice(0, 50) : null;
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
    if (!user) throw new Error(`No user found with: ${JSON.stringify(creds)}`);

    return user.comparePassword(creds.password)
      .then((resp) => {
        if (!resp) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

        return new Promise((resolve, reject) => {
          jwt.sign(makeToken(user), config.app.tokenSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw new Error(err.message);
            user.accessToken = token;
            resolve(user.public());
          });
        });
      });
  });

module.exports.getById = (id, opts) => promiser('findById', id)
  .then(user => user.public());

module.exports.getByIdRaw = (id) => promiser('findById', id);

module.exports.update = (_id, updateInfo) => promiser('findOneAndUpdate', { _id }, updateInfo, { new: true });

module.exports.withProfile = (_id, filter) => {
  let query, regx, prevIndex, arr;
    query = User.findById(_id);
    regx = RegExp(':', 'g');
  let models = ['thirdParties', 'artists', 'genres', 'tracks'];
  if (filter === 'all') {
    for(let i = 0; i < models.length; i++) {
      query.populate(models[i]);
    }
  } else {
    while((arr = regx.exec(filter)) !== null) {
      key = prevIndex ? 
        filter.substring(prevIndex, arr.index) : filter.substring(0, arr.index);
      prevIndex = arr.index+1;
      query.populate(key);
    }
  }

  return new Promise((resolve, reject) => {
    query
      .then(user => resolve(user.makeProfile(filter)))
      .catch(reject);
  });
};
