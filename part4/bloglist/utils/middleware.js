const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')
const requestLogger = (req, _res, next) => { logger.info(req.method, req.path); next() }
const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization')
  req.token = authorization && /^Bearer /i.test(authorization) ? authorization.slice(7) : null
  next()
}
const userExtractor = async (req, res, next) => {
  try {
    if (!req.token) return res.status(401).json({ error: 'token missing' })
    const decoded = jwt.verify(req.token, config.SECRET)
    if (!decoded.id) return res.status(401).json({ error: 'token invalid' })
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ error: 'user not found' })
    next()
  } catch (error) { next(error) }
}
const unknownEndpoint = (_req, res) => res.status(404).json({ error: 'unknown endpoint' })
const errorHandler = (error, _req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') return res.status(400).json({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
  if (error.code === 11000) return res.status(400).json({ error: 'expected `username` to be unique' })
  if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'token invalid' })
  if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'token expired' })
  next(error)
}
module.exports = { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
