const express = require('express')
const { Todo } = require('../mongo')
const { setAsync, getAsync } = require('../redis/index')
const router = express.Router()

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })
  let currentCounter = Number(await getAsync('added_todos'))
  console.log(currentCounter)
  console.log(typeof currentCounter)
  if (isNaN(currentCounter)) {
    currentCounter = 0
  }
  currentCounter++
  await setAsync('added_todos', currentCounter)
  let newCounter = await getAsync('added_todos')
  console.log('counter', newCounter)
  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  req.id = id

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo)
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const body = req.body

  const todo = {
    text: body.text,
    done: body.done,
  }

  const updatedTodo = await Todo.findByIdAndUpdate(req.id, todo, {
    new: true,
  })
  console.log(updatedTodo)
  res.json(updatedTodo)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
