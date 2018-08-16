const User = require('./models/user');

User.withProfile('5b6bf677a184e54b03cdf0b7', 'thirdParties:artists:')
  .then(user => {
    console.log('tellllll==', user);
  })
