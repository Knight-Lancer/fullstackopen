const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
router.get('/', async (_req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users)
})
router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (typeof username !== 'string' || username.trim().length < 3 || typeof password !== 'string' || password.length < 3) {
    return res.status(400).json({ error: 'username and password must each be at least 3 characters' })
  }
  if (await User.exists({ username: username.trim() })) return res.status(400).json({ error: 'expected `username` to be unique' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username: username.trim(), name, passwordHash, blogs: [] })
  const saved = await user.save()
  res.status(201).json(saved)
})
module.exports = router
