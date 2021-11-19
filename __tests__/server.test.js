const server = require('../src/server');
const supertest = require('supertest');
const mockrequest = supertest(server.server);
const base64 = require('base-64');
const faker = require('faker');

require("dotenv").config();
const mongoose = require('mongoose');
const { request } = require('express');
const { signin } = require('../src/models/routes');

let db;

const testUser1 = {
  username: faker.name.firstName(),
  password: 'password',
  friendCode: null,
  friendsList: [],
  rooms: [],
}

const testUser2 = {
  username: faker.name.firstName(),
  password: 'password',
  friendCode: null,
  friendsList: [],
  rooms: [],
}

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
    const response = await mockrequest.post('/signup').send(testUser1);
    testUser1.friendCode = response.body.friendCode;
    expect(response.status).toBe(201);
  });

  it('should sign in a user on /signin', async() => {
    await mockrequest.post('/signup').send(testUser2);
    const encodedString = base64.encode(`${testUser2.username}:${testUser2.password}`);
    const response = await mockrequest.post('/signin').set('authorization', `Basic ${encodedString}`);

    expect(response.status).toBe(200);
  });

  it('can succesfully add a friend', async() => {
    const signinResponse = await mockrequest.post('/signin').auth(testUser2.username, 'password');
    const token = signinResponse.body.userInfo.token;
    const response = await mockrequest.put('/addFriend')
    .set('Authorization', `Bearer ${token}`)
    .send({
      friendCode: testUser1.friendCode
    });
    expect(response.status).toBe(200);
  });
});
