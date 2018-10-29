const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  }, 'secretval').toString();

  // because of some inconsistences between mongodb versions instead of using push it's better to use concat method 
  user.tokens = user.tokens.concat([{ access, token }]);
  
  // user.save: because we only update local user model we need to save changes
  // return user.save: in server.js we'll .then methods to chain code completion. Usually we return a promise but this time we just return a value (token);
  return user.save().then(() => {
    return token;
  })
}

var User = mongoose.model('User', UserSchema)

module.exports = {
  UserModel: User
}