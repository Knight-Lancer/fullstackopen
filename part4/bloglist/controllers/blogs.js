const router = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })
  if (!blog) return res.status(404).end()
  res.json(blog)
})
router.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  if (typeof title !== 'string' || !title.trim() || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'title and url are required' })
  }
  const blog = new Blog({ title, author, url, likes: likes ?? 0, user: req.user._id })
  const saved = await blog.save()
  req.user.blogs.push(saved._id)
  await req.user.save()
  res.status(201).json(saved)
})
router.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(404).end()
  if (!blog.user || blog.user.toString() !== req.user.id) return res.status(403).json({ error: 'only the creator can delete this blog' })
  await Blog.findByIdAndDelete(blog.id)
  await req.user.updateOne({ $pull: { blogs: blog._id } })
  res.status(204).end()
})
router.put('/:id', async (req, res) => {
  const updates = {}
  for (const field of ['title', 'author', 'url', 'likes']) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) updates[field] = req.body[field]
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
  if (!blog) return res.status(404).end()
  res.json(blog)
})
module.exports = router
