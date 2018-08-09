const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');

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
  accessToken: {
    type: String,
  },
  roles: [String],
  name: String,
  lat: Number,
  long: Number,
  searchOpts: {
    currSrc: String,
    by: String
  },
  thirdParties: [{ type: Schema.Types.ObjectId, ref: 'ThirdParty' }],
  // need to separate as it's own model
  events: Array
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

function mapGenres(genres) {
  let i = 0, j, aggregated = {};
  while(i < genres.length) {
    let key = genres[i].name;
    if (aggregated[key]) aggregated[key]++;
    else aggregated[key] = 1;
    i++;
  }
  return aggregated;
}

UserSchema.methods.public = function() {
  let obj = Object.assign({}, this.toJSON());
  delete obj.password;
  // temp couldn't get a virtual to work or maybe 
  // needs to hook another way;
  if (obj.genres) obj.genres = mapGenres(obj.genres);
  return obj;
};

UserSchema.methods.comparePassword = function(password, cb) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function(next) {
  let user = this;

  if (!this.isModified('password')) return next();

  bcrypt.hash(user.password, 10).then(function(hash) {
    user.password = hash;
    next();
  });
});

UserSchema.pre('findOne', function(next) {
  this.populate('thirdParties');
  this.populate('artists');
  this.populate('genres');
  this.populate('tracks');
  next();
});

const User = mongoose.model('User', UserSchema);

function makeTokenObj(newUser) {
  let obj = {},
    fields = ['username', 'roles', '_id'];

  fields.forEach(field => obj[field] = newUser[field]);

  return obj;
}

module.exports.createUser = (newUser) => {
  let newObj;
  if (!newUser.roles) {
    newUser.roles = [];
    newUser.roles.push('user');
  }

  return new Promise((resolve, reject) => {
    jwt.sign(makeTokenObj(newUser), config.app.tokenSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) reject(new Error(err.message));

      newUser.accessToken = token;

      newObj = new User(newUser);
      newObj.searchOpts = {
        currSrc: 'spotify',
        by: 'artists'
      }

      newObj.save((err, result) => {
        if (err) reject(new Error(`err ${err.message}`));
        resolve(result.public());
      });
    });
  });
};

module.exports.authUser = (creds) => User.findOne({ username: creds.username })
  .then((user) => {
    if (!user) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

    return user.comparePassword(creds.password)
      .then((resp) => {
        if (!resp) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

        return new Promise((resolve, reject) => {
          jwt.sign(makeTokenObj(user), config.app.tokenSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw new Error(err.message);

            user.accessToken = token;
            user.save((err, result) => {
              if (err) reject(new Error(`err ${err.message}`));
              resolve(result.public());
            });
          });
        });
      });
  });

module.exports.getById = (id) => User.findOne({ _id: id })
  .exec()
  .then(user => user.public())

module.exports.update = (id, updateInfo) => User.findOneAndUpdate({ _id: id }, updateInfo, { new: true }).populate('thirdParties').exec();

module.exports.getAll = () => User.find();
