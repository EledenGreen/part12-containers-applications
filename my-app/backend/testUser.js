/* const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

await User.deleteMany({})

const passwordHash = await bcrypt.hash('sekret', 10)
const user = new User({
  username: 'root',
  passwordHash,
  id: '662d7cd61509fdeda374ee68',
})

await user.save()
ex 11.21 PR
*/
