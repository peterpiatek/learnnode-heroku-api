const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
  (err, db) => {
    if(err){
      return console.log('Unable to connect to the collection', err);
    }
    console.log('Connected toDB');

    // find is returning cursor (as records may be couple of thousands - it's to preven low performance)
    // coursor methods are to get more from returned cursor
    /* db.collection('Todos')
      .find({
        _id: new ObjectID('5bcf569776245b5b274a2804')
      })
      .toArray().then((arr) => {
        console.log(typeof arr);
        console.log(arr);
      }, (err) => {
        console.log('Unable to fetch todos', err);
      }) */


    /* db.collection('Todos')
      .find()
      .count()
      .then((err, count) => {
        if(err) return console.log(err);
        console.log(count);

        db.close();
      }) */
    
    // fetching all collections
    /* db.collections((err, collections) => {
      for (let i = 0; i < collections.length; i++) {
        console.log(collections[i].s.name);
      }
    }) */

    db.collection('Users')
      .find({
        permissions: 'Admin'
      })
      .toArray()
      .then((err, docs) => {
        if(err) return console.log(err);
        console.log(docs);
        db.close();
      })

      
    
  })