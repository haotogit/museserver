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
  thirdParty: [{ type: Schema.Types.ObjectId, ref: 'ThirdParty' }],
  events: Array
}, { timestamps: true })

UserSchema.pre('save', function(next, done) {
  let user = this;

  console.log(this)

  if (!this.isModified('password')) return next();

  bcrypt.hash(user.password, 10).then(function(hash) {
    user.password = hash;
    next();
  });
});

UserSchema.methods.public = function() {
  let obj = this;
  delete obj.password;
  return obj;
};

UserSchema.methods.comparePassword = function(password, cb) {
  return bcrypt.compare(password, this.password);
};

const User = conn.model('User', UserSchema);

function makeTokenObj(newUser) {
  let obj = {},
    fields = ['username', 'roles'];

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
    jwt.sign(makeTokenObj(newUser), config.app.tokenSecret, (err, token) => {
      if (err) throw reject(err);

      newUser.accessToken = token;

      newObj = new User(newUser);

      return resolve(newObj.save());
    });
  });
};

module.exports.authUser = (creds) => User.findOne({ username: creds.username })
  .then((user) => {
    if (!user) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

    return user.comparePassword(creds.password)
      .then((resp) => {
        if (!resp) throw new Error(`Wrong credentials: ${JSON.stringify(creds)}`);

        return user;
      });
  });

module.exports.getById = (id) => User.findOne({ _id: id });

module.exports.getAll = () => User.find();
