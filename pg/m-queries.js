// objectID is an unique ID generator provided by mongodb
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {TodoModel} = require('./../server/models/todo');
const {UserModel} = require('./../server/models/user');

const id = '5bd080954909cd0422984bd8';

// checking if ID is valid

/* if(!ObjectID.isValid(id)){
  console.log('id is not valid');
  return;
} */

/* TodoModel.find({
    _id: id
  })
  .then((todos) => {
    if(todos.length === 0){
      throw Error('Unable to find an item with given id');
    }
  })
  .catch((err) => console.log(err.message)); */

/* TodoModel.findOne({
  _id: id
}).then((res) => console.log(res)); */

/* TodoModel
  .findById(id)
  .then((todo) => {
    if(!todo){
      console.log('Unable to find an item');
      return;
    }
    console.log(todo);
  })
  .catch((e) => {
    console.log(e.message);
  })
 */

if(ObjectID.isValid(id)){
  UserModel
    .findById(id)
    .then((item) => {
      if(!item){
        throw new Error('Unable to find item');
      } else {
        console.log(item);
      }
    })
    .catch((e) => console.log(e))
}

