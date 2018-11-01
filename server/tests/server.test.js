//issues in this 

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const { app } = require('./../server');
const { TodoModel } = require('./../models/todo');
const { UserModel } = require('./../models/user');
const { todos, seedTodos, users, seedUsers } = require('./seed/seed');


/**
 * as we are using assumption todos.length to be 1 we must prepare testing environment for this assumption
 */

beforeEach(seedUsers);
beforeEach(seedTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const title = 'test title';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ title })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
      })
      // we still need to check for errors and also we can check if data are really saved to the db so:
      .end((err, res) => {
        /**
         * func is used to check for errors and generate db query to check if item is added
         * return: to finish execution at this point
         * done() to finish async testing with err send as a result
         */         
        if(err) {
          done(err);
          return;
        };

        // mongoose method to get collection
        TodoModel
          .find({ title: title })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].title).toBe(title);
            done();
          })
          // as we use then - we must check for any errors witch catch
          .catch((err) => {
            done(err);
          })
      })
  })

  it('should not create todo with invalid data', (done) => {

    const title = '';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({title})
      .expect(400)
      .expect((err) => {
        // console.log(err.error.status);
      })
      .end((err, res) => {

        if(err){
          done(err);
          return;
        }

        TodoModel
          .find()
          .then((todos) => {
            // to be 3 because we seed db with 3 items
            expect(todos.length).toBe(3)
            done();
          })
          .catch((err) => {
            done(err)
          })
      });
  })

  it('should get all todos', (done) => {

    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1); // only 1 todo created for first user
      })
      .end(done);
    
  })
  
})

describe('GET /todos:id', () => {
  it('should get todo for a given id', (done) => {

    const id = todos[0]._id;
    const expectedTitle = todos[0].title;

    request(app)
      .get('/todos/' + id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((doc) => {
        expect(doc.body.todo.title).toBe(expectedTitle);
      })
      .end(done);
    
  })

  it('should NOT get todo for user who did not create task', (done) => {

    const id = todos[1]._id;
    const expectedTitle = todos[0].title;

    request(app)
      .get('/todos/' + id.toHexString())
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    
  })

  it('should should return status 400 for incorrect id', (done) => {

    request(app)
      .get('/todos/xxx')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
    
  })

  it('should return 404 if id is correct but item doesnt exists', (done) => {

    id = new ObjectID();

    request(app)
      .get('/todos/' + id)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete first item', (done) => {

    const id = todos[0]._id.toHexString();
    const title = todos[0].title;

    request(app)
      .delete('/todos/'+ id)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((doc) => {
        expect(doc.body.todo.title).toBe(title)
      })
      .end((err) => {

        if(err){
          done(err);
          return;
        }

        // first method
        /* TodoModel
          .find()
          .then((todos) => {
            
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => {
            done(e);
          }) */

          // other method
          TodoModel
            .findById(id)
            .then((todo) => {
              expect(todo).toBeFalsy();
              done();
            })
            .catch((e) => done(e))

      })
  })

  it('should NOT delete item if creator is not logged in user', (done) => {

    const id = todos[1]._id.toHexString();

    request(app)
      .delete('/todos/'+ id)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err) => {
        if(err){
          done(err);
          return;
        }
          // check db if still exist
          TodoModel
            .findById(id)
            .then((todo) => {
              expect(todo).toBeTruthy();
              done();
            })
            .catch((e) => done(e))
      })
  })

  it('should return 404 if item doesn\'t exist', (done) => {
    
    const id = new ObjectID()

    request(app)
      .delete('/todos/'+id)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
    
  })

  it('should return 400 if id is wrong', (done) => {

    const id = 'xxx';

    request(app)
      .delete('/todos/'+id)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);

  })
  
})

