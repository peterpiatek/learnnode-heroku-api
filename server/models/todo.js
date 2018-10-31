const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  title: {
    type: String,
    require: true,
    minlength: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = { TodoModel: Todo }