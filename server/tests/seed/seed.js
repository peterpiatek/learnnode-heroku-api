/**
 * for GET testing we need to create fake todos array which will seed db in beforeEach method
 */

const {ObjectID} = require('mongodb');
const {UserModel} = require('./../../models/user');
const {TodoModel} = require('./../../models/todo');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
  {
    title: 'First test todo',
    _id: new ObjectID(),
    _creator: userOneId

  },
  {
    title: 'Second test todo',
    _id: new ObjectID(),
    _creator: userTwoId
  },
  {
    title: 'third test todo',
    _id: new ObjectID(),
    _creator: userTwoId
  }
];

const users = [
  {
    _id: userOneId,
    email: 'peter.piatek.gm@gmail.com',
    password: '123asd#',
    tokens: [
      { 
        access: 'auth', 
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'kamila.piatek@gmail.com',
    password: '321dsa#',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
]

const seedTodos = (done) => {
  // whiping up all todos from db
  TodoModel
    .remove({})
    .then(() => {
      return TodoModel.insertMany(todos)
    })
    .then(() => done());
}

const seedUsers = (done) =>{
  UserModel
    .remove({})
    .then(() => {
      const userOne = new UserModel(users[0]).save();
      const userTwo = new UserModel(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
}

module.exports = {
  todos,
  seedTodos,
  users,
  seedUsers
}

