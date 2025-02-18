const bcrypt = require('bcrypt')
const User = require('../models/user')
const {
  test, after, beforeEach, describe,
} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const jwt = require('jsonwebtoken')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const rootUserId = new mongoose.Types.ObjectId('662daae10d4c31cad668c2a3')

    const passwordHash = await bcrypt.hash('userSecret', 10)
    const user = new User({ username: 'UserRoot', passwordHash, _id: rootUserId })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const token = jwt.sign(newUser, process.env.SECRET, { expiresIn: 60 * 60 })

    await api
      .post('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('Invalid users are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'a',
    }

    const token = jwt.sign(newUser, process.env.SECRET, { expiresIn: 60 * 60 })

    const result = await api
      .post('/api/users')
      .set({ Authorization: `Bearer ${token}` })
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