describe('PATCH /todos/id', () => {

  it('should update item', (done) => {

    const id = todos[0]._id.toHexString();
    const body = { 'title': 'item patched', 'completed': true }
    const expectedTitle = 'item patched';

    request(app)
      .patch('/todos/'+id)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      // check what is comming back after request is done
      .expect((res) => {
        expect(res.body.newItem.title).toBe(expectedTitle);
        expect(res.body.newItem.completed).toBe(body.completed);
        expect(res.body.newItem.completedAt).not.toBe(null);
      })
      .end((err) => {
        if(err){
          done(err);
          return;
        }
        // check whatchanges done directly in the db
        TodoModel.findById(id)
          .then((newItem) => {
            // check title
            expect(newItem.title).toBe(expectedTitle);
            // check completed
            expect(newItem.completed).toBe(true);
            // check if completion time is added
            expect(newItem.completedAt).not.toBe(null);
            done();
          })
          .catch((err) => {
            done(err)
          })
        
      });

  })

  it('should NOT update item if creator is not logged in user', (done) => {

    const id = todos[1]._id.toHexString();
    const body = { 'title': 'item patched', 'completed': true }
    const expectedTitle = 'item patched';

    request(app)
      .patch('/todos/'+id)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(404)
      // check what is comming back after request is done
      .end((err) => {
        if(err){
          done(err);
          return;
        }
        // check whatchanges done directly in the db
        TodoModel.findById(id)
          .then((newItem) => {
            // check title
            expect(newItem.title).not.toBe(expectedTitle);
            // check completed
            expect(newItem.completed).toBe(false);
            // check if completion time is added
            expect(newItem.completedAt).toBe(null);
            done();
          })
          .catch((err) => {
            done(err)
          })
        
      });

  })
  
})

describe('POST /users/', () => {
  it('should add user with provided email and ID', (done) => {

    const body = { "email": "user@email.com", "password": "asdasd" }

    request(app)
      .post('/users')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user._id).toBeTruthy();
        expect(res.body.user.email).toBe(body.email);
      })
      .end((err) => {
        if(err){
          done(err);
          return;
        }
        UserModel.find({email: body.email})
          .then((users) => {
            expect(users[0].email).toBe(body.email);
            
            // checking if hashing is done properly
            const hashedPassword = users[0].password;
            bcrypt.compare(body.password, hashedPassword).then((matchResult) => {
              expect(matchResult).toBe(true);
            });

            done();
          })
          .catch(err => done(err))
      })
  })

  it('should NOT create user if email or password is not valid', (done) => {

    const body = { "email": "PeterPiatek.gm", "password": "asd" }

    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('User validation failed');
      })
      .end((err, res) => {
        if(err){
          done(err);
          return;
        }
        UserModel.find({email: body.email}).then((users) => {
          expect(users[0]).toBeFalsy();
          done();
        })
        
      });
    
  })
  
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {

    const token = users[0].tokens[0].token;

    request(app)
      .get('/users/me')
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    
  });
  it('should return 401 if not authenticated', (done) => {

    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);

  })

})

describe('POST /users/login', () => {
  it('should log in user and return x-auth token', (done) => {

    const dbUserEmail = users[0].email;
    const dbUserPassword = users[0].password;
    const body = { email: dbUserEmail, password: dbUserPassword }

    request(app)
      .post('/users/login')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.user.email).toBe(dbUserEmail);
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          done(err);
          return;
        }

        // checking if token generated for the user and sent in response is the same as the one written to db
        UserModel.findById(users[0]._id)
          .then((user) => {
            // tokens[1] 1- because there is one default token for that user, newly generated token is as second object in the tokens array
            expect(user.toObject().tokens[1]).toMatchObject({
              'access': 'auth',
              'token': res.header['x-auth']
            });
            done();
          })
          .catch((err) => {
            done(err);
          })
        
      });
    
  })

  it('should reject invalid login', (done) => {

    const dbUserEmail = users[0].email;
    const dbUserPassword = 'xxx';
    const body = { email: dbUserEmail, password: dbUserPassword }

    request(app)
      .post('/users/login')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({});
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err){
          done(err);
          return;
        }

        UserModel.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch((err) => {
            done(err);
          })
        
      });
  })
})

describe('DELETE /users/me/token', () => {
  it('should delete user token', (done) => {

    const token = users[0].tokens[0].token;
    const id = users[0]._id;

    request(app)
      .delete('/users/logout')
      .set({'x-auth': token})
      .expect(200)
      .end((err, res) => {
        if(err){
          done(err);
          return;
        }

        UserModel.findById(id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
      })
  })
})