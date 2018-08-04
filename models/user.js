const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');

const conn = require('../utilities/connectDb'),
  config = require('../config/config');

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
}, { timestamps: true });

UserSchema.pre('save', function(next, done) {
  let user = this;

  if (!this.isModified('password')) return next();

  bcrypt.hash(user.password, 10).then(function(hash) {
    user.password = hash;
    next();
  });
});

UserSchema.methods.public = function() {
  let obj = Object.assign({}, this.toJSON());
  delete obj.password;
  return obj;
};

UserSchema.methods.comparePassword = function(password, cb) {
  return bcrypt.compare(password, this.password);
};

const User = conn.model('User', UserSchema);

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
      if (err) throw new Error(err.message);

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
  .populate('thirdParties')
  .populate({
    path: 'thirdParties',
    populate: {
      path: 'artists'
    }
  })
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
              resolve(result.public())
            });
          });
        });
      });
  });

module.exports.getById = (id) => User.findOne({ _id: id }).exec();

module.exports.update = (id, updateInfo) => User.findOneAndUpdate({ _id: id }, updateInfo, { new: true }).populate('thirdParties')
  .populate({
    path: 'thirdParties',
    populate: {
      path: 'artists'
    }
  }).exec()
  .catch((err) => {
    throw new Error(`Error updating user error: ${err.message}`);
  });

module.exports.getAll = () => User.find();
