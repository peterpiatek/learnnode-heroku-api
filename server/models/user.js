const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'You must add an email to create an account'],
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email address is invalid'
    },
  },
  password: {
    type: String,
    required: [true, 'You must add password'],
    minlength: 6,
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

UserSchema.statics.findByCredentials = function (body){
  
  return this.findOne({email: body.email})
    .then((user) => {
      if(!user){
        return Promise.reject('Unable to find user');
      } else {
        return bcrypt.compare(body.password, user.password)
          .then((matchResult) => {
            if(matchResult){
              return user;
            } else {
              return Promise.reject('incorrect password')
            }
          })
      }
    })
}

UserSchema.statics.findByToken = function (token){

  const User = this;
  let decoded;

  // checking if token is not manipulated
  try {
    // jwt is returning { _id, access, iat } / iat: timestamp of token creation
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return Promise.reject('token is corrupted');  
  }

  // success case: if token is correct:
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
  
}

// mongoose middleware (for built in methods)
// it's doing pre of post modifications of async code (like save, remove, findOne)

UserSchema.pre('save', function(next) {

  const user = this;
  // to not let middleware run in every query we need to use method to check if password is changed to use this middleware
  if(user.isModified('password')){
    bcrypt.genSalt(1, (err, salt) => {
      if(err){
        next(err);
      } else {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if(err){
            next(err)
          } else {
            user.password = hash;
            next();
          }
        })
      }
    })
  } else {
    next();
  }

  // next();
})


// overriding below's method to update how mongoose handle content returned in response obj
UserSchema.methods.toJSON = function (){
  const user = this;

  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
  
};

// generating new user's token and returnin a promise like object
UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET).toString();

  // because of some inconsistences between mongodb versions instead of using push it's better to use concat method 
  user.tokens = user.tokens.concat([{ access, token }]);
  
  // user.save: because we only update local user model we need to save changes
  // return user.save: in server.js we'll .then methods to chain code completion. Usually we return a promise but this time we just return a value (token);
  return user.save().then(() => {
    return token;
  })
}

UserSchema.methods.removeToken = function (token){
  const user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
  
}


var User = mongoose.model('User', UserSchema)

module.exports = {
  UserModel: User
}