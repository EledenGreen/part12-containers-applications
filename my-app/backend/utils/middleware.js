const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./loggerr')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'Unauthorized') {
    return response.status(401).json({ error: 'invalid Password' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = await authorization.replace('Bearer ', '')
    request.token = token
  } else if (!authorization || !(authorization.startsWith('Bearer '))) {
    return response.status(401).json({ error: 'Unauthorized' }).end()
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  const loginUser = await User.findById(decodedToken.id)
  request.user = loginUser

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
