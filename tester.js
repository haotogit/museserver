const User = require('./models/user');
const ThirdParty = require('./models/thirdParty');
//
//ThirdParty.getByUserId('5a29055b8f0237598c87f22f')
//  .then(res => {
//    console.log('====', res)
//  })


//ThirdParty.getAll()
//  .then(res => {
//    console.log('===', res)
//  })

User.authUser({ username: 'barry', password: 'password' })
  .then(user => {
    console.log(ThirdParty.getByUserId(user._id))
  })

