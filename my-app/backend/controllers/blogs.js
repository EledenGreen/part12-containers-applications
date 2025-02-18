const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const { body } = request

  const { user } = request
  console.log(user)

  if (!(body.title) || !(body.url)) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    })

    const savedBlog = await blog.save()
    await savedBlog.populate('user')
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    console.log('Blog POST>>>> ', savedBlog)
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id

  const { user } = request

  const blogContent = await Blog.findById(blogId)

  if (user._id.toString() === blogContent.user._id.toString()) {
    await Blog.findByIdAndDelete(blogId)
    response.status(204).end()
  } else {
    response.status(400).json({ error: 'user does not match' })
  }
})

blogsRouter.patch('/:id', async (request, response) => {
  try {
    const { body } = request
    console.log('patch', body)
    const blog = {
      likes: body.likes,
    }
    console.log('patch', blog)
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    console.log('patch', updatedBlog)
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    response.status(500).json({ error: 'Server error' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const { body } = request
    console.log('backend before', body)
    const blog = {
      likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user')
    response.json(updatedBlog)
  } catch (error) {
    response.status(500).json({ error: 'Server error' })
  }
})

module.exports = blogsRouter
