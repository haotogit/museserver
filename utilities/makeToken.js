const moment = require('moment');

module.exports = (newUser) => {
  let obj = {};
  let fields = ['roles', '_id'];
  fields.forEach(field => obj[field] = newUser[field]);
  return obj;
};
