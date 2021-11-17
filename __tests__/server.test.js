const server = require('../src/server');
const supertest = require('supertest');
const mockrequest = supertest(server.server);


require("dotenv").config();
const mongoose = require('mongoose');
const { JsonWebTokenError } = require('jsonwebtoken');

let db;

beforeAll(async() => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;

  db.once('open', ()=>console.log(`Connect to MongoDB at ${db.host}:${db.port}`));

  db.on('error', (error)=>console.log(`Database error`, error));

});

afterAll(async() => {
  db.close();
});


describe('Testing dbServer', () => {

  it('should create a user on POST /signup', async() => {
    const response = await mockrequest.post('/signup').send(
      {
        username: 'vitortedario',
        password: 'password',
        friendCode: null,
        friendsList: [],
        rooms: [],
      }
    );
    expect(response.status).toEqual(201);
    expect(response.body.username).toStrictEqual('vitortedario');
    expect(response.body.password).toEqual(expect.any(String));
    expect(response.body.friendCode).toEqual(expect.any(String));
  });

  it('should sign in a user on /signin', async() => {
    const response = await mockrequest.post('/signin');
    expect(response.body.userInfo.username).toStrictEqual('vitortedario');
    expect(response.body.userInfo.password).toEqual(expect.any(String));
    expect(response.status).toBe(200);
  });

  it('should update a user on PUT /user/:id', async() => {
    const response = await mockrequest.update('/user/:id');
    expect(response.status).toBe(200);
  });

  it('should remove a user on DELETE /user/:id', async() => {
    const response = await mockrequest.delete('/user/:id');
    expect(response.status).toBe(200);
  });
});