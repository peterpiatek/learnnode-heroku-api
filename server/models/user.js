const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: [true, 'You must add an email to create an account'],
    minlength: 1,
    trim: true
  }
})

module.exports = { UserModel: User }