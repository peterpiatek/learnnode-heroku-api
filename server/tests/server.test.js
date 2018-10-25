//issues in this 

const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { TodoModel } = require('./../models/todo');
const {ObjectID} = require('mongodb');
// const { mongoose } = require('./../db/mongoose');
// const { UserModel } = require('./models/user')

/**
 * for GET testing we need to crete fake todos array which will seed db in beforeEach method
 */

const todos = [
  { 
    title: 'First test todo', 
    _id: new ObjectID()
  },
  { 
    title: 'Second test todo',
    _id: new ObjectID()
  },
  { 
    title: 'third test todo',
    _id: new ObjectID()
  }
];

/**
 * as we are using assumption todos.length to be 1 we must prepare testing environment for this assumption
 */

beforeEach((done) => {
  // whiping up all todos from db
  TodoModel
    .remove({})
    .then(() => {
      return TodoModel.insertMany(todos)
    })
    .then(() => done())
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const title = 'test title';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
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
      .expect(200)
      .expect((doc) => {
        expect(doc.body.todo.title).toBe(expectedTitle);
      })
      .end(done);
    
  })

  it('should should return status 400 for incorrect id', (done) => {

    request(app)
      .get('/todos/xxx')
      .expect(400)
      .end(done);
    
  })

  it('should return 404 if id is correct but item doesnt exists', (done) => {

    id = new ObjectID();

    request(app)
      .get('/todos/' + id)
      .expect(404)
      .end(done);
    
  })
})