const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((db) => {

    // can be used findOneAndUpdate or other
    /* db.collection('Todos')
      .updateOne({
        _id: new ObjectID('5bcf56a676245b5b274a2806')
      }, {
        // instead of replacing whole object we should use update operators
        $set: { title: 'take pill and drink beeer!'},
      }, {
        // additional option to not return original pobject but updated one
        returnOriginal: false
      }
      )
      .then((res) => console.log(res)) */

      db.collection('Users')
        .findOneAndUpdate(
          {
            name: 'John',
            permissions: 'User'
          }, {
            $set: {
              permissions: 'Admin'
            },
            $inc: {
              age: 1
            }
          }, {
            returnOriginal: false
          }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err))

  })