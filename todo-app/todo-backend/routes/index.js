const express = require('express')
const router = express.Router()

const configs = require('../util/config')
const redis = require('../redis') // tocheck if redis is working
const { getAsync } = require('../redis/index')
let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

router.get('/statistics', async (_req, res) => {
  const counter = Number(await getAsync('added_todos'))
  res.send({
    added_todos: counter,
  })
})

module.exports = router
