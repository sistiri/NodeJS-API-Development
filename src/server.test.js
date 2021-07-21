const app = require('./server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const config = require('config');
const Person = require('./models/person.model');

// const dbConfig = config.get('database');

describe('REST API integration tests', () => {
  const insertData = [
    {
      firstName: 'John',
      lastName: 'Test',
      email: 'john@test.com'
    },
    {
      firstName: 'Kate',
      lastName: 'Test',
      email: 'kate@test.com'
    }
  ];

  beforeEach(done => {
    const { username, password, host } = config.get('testDatabase');
    mongoose
      .connect(`mongodb+srv://${username}:${password}@${host}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        // logger.info('MongoDB connection has been established successfully');
        done();
      })
      .catch(err => {
        logger.error(err);
        process.exit()
      });
  });

  afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

  test('GET /person', () => {
    return Person.insertMany(insertData)
      .then(() => supertest(app).get('/person').expect(200))
      .then(response => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(insertData.length);

        response.body.forEach((person, index) => {
          expect(person.firstName).toBe(insertData[index].firstName);
          expect(person.lastName).toBe(insertData[index].lastName);
          expect(person.email).toBe(insertData[index].email);
        });
      });
  });
});