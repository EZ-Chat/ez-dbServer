const { db, users } = require('../src/models/index');
const server = require('../src/server.js');
const supertest = require('supertest');
const mockrequest = supertest('server');
const jwt = require('jsonwebtoken');


beforeAll(async() => {
  await db.sync()
  await users.bulkCreate([
    {
      friendCode: 0,
      userName: 'vitortedario',
      password: 'password',
    }
  ]);
});

afterAll(async() => {
  await db.drop()
});

describe('Testing dbServer', () => {

  it('should create a user on POST /signup', async() => {
 
    const request = {
      userName: 'vitortedario',
      password: 'password',
      friendCode: null,
      friendsList: [],
      rooms: []
    }
    const response = await mockrequest.post('/signup').send(request);
    expect(response.body.userName).toStrictEqual('vitortedario');
    expect(response.body.password).toEqual(expect.any(String));
    expect(response.body.friendCode).toEqual(expect.any(String));
    expect(response.status).toBe(201);
  });

  it('should sign in a user on /signin', async() => {
    const response = await (await mockrequest.post('/signin')).setEncoding('Authorization', 'Basic SmF5c29uLkRlY2tvdzc3QHRlc3QuY29tOnBhc3N3b3Jk');
    expect(response.body).toStrictEqual(
      {
        friendCode: 0,
        userName: 'vitortedario',
        password: 'password',
      }
    );
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