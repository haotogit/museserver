const User = require('./models/user');

User.authUser({ username: 'barry', password: 'password' })
  .then(user => {
    console.log('tellllll==', user);
  })
