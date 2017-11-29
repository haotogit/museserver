const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const conn = require('../utilities/connectDb');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  access_token: String,
  user_type: String,
  name: String,
  lat: Number,
  long: Number,
  spotify: {
    id: String,
    profile_pic: String,
    access_token: String,
    refresh_token: String,
    artists: Array,
    genres: Array,
    top10: Array
  },
  searchOpts: {
    currSrc: String,
    by: String
  },
  actvity_id: [{ type: Schema.Types.ObjectId, ref: 'activity' }],
  notification_id: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  events: Array
}, { timestamps: true })

UserSchema.pre('save', function(next, done) {
  let user = this;

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

module.exports.createUser = (newUser) => {
  const newObj = new User(newUser);
  return newObj.save();
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
