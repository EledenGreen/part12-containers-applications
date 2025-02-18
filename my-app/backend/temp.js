const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = 3000

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://ell:tcNVov3QaFlsJoVh@cluster0.09jpazb.mongodb.net/testBlog?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

// Define a schema for your data
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
// Create a model based on the schema
const Blog = mongoose.model('Blog', blogSchema)

// Middleware to parse JSON
app.use(express.json())

// Route to handle POST request to create a new blog post
app.post('/blogs', async (req, res) => {
  try {
    const {
      title, author, url, likes,
    } = req.body
    const newBlog = new Blog({
      title, author, url, likes,
    })
    await newBlog.save()
    res.status(201).json({ message: 'Blog post created successfully' })
  } catch (err) {
    console.error('Error saving blog post:', err)
    res.status(500).json({ error: 'An error occurred while saving the blog post' })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
