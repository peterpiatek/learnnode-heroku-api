const mongoose = require('mongoose');

// setting up mongoose to use native promise features instead of any other
// default: mongoose is using callbacks to process result of query
mongoose.Promise = global.Promise;

// mongoose is managing queue of events to process, so we don't need to be bothered with it
mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');

module.exports = { mongoose };