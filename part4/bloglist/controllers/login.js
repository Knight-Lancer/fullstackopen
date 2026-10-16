const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../utils/config')
router.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = typeof username === 'string' ? await User.findOne({ username }) : null
  const valid = user && typeof password === 'string' && await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: 'invalid username or password' })
  const token = jwt.sign({ username: user.username, id: user.id }, config.SECRET, { expiresIn: '1h' })
  res.json({ token, id: user.id, username: user.username, name: user.name })
})
module.exports = router
