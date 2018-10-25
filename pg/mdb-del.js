const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp')
  .then((db) => {
    console.log('Connected to mongoDB server');

    // deleteMany
    /* db.collection('Todos')
      .deleteMany({
        completed: false
      })
      .then((res) => {
        console.log(res);
        db.close();
      }) */

    // deleteOne - deleting only first found document
    /* db.collection('Todos')
      .deleteOne({
        completed: false
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  */
    // findOneAndDelete - returning deleted object - can be used for e.g "undo delete" operation
    /* db.collection('Todos')
      .findOneAndDelete({
        completes: false
      })
      .then((res) => console.log(res)) */

    // excercise:
    /* db.collection('Todos')
      .findOneAndDelete({
        _id: new ObjectID('5bcf696176245b5b274a2b18')
      })
      .then((deleted) => console.log(deleted)) */

  })
  .catch((err) => console.log(err))