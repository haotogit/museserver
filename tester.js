const User = require('./models/user');

User.getById('5b6bb71cfb732207e048f87b')
  .then(user => {
    console.log('tellllll==', user);
  })
