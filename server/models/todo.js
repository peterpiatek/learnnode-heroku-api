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
  }
})

module.exports = { TodoModel: Todo }