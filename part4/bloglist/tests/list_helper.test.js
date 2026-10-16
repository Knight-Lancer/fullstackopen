const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const helper = require('../utils/list_helper')
const blogs = [
  { title: 'First', author: 'Alice', likes: 5 },
  { title: 'Second', author: 'Bob', likes: 10 },
  { title: 'Third', author: 'Alice', likes: 12 },
  { title: 'Fourth', author: 'Bob', likes: 7 },
  { title: 'Fifth', author: 'Alice', likes: 0 }
]
describe('list helpers, exercises 4.3–4.7', () => {
  test('dummy returns 1', () => assert.equal(helper.dummy([]), 1))
  test('totalLikes returns 0 for empty list', () => assert.equal(helper.totalLikes([]), 0))
  test('totalLikes returns one blog likes', () => assert.equal(helper.totalLikes([blogs[0]]), 5))
  test('totalLikes adds all likes', () => assert.equal(helper.totalLikes(blogs), 34))
  test('favoriteBlog returns null for empty list', () => assert.equal(helper.favoriteBlog([]), null))
  test('favoriteBlog returns highest likes', () => assert.deepEqual(helper.favoriteBlog(blogs), blogs[2]))
  test('mostBlogs returns null for empty list', () => assert.equal(helper.mostBlogs([]), null))
  test('mostBlogs returns highest count', () => assert.deepEqual(helper.mostBlogs(blogs), { author: 'Alice', blogs: 3 }))
  test('mostLikes returns null for empty list', () => assert.equal(helper.mostLikes([]), null))
  test('mostLikes aggregates per author', () => assert.equal(helper.mostLikes(blogs).likes, 17))
})
