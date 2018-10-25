// const MongoClient = require('mongodb').MongoClient;

// destructuring as a method for quick variables generation from objects
/* const { MongoClient, ObjectID } = require('mongodb');

// ObjectID - mongodb object to generate unique IDs
var obj = new ObjectID();
console.log(obj); */


/** connect
 * param: url to the db
 * param: cb as a handler for connection success / failure
 * 'mongodb': mongo protocol to connect to db
 * '/TodoApp' database name
 */
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    // return added just to break the program
    return console.log('Unable to connect to Mongo DB server');    
  }
  console.log('Connected to MongoDB server') 

  /* db.collection('Users')
    .insertOne({
      // _id: 123,
      name: 'Peter',
      permissions: 'Admin'
    }, (err, res) => {
      if(err){
        return console.log('Unable to add user', err);
      }
      console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2))
    }) */



  db.close(); 
  
})
