const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const api = supertest(app)
let user, otherUser, token, otherToken
const initialBlogs = [
  { title: 'First blog', author: 'Alice', url: 'https://example.com/one', likes: 2 },
  { title: 'Second blog', author: 'Bob', url: 'https://example.com/two', likes: 3 }
]
before(async () => { await app.databaseReady })
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password123', 4)
  user = await new User({ username: 'alice', name: 'Alice', passwordHash, blogs: [] }).save()
  otherUser = await new User({ username: 'bob', name: 'Bob', passwordHash, blogs: [] }).save()
  token = jwt.sign({ username: user.username, id: user.id }, config.SECRET)
  otherToken = jwt.sign({ username: otherUser.username, id: otherUser.id }, config.SECRET)
  const seeded = await Blog.insertMany(initialBlogs.map(b => ({ ...b, user: user.id })))
  user.blogs = seeded.map(b => b.id)
  await user.save()
})
after(async () => { await mongoose.connection.close() })
describe('Blog API: exercises 4.8–4.14', () => {
  test('GET /api/blogs returns JSON and correct count', async () => {
    const result = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.equal(result.body.length, initialBlogs.length)
  })
  test('blog ID is id instead of _id', async () => {
    const result = await api.get('/api/blogs')
    assert.ok(result.body[0].id)
    assert.equal(result.body[0]._id, undefined)
  })
  test('POST creates blog with token', async () => {
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Third', url: 'https://example.com/third', likes: 8 }).expect(201)
    assert.equal((await api.get('/api/blogs')).body.length, 3)
  })
  test('POST defaults likes to zero', async () => {
    const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Third', url: 'https://example.com/third' }).expect(201)
    assert.equal(result.body.likes, 0)
  })
  test('POST rejects missing title or url', async () => {
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ url: 'https://example.com' }).expect(400)
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Missing url' }).expect(400)
  })
  test('DELETE removes blog', async () => {
    const id = (await api.get('/api/blogs')).body[0].id
    await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).expect(204)
    assert.equal((await api.get('/api/blogs')).body.length, 1)
  })
  test('PUT updates likes', async () => {
    const id = (await api.get('/api/blogs')).body[0].id
    const result = await api.put(`/api/blogs/${id}`).send({ likes: 99 }).expect(200)
    assert.equal(result.body.likes, 99)
  })
})
describe('Users and authentication: exercises 4.15–4.23', () => {
  test('users are listed without password hashes', async () => {
    const result = await api.get('/api/users').expect(200)
    assert.equal(result.body.length, 2)
    assert.equal(result.body[0].passwordHash, undefined)
  })
  test('new user can be created', async () => {
    const result = await api.post('/api/users').send({ username: 'charlie', name: 'Charlie', password: 'secret123' }).expect(201)
    assert.equal(result.body.username, 'charlie')
    assert.equal(result.body.passwordHash, undefined)
  })
  test('invalid users are rejected', async () => {
    await api.post('/api/users').send({ username: 'ab', password: 'password' }).expect(400)
    await api.post('/api/users').send({ username: 'newuser', password: 'ab' }).expect(400)
    await api.post('/api/users').send({ username: 'alice', password: 'password' }).expect(400)
  })
  test('login returns signed token', async () => {
    const result = await api.post('/api/login').send({ username: 'alice', password: 'password123' }).expect(200)
    assert.ok(result.body.token)
    assert.equal(jwt.verify(result.body.token, config.SECRET).id, user.id)
  })
  test('login rejects wrong password', async () => {
    await api.post('/api/login').send({ username: 'alice', password: 'wrong' }).expect(401)
  })
  test('created blog links to authenticated user', async () => {
    const result = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Owned', url: 'https://example.com/owned' }).expect(201)
    assert.equal(result.body.user, user.id)
    const refreshed = await User.findById(user.id)
    assert.ok(refreshed.blogs.some(id => id.toString() === result.body.id))
  })
  test('POST rejects missing token', async () => {
    await api.post('/api/blogs').send({ title: 'No token', url: 'https://example.com' }).expect(401)
  })
  test('POST rejects invalid token', async () => {
    await api.post('/api/blogs').set('Authorization', 'Bearer invalid').send({ title: 'Invalid', url: 'https://example.com' }).expect(401)
  })
  test('other user cannot delete blog', async () => {
    const id = (await api.get('/api/blogs')).body[0].id
    await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${otherToken}`).expect(403)
  })
  test('GET blogs works without token and populates creator', async () => {
    const result = await api.get('/api/blogs').expect(200)
    assert.equal(result.body[0].user.username, 'alice')
  })
  test('GET users populates blogs', async () => {
    const result = await api.get('/api/users').expect(200)
    const alice = result.body.find(u => u.username === 'alice')
    assert.equal(alice.blogs.length, 2)
    assert.ok(alice.blogs[0].title)
  })
})
