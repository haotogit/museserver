const User = require('./models/user');

User.getById('5b6b8811744172dcb30cdc11')
  .then(user => {
    console.log('tellllll==', user);
  })
