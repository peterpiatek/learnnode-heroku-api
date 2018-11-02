require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

const { mongoose } = require('./db/mongoose');
const { UserModel } = require('./models/user')
const { TodoModel } = require('./models/todo')
const { authenticate } = require('./../server/middleware/authenticate')

const app = express();

/**
 * middleware for getting body data
 * is getting JSON data and converting to an object which will be attached to app.post req
 * return value from bodyparser.json() is a function wchich will be given to the express
 */
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const newTodo = new TodoModel({
    title: req.body.title,
    _creator: req.user._id
  })
  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    // force status value to be 400 to easy get it in tests
    res.status(400).send(err);
  })
})

app.get('/todos', authenticate, (req, res) => {
  TodoModel
    .find({
      _creator: req.user._id
    })
    // sending todos in object in case we want to add some more metadata to data array
    .then((todos) => res.send({todos}))
}, (err) => {
  res.status(400).send(err);
})

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(400).send();
    return;

  } else {
    // after we use authentication is good to narrow results to just those with _creator value same as authenticated user
    TodoModel.findOne({
      _id: id,
      _creator: req.user._id
    })
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

app.delete('/todos/:id', authenticate, (req, res) => {
  
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(400).send();
    return;
  }

  TodoModel
  .findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then((todo) => {
      if(!todo){
        res.status(404).send()  
      } else {
        res.status(200).send({todo})
      }
    })
    .catch((err) => {
      res.status(400).send()
    })

})

app.patch('/todos/:id', authenticate, (req, res) => {

  // object to be used to update a db doc
  // lodash used to check if only restricted params from the req body are passed
  const body = _.pick(req.body, ['title', 'completed']);
  const id = req.params.id;

  // id validation
  if(!ObjectID.isValid(id)){
    res.status(400).send();
    return;
  }

  // lodash to check if JSON from req is boolean, 
  // if yes and if completed: true - setting date of completion to existing body object
  // if false: setting completedAt to null 
  if(_.isBoolean(body.completed) && body.completed === true){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // updating an item
  // $set - mongodb marker to update db document
  // new: true - to return new doc instead of an old one
  TodoModel.findOneAndUpdate({
  _id: id,
  _creator: req.user._id
  }, {$set: body}, {new: true})
    // if item existed and it's updated or if not existed:
    .then((newItem) => {
      if(!newItem){
        res.status(404).send();
        return;
      }

      res.send({newItem});
      
    })
    .catch((e) => {
      res.status(400).send();
    })
  
})

app.post('/users', async (req, res) => {

  const body = _.pick(req.body, ['email', 'password']);
  const newUser = new UserModel(body);

  try {
    await newUser.save()
    const token = await newUser.generateAuthToken();
    res.header('x-auth', token).send({user: newUser});

  } catch (err) {
    res.status(400).send(err);
  }
    
})

// logging in

app.post('/users/login', async (req, res) => {

  const body = _.pick(req.body, ['email', 'password']);

  try {
    const user = await UserModel.findByCredentials(body);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({user});

  } catch (err) {
    res.status(400).send(err);
  }  
})

// Logging out

app.delete('/users/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
})


/**
 * getting user by token, veryfying token
 */
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.listen(process.env.PORT, () => {
  console.log('Started on port: ', process.env.PORT);
})

module.exports.app = app;


/* TodoModel
.findByIdAndRemove(id)
  .then((doc) => {
    if(!doc){
      res.status(404).send()  
    } else {
      res.status(200).send(doc)
    }
  })
  .catch((err) => {
    res.status(400).send()
  }) 
}) */




/* const newTodo = new TodoModel({
  title: 'Finish mongodb section'
})

// newTodo.save().then((doc) => console.log(doc));


const newUser = new UserModel({
  email: 'Kamila.Piatek@gmail.com'
})

newUser.save().then((doc) => console.log(doc)); */