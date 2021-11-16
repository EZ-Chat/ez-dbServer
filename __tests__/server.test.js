const { request } = require('express');
const server = require('../src/server.js');
const supertest = require('supertest');
const mockrequest = supertest('server');
const jwt = require('jsonwebtoken');

describe('Testing server', () => {

  it('should create a user on POST /signup', async() => {
    const response = await mockrequest.post('/signup');
    expect(response.status).toBe(201);
  });

  it('should sign in a user on /signin', async() => {
    const response = await mockrequest.post('/signin');
    expect(response.status).toBe(200)
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