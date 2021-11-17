const server = require('../src/server');
const supertest = require('supertest');
const mockrequest = supertest(server.server);
const faker = require('faker');
const base64 = require('base-64');


require("dotenv").config();
const mongoose = require('mongoose');
const { request } = require('express');

let db;

const testUser1 = {
  username: '',
  password: '',
  friendCode: null,
  friendsList: [],
  rooms: [],
}

const testUser2 = {
  username: '',
  password: '',
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
    const response = await mockrequest.post('/signup').send(
      {
        username: 'test68',
        password: 'password',
        friendCode: null,
        friendsList: [],
        rooms: [],
      }
    );
    testUser1.username = response.body.username;
    testUser1.password = response.body.password;
    testUser1.friendCode = response.body.friendCode;
    // expect(response.status).toBe(201);
    // expect(response.body.username).toStrictEqual('test68');
    // expect(response.body.password).toEqual(expect.any(String));
    // expect(response.body.friendCode).toEqual(expect.any(String));
  });

  it('should sign in a user on /signin', async() => {
    // const response = await mockrequest.post('/signin');
    // expect(response.body.userInfo.username).toStrictEqual('vitortedario');
    // expect(response.body.userInfo.password).toEqual(expect.any(String));
    // expect(response.status).toBe(200);

    await mockrequest.post('/signup').send({
      username: 'test01',
      password: 'password',
      friendCode: null,
      friendsList: [],
      rooms: [],
    });

    const encodedString = base64.encode('test01:password');
    const response = await mockrequest.post('/signin').set('authrorization', `Basic ${encodedString}`);

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