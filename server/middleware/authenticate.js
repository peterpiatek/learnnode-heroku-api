const {UserModel} = require('./../models/user');

// creating middleware to modify each html requests  "on the fly"

const authenticate = (req, res, next) => {
  // getting token from headers
  const token = req.header('x-auth');

  //lookup for user, method (findByUser) created on schema.static as it will be re-usable  
  UserModel.findByToken(token)
    .then((user) => {
      if(!user){
        return Promise.reject('Unable to find user');
      } else {
        req.user = user;
        req.token = token;
        next();
      }
    })
    .catch((err) => {
      res.status(401).send(err);
    })
}

module.exports = {authenticate}