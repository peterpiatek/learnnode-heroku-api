const mongoose = require('mongoose');

// setting up mongoose to use native promise features instead of any other
// default: mongoose is using callbacks to process result of query
mongoose.Promise = global.Promise;

// mongoose is managing queue of events to process, so we don't need to be bothered with it
mongoose.connect( process.env.MONGODB_URI);

module.exports = { mongoose };