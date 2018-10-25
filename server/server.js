const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');

// const { UserModel } = require('./models/user')
const { TodoModel } = require('./models/todo')

const PORT = process.env.PORT || 3000;

const app = express();

/**
 * middleware for getting body data
 * is getting JSON data and converting to an object which will be attached to app.post req
 * return value from bodyparser.json is a function wchich will be given to the express
 */
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new TodoModel({
    title: req.body.title
  })
  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    // force status value to be 400 to easy get it in tests
    res.status(400).send(err);
  })
})

app.get('/todos', (req, res) => {
  TodoModel
    .find()
    // sending todos in object in case we want to add some more metadata to data array
    .then((todos) => res.send({todos}))
}, (err) => {
  res.status(400).send(err);
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(400).send();
    return;

  } else {
    TodoModel.findById(id)
      .then((todo) => {
        if(!todo){
          res.status(404).send();
        } else {
          res.send({todo});
        }
      })
      .catch((e) => {
        res.status(400).send();
      })
  }
})

app.listen(PORT, () => {
  console.log('Started on port: ', PORT);
})

module.exports.app = app;





/* const newTodo = new TodoModel({
  title: 'Finish mongodb section'
})

// newTodo.save().then((doc) => console.log(doc));


const newUser = new UserModel({
  email: 'Kamila.Piatek@gmail.com'
})

newUser.save().then((doc) => console.log(doc)); */